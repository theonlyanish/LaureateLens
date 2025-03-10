import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BarChartIcon from '@mui/icons-material/BarChart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header = ({ toggleDarkMode, isDarkMode }: HeaderProps) => {
  const theme = useTheme();
  const location = useLocation();
  const isChartsPage = location.pathname === '/charts';

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        background: theme.palette.mode === 'dark'
          ? 'rgba(30, 30, 30, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="/Nobel_Prize.png"
            alt="Nobel Prize"
            sx={{ 
              height: 40,
              width: 40,
              animation: 'pulse 2s infinite',
              filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.1)',
                  opacity: 0.8,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }} 
          />
          <Typography 
            variant="h5" 
            component={Link}
            to="/"
            sx={{ 
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              textDecoration: 'none',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #4B9FE1 30%, #63B8FF 90%)'
                : 'linear-gradient(45deg, #1A4FA3 30%, #4B9FE1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              letterSpacing: '0.5px',
              fontSize: '1.8rem',
            }}
          >
            LaureateLens
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            component={Link}
            to={isChartsPage ? '/' : '/charts'}
            startIcon={isChartsPage ? <FormatListBulletedIcon /> : <BarChartIcon />}
            color="inherit"
            sx={{
              borderRadius: '50vh',
              minWidth: 'auto',
              padding: '8px 16px',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {isChartsPage ? 'List View' : 'Charts'}
          </Button>
          <IconButton 
            onClick={toggleDarkMode} 
            color="inherit"
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(180deg)',
              },
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 