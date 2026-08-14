import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext(null);

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6C63FF',
        light: '#9D97FF',
        dark: '#4B44CC',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#FF6584',
        light: '#FF93A9',
        dark: '#CC3D5A',
        contrastText: '#ffffff',
      },
      success: { main: '#43E97B' },
      background: {
        default: mode === 'dark' ? '#0F0F1A' : '#F5F5FF',
        paper: mode === 'dark' ? '#1A1A2E' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#E8E8FF' : '#1A1A2E',
        secondary: mode === 'dark' ? '#9999CC' : '#6B6B99',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 20px rgba(108,99,255,0.3)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'dark'
                ? '0 4px 24px rgba(0,0,0,0.4)'
                : '0 4px 24px rgba(108,99,255,0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.6)'
                  : '0 8px 32px rgba(108,99,255,0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('serviceit_theme') || 'light';
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('serviceit_theme', newMode);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeContext;
