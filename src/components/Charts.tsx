import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Laureate } from '../services/api';

interface ChartsProps {
  laureates: Laureate[];
}

interface CategoryCount {
  period: string;
  Physics: number;
  Chemistry: number;
  'Physiology or Medicine': number;
  Literature: number;
  Peace: number;
}

type ViewMode = 'decades' | 'years';

const Charts = ({ laureates }: ChartsProps) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('decades');

  // Process data to get counts by decade/year and category
  const data = useMemo(() => {
    const periodCounts = new Map<string, { [key: string]: number }>();

    if (viewMode === 'decades') {
      // Initialize decades from 1900 to 2020
      for (let decade = 1900; decade <= 2020; decade += 10) {
        periodCounts.set(decade.toString(), {
          Physics: 0,
          Chemistry: 0,
          'Physiology or Medicine': 0,
          Literature: 0,
          Peace: 0,
        });
      }
    } else {
      // Initialize years from 1901 to current year
      const currentYear = new Date().getFullYear();
      for (let year = 1901; year <= currentYear; year++) {
        periodCounts.set(year.toString(), {
          Physics: 0,
          Chemistry: 0,
          'Physiology or Medicine': 0,
          Literature: 0,
          Peace: 0,
        });
      }
    }

    // Count laureates by period and category
    laureates.forEach(laureate => {
      laureate.nobelPrizes.forEach(prize => {
        const year = parseInt(prize.awardYear);
        const period = viewMode === 'decades' 
          ? (Math.floor(year / 10) * 10).toString()
          : year.toString();
        const category = prize.category?.en;

        if (category && category !== 'Economic Sciences' && periodCounts.has(period)) {
          const counts = periodCounts.get(period)!;
          // Combine Medicine and Physiology
          if (category === 'Medicine') {
            counts['Physiology or Medicine'] = (counts['Physiology or Medicine'] || 0) + 1;
          } else if (category !== 'Physiology') { // Skip standalone Physiology entries
            counts[category] = (counts[category] || 0) + 1;
          }
        }
      });
    });

    // Convert to array format for Recharts
    return Array.from(periodCounts.entries())
      .map(([period, counts]) => ({
        period: viewMode === 'decades' ? `${period}s` : period,
        ...counts
      }))
      .sort((a, b) => parseInt(a.period) - parseInt(b.period));
  }, [laureates, viewMode]);

  // Define colors for each category
  const categoryColors = {
    Physics: theme.palette.primary.main,
    Chemistry: theme.palette.secondary.main,
    'Physiology or Medicine': '#2E7D32', // green
    Literature: '#7B1FA2', // purple
    Peace: '#1976D2', // blue
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Nobel Prize Categories Distribution Over Time
        </Typography>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => newValue && setViewMode(newValue)}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="decades" aria-label="show by decades">
            By Decades
          </ToggleButton>
          <ToggleButton value="years" aria-label="show by years">
            By Years
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Paper 
        sx={{ 
          p: 3, 
          height: 500, 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white'
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="period" 
              label={{ 
                value: viewMode === 'decades' ? 'Decade' : 'Year', 
                position: 'insideBottom', 
                offset: -5 
              }}
              interval={viewMode === 'decades' ? 0 : Math.floor(data.length / 10)}
              angle={viewMode === 'years' ? 45 : 0}
              textAnchor={viewMode === 'years' ? 'start' : 'middle'}
              height={viewMode === 'years' ? 60 : 30}
            />
            <YAxis 
              label={{ 
                value: 'Number of Laureates', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {Object.entries(categoryColors).map(([category, color]) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                name={category}
                stroke={color}
                strokeWidth={2}
                dot={viewMode === 'decades' ? { r: 4 } : false}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Charts; 