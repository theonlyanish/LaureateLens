import { Laureate } from '../services/api';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface LaureateListItemProps {
  laureate: Laureate;
  onSelect: (laureate: Laureate) => void;
}

const LaureateListItem = ({ laureate, onSelect }: LaureateListItemProps) => {
  // Get the most recent Nobel Prize if available
  const latestPrize = laureate.nobelPrizes?.[0];
  
  return (
    <ListItem 
      disablePadding 
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <ListItemButton 
        onClick={() => onSelect(laureate)}
        sx={{ 
          py: 2,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" component="span">
                {laureate.knownName?.en}
              </Typography>
              {latestPrize && (
                <Chip 
                  label={`${latestPrize.category?.en} (${latestPrize.awardYear})`}
                  color="primary"
                  size="small"
                />
              )}
            </Box>
          }
          secondary={
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mt: 0.5
              }}
            >
              {latestPrize?.motivation?.en}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default LaureateListItem; 