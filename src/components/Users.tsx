import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchUsers, User } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import UserCard from './UserCard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';

interface SortConfig {
  field: 'name' | 'email';
  direction: 'asc' | 'desc';
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [retryCount, setRetryCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  const handleSort = (field: 'name' | 'email') => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => handleSort('name')}
            variant={sortConfig.field === 'name' ? 'contained' : 'outlined'}
            endIcon={sortConfig.field === 'name' && (
              sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
            )}
          >
            Name
          </Button>
          <Button
            onClick={() => handleSort('email')}
            variant={sortConfig.field === 'email' ? 'contained' : 'outlined'}
            endIcon={sortConfig.field === 'email' && (
              sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
            )}
          >
            Email
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
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          <div>Error: {error}</div>
          {retryCount > 0 && <div>Retrying... (Attempt {retryCount}/3)</div>}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
        <Grid container spacing={3}>
          {filteredAndSortedUsers.length > 0 ? (
            filteredAndSortedUsers.map(user => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard user={user} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard user={user} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </Box>
            </Grid>
          )}
        </Grid>
        </Grid>
      )}
    </Box>
    </Box>
  );
};

export default Users;