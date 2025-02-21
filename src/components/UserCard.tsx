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
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          @{user.username}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" />
            <Typography variant="body2">{user.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="action" />
            <Typography variant="body2">{formatPhoneNumber(user.phone)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon color="action" />
            <Typography variant="body2">{user.website}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon color="action" />
            <Typography variant="body2">{user.company.name}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard; 