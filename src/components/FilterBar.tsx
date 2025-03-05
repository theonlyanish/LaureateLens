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
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
      {/* Search and View Toggle */}
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

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
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
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel shrink>Year Range</InputLabel>
          <Box sx={{ mt: 3, px: 1 }}>
            <Slider
              value={filters.yearRange}
              onChange={(_, value) => handleFilterChange('yearRange', value)}
              valueLabelDisplay="auto"
              min={yearRange[0]}
              max={yearRange[1]}
              marks={[
                { value: yearRange[0], label: yearRange[0].toString() },
                { value: yearRange[1], label: yearRange[1].toString() }
              ]}
            />
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FilterBar; 