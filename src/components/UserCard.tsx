import { User } from '../services/api';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';

// component props
interface UserCardProps {
  user: User;
}

// User card component for displaying user information
const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card sx={{ 
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
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
          @{user.username}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {formatPhoneNumber(user.phone)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {user.website}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {user.company.name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard; 