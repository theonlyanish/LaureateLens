import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics, AnalyticsProps } from '@vercel/analytics/react';
import type { Event } from '@vercel/analytics';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from './components/Header';
import Laureates from './components/Laureates';
import ChartView from './components/ChartView';
import LoadingOverlay from './components/LoadingOverlay';

// Nobel Prize colors
const nobelColors = {
  gold: '#C19B6C',
  blue: '#003087',
  lightGold: '#D4B88C',
  lightBlue: '#4B9FE1',
  darkModeBlue: '#63B8FF',
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOverlayDismissed, setIsOverlayDismissed] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: isDarkMode ? nobelColors.lightBlue : nobelColors.blue,
            light: isDarkMode ? nobelColors.darkModeBlue : nobelColors.lightBlue,
          },
          secondary: {
            main: nobelColors.gold,
            light: nobelColors.lightGold,
          },
          background: {
            default: isDarkMode ? '#121212' : '#f5f5f5',
            paper: isDarkMode ? '#1E1E1E' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Crimson Text", "Times New Roman", serif',
          h5: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 600,
            letterSpacing: 0.5,
          },
          h1: {
            fontFamily: '"Playfair Display", serif',
          },
          h2: {
            fontFamily: '"Playfair Display", serif',
          },
          h3: {
            fontFamily: '"Playfair Display", serif',
          },
          h4: {
            fontFamily: '"Playfair Display", serif',
          },
          h6: {
            fontFamily: '"Playfair Display", serif',
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 28,
                textTransform: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingOverlay onDismiss={() => setIsOverlayDismissed(true)} />
      <Router>
        <Box 
          sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            background: isDarkMode 
              ? `linear-gradient(45deg, ${nobelColors.darkModeBlue}15, ${nobelColors.gold}15)`
              : `linear-gradient(45deg, ${nobelColors.blue}08, ${nobelColors.gold}08)`,
          }}
        >
          <Header 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            isDarkMode={isDarkMode}
          />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Routes>
              <Route path="/" element={<Laureates overlayDismissed={isOverlayDismissed} />} />
              <Route path="/charts" element={<ChartView />} />
            </Routes>
          </Container>
          
          {/* Attribution Footer */}
          <Box 
            component="footer" 
            sx={{ 
              textAlign: 'center', 
              py: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              mt: 'auto',
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
            }}
          >
                          <p style={{ margin: 0, fontSize: '0.875rem', color: isDarkMode ? '#a0a0a0' : '#666' }}>
                LaureateLens by{' '}
                <a
                  href="https://anishkapse.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: isDarkMode ? '#a0a0a0' : '#666',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDarkMode ? '#63B8FF' : '#da4167';
                    e.currentTarget.style.textDecoration = 'underline';
                    e.currentTarget.style.textDecorationThickness = '2px';
                    e.currentTarget.style.textUnderlineOffset = '2px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDarkMode ? '#a0a0a0' : '#666';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Anish Kapse
                </a>
              </p>
          </Box>
        </Box>
      </Router>
      {/* Vercel Analytics - tracks page views and other metrics */}
      <Analytics 
        beforeSend={(event: Event) => {
          // Optional: Modify or filter events before they're sent
          // For example, you could add custom properties:
          return {
            ...event,
            // Add any custom properties you want to track
            theme: isDarkMode ? 'dark' : 'light'
          } as Event;
        }}
      />
    </ThemeProvider>
  );
}

export default App;
