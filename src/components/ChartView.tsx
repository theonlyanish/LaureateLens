import { useState, useEffect, useMemo } from 'react';
import { fetchLaureates, Laureate } from '../services/api';
import Charts from './Charts';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useTheme } from '@mui/material/styles';
import PublicIcon from '@mui/icons-material/Public';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SchoolIcon from '@mui/icons-material/School';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Rectangle
} from 'recharts';

// GeoJSON URL for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country name mapping from GeoJSON names to our data names
const countryNameMapping: { [key: string]: string } = {
  "United States": "USA",
  "United States of America": "USA",
  "USA": "USA",
  "United Kingdom": "UK",
  "Great Britain": "UK",
  "UK": "UK",
  "Russian Federation": "Russia",
  "Russia": "Russia",
  "Germany": "Germany",
  "Federal Republic of Germany": "Germany",
  "France": "France",
  "Japan": "Japan",
  "Sweden": "Sweden",
  "Switzerland": "Switzerland",
  "Netherlands": "Netherlands",
  "The Netherlands": "Netherlands",
  "Canada": "Canada",
  "People's Republic of China": "China",
  "China": "China",
  "Italy": "Italy",
  "Australia": "Australia",
  "India": "India",
  "Republic of India": "India",
  "Israel": "Israel",
  "Denmark": "Denmark",
  "Norway": "Norway",
  "Belgium": "Belgium",
  "Austria": "Austria",
  "Poland": "Poland",
  "Hungary": "Hungary"
};

interface CountryCount {
  name: string;
  count: number;
}

type ChartType = 'timeline' | 'world' | 'age' | 'shared' | 'institutions';

const ChartView = () => {
  const theme = useTheme();
  const [selectedChart, setSelectedChart] = useState<ChartType>('timeline');
  const [laureates, setLaureates] = useState<Laureate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; count: number } | null>(null);

  const loadAllLaureates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLaureates(0, 1000);
      setLaureates(response.laureates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch laureates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllLaureates();
  }, []);

  // Process data for world map
  const countryData = useMemo(() => {
    const countryCount = new Map<string, { count: number; name: string }>();
    laureates.forEach(laureate => {
      const country = laureate.birth?.place?.country?.en;
      if (country) {
        const current = countryCount.get(country) || { count: 0, name: country };
        current.count++;
        countryCount.set(country, current);
      }
    });
    return Array.from(countryCount.values())
      .sort((a, b) => b.count - a.count);
  }, [laureates]);

  // Process data for age distribution
  const ageData = useMemo(() => {
    const categoryAges: { [key: string]: number[] } = {};
    laureates.forEach(laureate => {
      if (laureate.birth?.date) {
        laureate.nobelPrizes.forEach(prize => {
          const category = prize.category?.en;
          if (category && category !== 'Economic Sciences' && prize.awardYear) {
            try {
              const [birthYear] = laureate.birth.date.split('-').map(Number);
              const awardYear = parseInt(prize.awardYear);
              if (!isNaN(birthYear) && !isNaN(awardYear)) {
                const age = awardYear - birthYear;
                if (age > 0 && age < 120) {
                  if (!categoryAges[category]) categoryAges[category] = [];
                  categoryAges[category].push(age);
                }
              }
            } catch (e) {
              // Skip invalid dates
            }
          }
        });
      }
    });

    return Object.entries(categoryAges)
      .filter(([_, ages]) => ages.length > 0)
      .map(([category, ages]) => {
        ages.sort((a, b) => a - b);
        return {
          category,
          min: ages[0],
          q1: ages[Math.floor(ages.length * 0.25)],
          median: ages[Math.floor(ages.length * 0.5)],
          q3: ages[Math.floor(ages.length * 0.75)],
          max: ages[ages.length - 1],
          count: ages.length
        };
      });
  }, [laureates]);

  // Process data for shared prizes
  const sharedPrizesData = useMemo(() => {
    const categoryStats = new Map<string, { shared: number; individual: number }>();
    
    laureates.forEach(laureate => {
      laureate.nobelPrizes.forEach(prize => {
        const category = prize.category?.en;
        if (category && category !== 'Economic Sciences') {
          const stats = categoryStats.get(category) || { shared: 0, individual: 0 };
          if (prize.motivation?.en?.toLowerCase().includes('jointly')) {
            stats.shared++;
          } else {
            stats.individual++;
          }
          categoryStats.set(category, stats);
        }
      });
    });

    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({
        category,
        ...stats
      }));
  }, [laureates]);

  // Process data for institutions
  const institutionData = useMemo(() => {
    const institutionCount = new Map<string, { count: number; name: string }>();
    
    laureates.forEach(laureate => {
      // Access affiliations from nobelPrizes
      laureate.nobelPrizes.forEach(prize => {
        if (prize.affiliations) {
          prize.affiliations.forEach(affiliation => {
            if (affiliation.name?.en) {
              const name = affiliation.name.en;
              const current = institutionCount.get(name) || { count: 0, name };
              current.count++;
              institutionCount.set(name, current);
            }
          });
        }
      });
    });

    // If no institutions found, log for debugging
    if (institutionCount.size === 0) {
      console.log('No institutions found in the data');
      // Check a sample laureate to see structure
      if (laureates.length > 0) {
        console.log('Sample laureate:', laureates[0]);
      }
    }

    return Array.from(institutionCount.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [laureates]);

  const renderChart = () => {
    switch (selectedChart) {
      case 'timeline':
        return <Charts laureates={laureates} />;
      
      case 'world':
        const countryDataMap = new Map(countryData.map(item => [item.name, item]));
        const maxCount = Math.max(...countryData.map(item => item.count));
        
        // Debug country names
        console.log('Available country names in data:', Array.from(countryDataMap.keys()));
        
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Global Distribution of Nobel Laureates
            </Typography>
            <Box sx={{ height: 500, display: 'flex', position: 'relative' }}>
              <Box sx={{ flex: 2 }}>
                <ComposableMap projection="geoMercator">
                  <ZoomableGroup center={[0, 30]} zoom={1}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) => {
                        // Debug GeoJSON country names
                        console.log('GeoJSON country names:', geographies.map(geo => geo.properties.name));
                        
                        return geographies.map((geo) => {
                          const geoCountryName = geo.properties.name;
                          const dataCountryName = countryNameMapping[geoCountryName] || geoCountryName;
                          const data = countryDataMap.get(dataCountryName);
                          
                          // Debug mapping
                          if (geoCountryName.includes("United States")) {
                            console.log('Found United States:', {
                              geoName: geoCountryName,
                              mappedName: dataCountryName,
                              hasData: !!data,
                              count: data?.count,
                              properties: geo.properties
                            });
                          }
                          
                          const fillColor = data
                            ? `rgba(${parseInt(theme.palette.primary.main.slice(1, 3), 16)}, ${
                                parseInt(theme.palette.primary.main.slice(3, 5), 16)}, ${
                                parseInt(theme.palette.primary.main.slice(5, 7), 16)}, ${
                                Math.max(0.1, Math.min(0.9, data.count / maxCount))
                              })`
                            : theme.palette.grey[200];

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={fillColor}
                              stroke={theme.palette.grey[400]}
                              strokeWidth={0.5}
                              onMouseEnter={() => {
                                setTooltipContent(data ? { 
                                  name: dataCountryName, 
                                  count: data.count 
                                } : {
                                  name: geoCountryName,
                                  count: 0
                                });
                              }}
                              onMouseLeave={() => {
                                setTooltipContent(null);
                              }}
                              style={{
                                default: { outline: 'none' },
                                hover: { outline: 'none', fill: theme.palette.primary.light },
                                pressed: { outline: 'none' }
                              }}
                            />
                          );
                        });
                      }}
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
                {tooltipContent && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      p: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: 1,
                      zIndex: 1000,
                    }}
                  >
                    <Typography variant="body2">{tooltipContent.name}</Typography>
                    <Typography variant="body2" color="primary">
                      Laureates: {tooltipContent.count}
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Box sx={{ flex: 1, overflowY: 'auto', pl: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Top Countries</Typography>
                {countryData.slice(0, 10).map((country, index) => (
                  <Box key={country.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{country.name}</Typography>
                    <Typography variant="body2" color="primary">{country.count}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        );
      
      case 'age':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Age Distribution by Category
            </Typography>
            <Box sx={{ height: 500 }}>
              <ResponsiveContainer>
                <BarChart
                  data={ageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />
                  <YAxis 
                    domain={[20, 100]}
                    label={{ value: 'Age', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ payload }) => {
                      if (!payload?.[0]?.payload) return null;
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 1 }}>
                          <Typography variant="subtitle2">{data.category}</Typography>
                          <Typography variant="body2">Median Age: {data.median}</Typography>
                          <Typography variant="body2">Range: {data.min}-{data.max}</Typography>
                          <Typography variant="body2">Interquartile Range: {data.q1}-{data.q3}</Typography>
                          <Typography variant="body2">Sample Size: {data.count}</Typography>
                        </Paper>
                      );
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="median" 
                    name="Median Age" 
                    fill={theme.palette.primary.main}
                    isAnimationActive={false}
                  />
                  <Bar 
                    dataKey="min" 
                    name="Min Age" 
                    fill={theme.palette.grey[400]}
                    isAnimationActive={false}
                  />
                  <Bar 
                    dataKey="max" 
                    name="Max Age" 
                    fill={theme.palette.grey[600]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        );
      
      case 'shared':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Shared vs Individual Prizes by Category
            </Typography>
            <Box sx={{ height: 500 }}>
              <ResponsiveContainer>
                <BarChart
                  data={sharedPrizesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="individual" name="Individual" fill={theme.palette.primary.main} />
                  <Bar dataKey="shared" name="Shared" fill={theme.palette.secondary.main} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        );
      
      case 'institutions':
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
              Top 10 Institutions by Nobel Laureates
            </Typography>
            <Box sx={{ height: 500 }}>
              <ResponsiveContainer>
                <BarChart
                  data={institutionData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 200, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    width={180}
                    tickFormatter={(value) => value.length > 35 ? `${value.substring(0, 35)}...` : value}
                  />
                  <Tooltip 
                    content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 1 }}>
                          <Typography variant="subtitle2">{data.name}</Typography>
                          <Typography variant="body2">Laureates: {data.count}</Typography>
                        </Paper>
                      );
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={theme.palette.primary.main}
                    label={{ position: 'right' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={selectedChart}
          exclusive
          onChange={(_, value) => value && setSelectedChart(value)}
          aria-label="chart selection"
        >
          <ToggleButton value="timeline" aria-label="timeline view">
            <TimelineIcon sx={{ mr: 1 }} />
            Timeline
          </ToggleButton>
          <ToggleButton value="world" aria-label="world map">
            <PublicIcon sx={{ mr: 1 }} />
            World Map
          </ToggleButton>
          <ToggleButton value="age" aria-label="age distribution">
            <BarChartIcon sx={{ mr: 1 }} />
            Age Distribution
          </ToggleButton>
          <ToggleButton value="shared" aria-label="shared prizes">
            <BarChartIcon sx={{ mr: 1 }} />
            Shared Prizes
          </ToggleButton>
          <ToggleButton value="institutions" aria-label="institutions">
            <SchoolIcon sx={{ mr: 1 }} />
            Institutions
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {renderChart()}
    </Box>
  );
};

export default ChartView; 