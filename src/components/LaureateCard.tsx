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
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {laureate.knownName?.en || 'Unknown Name'}
          </Typography>
          
          {latestPrize && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Chip 
                label={`${latestPrize.category?.en || 'Unknown Category'} (${latestPrize.awardYear || 'Unknown Year'})`}
                color="primary"
                size="small"
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
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
          </Box>

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
                {latestPrize.motivation?.en || 'No motivation provided'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LaureateCard; 