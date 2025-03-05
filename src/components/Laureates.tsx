import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchLaureates, Laureate } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import LaureateCard from './LaureateCard';
import LaureateListItem from './LaureateListItem';
import LaureateDialog from './LaureateDialog';
import FilterBar, { Filters } from './FilterBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Laureates = () => {
  const [laureates, setLaureates] = useState<Laureate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLaureate, setSelectedLaureate] = useState<Laureate | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    yearRange: [1901, new Date().getFullYear()],
    country: '',
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const ITEMS_PER_PAGE = 25;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Extract unique categories and countries from laureates
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    laureates.forEach(laureate => {
      laureate.nobelPrizes.forEach(prize => {
        if (prize.category?.en) {
          uniqueCategories.add(prize.category.en);
        }
      });
    });
    return Array.from(uniqueCategories).sort();
  }, [laureates]);

  const countries = useMemo(() => {
    const uniqueCountries = new Set<string>();
    laureates.forEach(laureate => {
      if (laureate.birth?.place?.country?.en) {
        uniqueCountries.add(laureate.birth.place.country.en);
      }
    });
    return Array.from(uniqueCountries).sort();
  }, [laureates]);

  // Get the year range from the laureates
  const yearRange = useMemo(() => {
    let minYear = 1901;
    let maxYear = new Date().getFullYear();
    
    if (laureates.length > 0) {
      laureates.forEach(laureate => {
        laureate.nobelPrizes.forEach(prize => {
          const year = parseInt(prize.awardYear);
          if (!isNaN(year)) {
            minYear = Math.min(minYear, year);
            maxYear = Math.max(maxYear, year);
          }
        });
      });
    }
    
    return [minYear, maxYear] as [number, number];
  }, [laureates]);

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

  const filteredAndSortedLaureates = useMemo(() => {
    return laureates
      .filter(laureate => {
        // Name and thesis search
        const searchTermLower = debouncedSearchTerm.toLowerCase();
        const nameMatch = laureate.knownName?.en
          ?.toLowerCase()
          .includes(searchTermLower);
        const thesisMatch = laureate.nobelPrizes.some(prize =>
          prize.motivation?.en?.toLowerCase().includes(searchTermLower)
        );

        // Category filter
        const categoryMatch = filters.categories.length === 0 || 
          laureate.nobelPrizes.some(prize => 
            filters.categories.includes(prize.category?.en || ''));

        // Year range filter
        const yearMatch = laureate.nobelPrizes.some(prize => {
          const year = parseInt(prize.awardYear);
          return year >= filters.yearRange[0] && year <= filters.yearRange[1];
        });

        // Country filter
        const countryMatch = !filters.country || 
          laureate.birth?.place?.country?.en === filters.country;

        return (nameMatch || thesisMatch) && categoryMatch && yearMatch && countryMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name') {
          const nameA = a.knownName?.en || '';
          const nameB = b.knownName?.en || '';
          return filters.sortDirection === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else { // year
          const yearA = parseInt(a.nobelPrizes[0]?.awardYear || '0');
          const yearB = parseInt(b.nobelPrizes[0]?.awardYear || '0');
          return filters.sortDirection === 'asc' 
            ? yearA - yearB
            : yearB - yearA;
        }
      });
  }, [laureates, debouncedSearchTerm, filters]);

  if (isInitialLoad) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        countries={countries}
        yearRange={yearRange}
      />

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

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredAndSortedLaureates.map(laureate => (
            <Grid item xs={12} sm={6} md={4} key={laureate.id}>
              <LaureateCard 
                laureate={laureate}
                onSelect={(laureate) => setSelectedLaureate(laureate)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <List sx={{ bgcolor: 'background.paper' }}>
          {filteredAndSortedLaureates.map(laureate => (
            <LaureateListItem
              key={laureate.id}
              laureate={laureate}
              onSelect={(laureate) => setSelectedLaureate(laureate)}
            />
          ))}
        </List>
      )}

      {filteredAndSortedLaureates.length === 0 && !loading && (
        <Box sx={{ 
          textAlign: 'center', 
          color: 'text.secondary', 
          py: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
          {searchTerm || Object.values(filters).some(v => 
            Array.isArray(v) ? v.length > 0 : Boolean(v)
          ) ? (
            <>
              <Typography variant="h6" gutterBottom>
                No laureates found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search terms or filters to see more results.
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
      )}

      {loading && !isInitialLoad && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {hasMore && !loading && filteredAndSortedLaureates.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      <LaureateDialog 
        laureate={selectedLaureate}
        onClose={() => setSelectedLaureate(null)}
      />
    </Box>
  );
};

export default Laureates; 