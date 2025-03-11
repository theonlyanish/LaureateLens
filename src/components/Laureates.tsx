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
import { animated, useTrail } from '@react-spring/web';

const ITEMS_PER_PAGE = 24; // Adjust for better grid layout (4x6)

interface LaureatesProps {
  overlayDismissed: boolean;
}

const AnimatedGrid = animated(Grid);

const Laureates = ({ overlayDismissed }: LaureatesProps) => {
  const [allLaureates, setAllLaureates] = useState<Laureate[]>([]);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLaureate, setSelectedLaureate] = useState<Laureate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    yearRange: [1901, new Date().getFullYear()],
    country: '',
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load all laureates at once
  const loadAllLaureates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch with a large limit to get all laureates
      const response = await fetchLaureates(0, 1000);
      setAllLaureates(response.laureates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch laureates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllLaureates();
  }, []); // Only load once at component mount

  // Extract unique categories and countries from all laureates
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allLaureates.forEach(laureate => {
      laureate.nobelPrizes.forEach(prize => {
        if (prize.category?.en) {
          uniqueCategories.add(prize.category.en);
        }
      });
    });
    return Array.from(uniqueCategories).sort();
  }, [allLaureates]);

  const countries = useMemo(() => {
    const uniqueCountries = new Set<string>();
    allLaureates.forEach(laureate => {
      if (laureate.birth?.place?.country?.en) {
        uniqueCountries.add(laureate.birth.place.country.en);
      }
    });
    return Array.from(uniqueCountries).sort();
  }, [allLaureates]);

  // Get the year range from all laureates
  const yearRange = useMemo(() => {
    let minYear = 1901;
    let maxYear = new Date().getFullYear();
    
    if (allLaureates.length > 0) {
      allLaureates.forEach(laureate => {
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
  }, [allLaureates]);

  // Filter and sort all laureates
  const filteredAndSortedLaureates = useMemo(() => {
    return allLaureates
      .filter(laureate => {
        // Filter out unknown names
        if (!laureate.knownName?.en || laureate.knownName.en === 'Unknown Name') {
          return false;
        }

        // Name and thesis search
        const searchTermLower = debouncedSearchTerm.toLowerCase();
        const nameMatch = laureate.knownName.en
          .toLowerCase()
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
  }, [allLaureates, debouncedSearchTerm, filters]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [debouncedSearchTerm, filters]);

  // Handle load more
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Get the current page of laureates
  const displayedLaureates = filteredAndSortedLaureates.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSortedLaureates.length;

  const trail = useTrail(displayedLaureates.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: overlayDismissed ? 1 : 0, transform: overlayDismissed ? 'translateY(0px)' : 'translateY(20px)' },
    config: { mass: 1, tension: 280, friction: 20 },
  });

  if (loading) {
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
            <Button color="inherit" size="small" onClick={loadAllLaureates}>
              Retry
            </Button>
          }
        >
          Error: {error}
        </Alert>
      )}

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {trail.map((styles, index) => (
            <AnimatedGrid item xs={12} sm={6} md={4} key={displayedLaureates[index].id} style={styles}>
              <LaureateCard 
                laureate={displayedLaureates[index]}
                onSelect={(laureate) => setSelectedLaureate(laureate)}
              />
            </AnimatedGrid>
          ))}
        </Grid>
      ) : (
        <List sx={{ bgcolor: 'background.paper' }}>
          {displayedLaureates.map(laureate => (
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

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
            sx={{ minWidth: 200 }}
          >
            Load More ({filteredAndSortedLaureates.length - displayCount} remaining)
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