import { Laureate } from '../services/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import PublicIcon from '@mui/icons-material/Public';

interface LaureateCardProps {
  laureate: Laureate;
  onSelect: (laureate: Laureate) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  // Handle special case where month/day are '00'
  const [year, month, day] = dateString.split('-');
  
  // If month is '00', return just the year
  if (month === '00') {
    return year;
  }
  
  // If day is '00', return just year and month
  if (day === '00') {
    try {
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return `${year}-${month}`;
    }
  }
  
  // Regular case - full date
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const capitalizeFirstLetter = (text?: string) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const LaureateCard = ({ laureate, onSelect }: LaureateCardProps) => {
  // Get the most recent Nobel Prize if available
  const latestPrize = laureate.nobelPrizes?.[0];
  // Get the primary affiliation if available
  const primaryAffiliation = laureate.affiliations?.[0];

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 1,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardActionArea onClick={() => onSelect(laureate)} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3, minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              {laureate.knownName?.en || 'Unknown Name'}
            </Typography>
            
            {latestPrize && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${latestPrize.category?.en || 'Unknown Category'} (${latestPrize.awardYear || 'Unknown Year'})`}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {laureate.birth && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CakeIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(laureate.birth.date)}
                  {laureate.death && ` - ${formatDate(laureate.death.date)}`}
                </Typography>
              </Box>
            )}

            {laureate.birth?.place && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {laureate.birth.place.city?.en && `${laureate.birth.place.city.en}, `}
                  {laureate.birth.place.country?.en || 'Unknown Country'}
                </Typography>
              </Box>
            )}

            {primaryAffiliation && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {primaryAffiliation.name?.en || 'Unknown Institution'}
                  {primaryAffiliation.country?.en && ` (${primaryAffiliation.country.en})`}
                </Typography>
              </Box>
            )}

            {latestPrize && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <SchoolIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {capitalizeFirstLetter(latestPrize.motivation?.en) || 'No motivation provided'}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LaureateCard; 