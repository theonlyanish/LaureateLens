import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchUsers, User } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import UserCard from './UserCard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
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

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Memoized filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.company.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const compareResult = a[sortConfig.field].toLowerCase()
        .localeCompare(b[sortConfig.field].toLowerCase());
      return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    });
  }, [users, debouncedSearchTerm, sortConfig]);

  // Handler for sorting
  const handleSort = (field: 'name' | 'email') => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <TextField
          fullWidth
          size="medium"
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            maxWidth: '400px',
            flex: '0 1 auto',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              borderRadius: '4px',
              '& fieldset': {
                borderColor: '#2196f3',
              },
              '&:hover fieldset': {
                borderColor: '#64b5f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2196f3',
              },
            }
          }}
        />
        <ButtonGroup variant="contained">
          <Button
            onClick={() => handleSort('name')}
            endIcon={sortConfig.field === 'name' ? 
              (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : null}
          >
            Sort by Name
          </Button>
          <Button
            onClick={() => handleSort('email')}
            endIcon={sortConfig.field === 'email' ? 
              (sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : null}
          >
            Sort by Email
          </Button>
        </ButtonGroup>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => loadUsers()}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
          {retryCount > 0 && <div>Retrying... (Attempt {retryCount}/3)</div>}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedUsers.length > 0 ? (
            filteredAndSortedUsers.map(user => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard user={user} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Users; 