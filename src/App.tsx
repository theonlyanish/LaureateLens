import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import Users from './components/Users';

// Main App component
function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
      h4: {
        fontWeight: 500,
        fontSize: '2.5rem',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <AppBar position="static" sx={{ width: '100%' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }} />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                color: theme.palette.primary.main,
                textAlign: 'center',
                flex: 2
              }}
            >
              User Management System
            </Typography>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <IconButton 
                color="primary"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="toggle dark mode"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          <Users />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
