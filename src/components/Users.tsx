import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchUsers, User } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import SortControls from './SortControls';
import styles from '../styles/Users.module.css';

// Interface for sorting configuration
interface SortConfig {
  field: 'name' | 'email';
  direction: 'asc' | 'desc';
}

// User container component
const Users = () => {
  // State management for users and UI
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [retryCount, setRetryCount] = useState(0);

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load users with retry mechanism
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
      // Reset retry count on successful load
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadUsers();
        }, timeout);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  //Load users
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Memoized filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    // First, filter users based on search term
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.company.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    // Then sort the filtered results
    return [...filtered].sort((a, b) => {
      const compareResult = a[sortConfig.field].toLowerCase()
        .localeCompare(b[sortConfig.field].toLowerCase());
      return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    });
  }, [users, debouncedSearchTerm, sortConfig]);

  // Handler for search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handler for sorting
  const handleSort = (field: 'name' | 'email') => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className={styles['users-container']}>
      <div className={styles['users-controls']}>
        <SearchBar onSearch={handleSearch} />
        <SortControls 
          onSort={handleSort} 
          currentSort={sortConfig}
        />
        <button 
          onClick={() => loadUsers()}
          className={styles['refresh-button']}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className={styles['error-message']}>
          <p>Error: {error}</p>
          {retryCount > 0 && <p>Retrying... (Attempt {retryCount}/3)</p>}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading users...</div>
      ) : (
        <div className={styles['users-grid']}>
          {filteredAndSortedUsers.length > 0 ? (
            filteredAndSortedUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className={styles['no-results']}>
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users; 