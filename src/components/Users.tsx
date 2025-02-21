import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, User } from '../services/api';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import SortControls from './SortControls';

// User container component
const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (field: 'name' | 'email') => {
    const sorted = [...filteredUsers].sort((a, b) =>
      a[field].toLowerCase().localeCompare(b[field].toLowerCase())
    );
    setFilteredUsers(sorted);
  };

  return (
    <div className="users-container">
      <div className="users-controls">
        <SearchBar onSearch={handleSearch} />
        <SortControls onSort={handleSort} />
        <button 
          onClick={loadUsers}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="no-results">
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users; 