import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Laureates from './components/Laureates';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Nobel Prize Laureates
          </Typography>
          <Laureates />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
