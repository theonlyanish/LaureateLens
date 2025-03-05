import { useState, useEffect, useCallback } from 'react';
import { fetchLaureates, Laureate } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import LaureateCard from './LaureateCard';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const Laureates = () => {
  const [laureates, setLaureates] = useState<Laureate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLaureate, setSelectedLaureate] = useState<Laureate | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const ITEMS_PER_PAGE = 25;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadLaureates = useCallback(async (reset: boolean = false) => {
    if (reset) {
      setPage(0);
      setLaureates([]);
    }

    setLoading(true);
    setError(null);
    try {
      const currentPage = reset ? 0 : page;
      const response = await fetchLaureates(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
      
      if (reset) {
        setLaureates(response.laureates || []);
      } else {
        setLaureates(prev => [...prev, ...(response.laureates || [])]);
      }
      
      setHasMore((response.laureates || []).length === ITEMS_PER_PAGE);
      if (!reset) {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch laureates');
      setHasMore(false);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  useEffect(() => {
    loadLaureates(true);
  }, [debouncedSearchTerm]);

  const handleLoadMore = () => {
    loadLaureates();
  };

  const filteredLaureates = laureates.filter(laureate => 
    laureate.knownName?.en?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    laureate.nobelPrizes?.some(prize => 
      prize.category?.en?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  );

  if (isInitialLoad) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search laureates by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => loadLaureates(true)}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => loadLaureates(true)}>
              Retry
            </Button>
          }
        >
          Error: {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredLaureates.map(laureate => (
          <Grid item xs={12} sm={6} md={4} key={laureate.id}>
            <LaureateCard 
              laureate={laureate}
              onSelect={(laureate) => setSelectedLaureate(laureate)}
            />
          </Grid>
        ))}
        {filteredLaureates.length === 0 && !loading && (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              color: 'text.secondary', 
              py: 4,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}>
              {searchTerm ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    No laureates found
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your search terms or clear the search to see all laureates.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    No laureates available
                  </Typography>
                  <Typography variant="body2">
                    Try refreshing the page or check back later.
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {loading && !isInitialLoad && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {hasMore && !loading && filteredLaureates.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      <Dialog 
        open={!!selectedLaureate} 
        onClose={() => setSelectedLaureate(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedLaureate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedLaureate.knownName?.en || 'Unknown Name'}
                <IconButton onClick={() => setSelectedLaureate(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Typography variant="body1">
                  Detailed information about this laureate will be added in the next phase.
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Laureates; 