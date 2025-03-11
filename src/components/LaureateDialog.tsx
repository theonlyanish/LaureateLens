import { Laureate } from '../services/api';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface LaureateDialogProps {
  laureate: Laureate | null;
  onClose: () => void;
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

const LaureateDialog = ({ laureate, onClose }: LaureateDialogProps) => {
  if (!laureate) return null;

  return (
    <Dialog 
      open={!!laureate} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle 
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          position: 'relative',
          pb: 0 // Reduce bottom padding since we're moving content out
        }}
      >
        <IconButton 
          onClick={onClose} 
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {laureate.knownName?.en}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {laureate.nobelPrizes.map((prize, index) => (
              <Chip 
                key={index}
                label={`${prize.category?.en} (${prize.awardYear})`}
                color="primary"
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Biographical Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Biographical Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Birth Information */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CakeIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Birth
                  </Typography>
                  <Typography>
                    {formatDate(laureate.birth?.date)}
                    {laureate.birth?.place && (
                      <>
                        <br />
                        {laureate.birth.place.city?.en && `${laureate.birth.place.city.en}, `}
                        {laureate.birth.place.country?.en}
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Death Information */}
              {laureate.death && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HourglassEmptyIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Death
                    </Typography>
                    <Typography>
                      {formatDate(laureate.death.date)}
                      {laureate.death.place && (
                        <>
                          <br />
                          {laureate.death.place.city?.en && `${laureate.death.place.city.en}, `}
                          {laureate.death.place.country?.en}
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* External Links */}
              {(laureate.wikipedia?.english || laureate.wikidata?.url) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    External Links
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {laureate.wikipedia?.english && (
                      <Link 
                        href={laureate.wikipedia.english}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <LinkIcon fontSize="small" />
                        Wikipedia
                      </Link>
                    )}
                    {laureate.wikidata?.url && (
                      <Link 
                        href={laureate.wikidata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <LinkIcon fontSize="small" />
                        Wikidata
                      </Link>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Nobel Prizes */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Nobel Prizes
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {laureate.nobelPrizes.map((prize, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmojiEventsIcon color="primary" />
                    <Typography variant="subtitle1">
                      {prize.category?.en} ({prize.awardYear})
                    </Typography>
                  </Box>

                  {prize.motivation?.en && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      paragraph
                    >
                      {capitalizeFirstLetter(prize.motivation.en)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Affiliations Section */}
            {laureate.affiliations && laureate.affiliations.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.primary' }}>
                  Affiliations
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {laureate.affiliations.map((affiliation, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2">
                          {affiliation.name?.en}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {[
                            affiliation.city?.en,
                            affiliation.country?.en
                          ].filter(Boolean).join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LaureateDialog; 