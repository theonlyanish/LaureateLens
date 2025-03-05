import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Laureates from './components/Laureates';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#3b82f6',
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            isDarkMode={isDarkMode}
          />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Routes>
              <Route path="/" element={<Laureates />} />
              <Route path="/charts" element={<div>Charts page coming soon!</div>} />
            </Routes>
          </Container>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
