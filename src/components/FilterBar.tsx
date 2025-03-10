import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export interface Filters {
  categories: string[];
  yearRange: [number, number];
  country: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  countries: string[];
  yearRange: [number, number];
}

const FilterBar = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  categories,
  countries,
  yearRange
}: FilterBarProps) => {
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSortChange = (field: string) => {
    if (filters.sortBy === field) {
      handleFilterChange('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onFiltersChange({
        ...filters,
        sortBy: field,
        sortDirection: 'asc'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Primary Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search laureates by name or thesis..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ flex: 1, minWidth: 250 }}
          />
          <ButtonGroup variant="outlined">
            <Button
              onClick={() => handleSortChange('name')}
              variant={filters.sortBy === 'name' ? 'contained' : 'outlined'}
              endIcon={filters.sortBy === 'name' && (
                filters.sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
              )}
            >
              Name
            </Button>
            <Button
              onClick={() => handleSortChange('year')}
              variant={filters.sortBy === 'year' ? 'contained' : 'outlined'}
              endIcon={filters.sortBy === 'year' && (
                filters.sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
              )}
            >
              Year
            </Button>
          </ButtonGroup>
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && onViewModeChange(value)}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Additional Filters Toggle */}
      <Button
        onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
        endIcon={showAdditionalFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'text.primary',
          },
          justifyContent: 'flex-start',
          pl: 0,
        }}
      >
        {showAdditionalFilters ? 'Hide additional filters' : 'Show additional filters'}
      </Button>

      {/* Additional Filters */}
      <Collapse in={showAdditionalFilters}>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          flexWrap: 'wrap', 
          alignItems: 'flex-start',
          pt: 1,
          pb: 2 
        }}>
          {/* Categories */}
          <Autocomplete
            multiple
            options={categories}
            value={filters.categories}
            onChange={(_, value) => handleFilterChange('categories', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Categories"
                placeholder="Select categories"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            sx={{ minWidth: 250 }}
          />

          {/* Country */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              label="Country"
            >
              <MenuItem value="">All Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year Range */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flex: 1,
            minWidth: 300,
            maxWidth: 500
          }}>
            <Typography sx={{ minWidth: 100 }}>
              Year Range:
              <br />
              {filters.yearRange[0]} - {filters.yearRange[1]}
            </Typography>
            <Slider
              value={filters.yearRange}
              onChange={(_, value) => handleFilterChange('yearRange', value)}
              valueLabelDisplay="auto"
              min={yearRange[0]}
              max={yearRange[1]}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FilterBar; 