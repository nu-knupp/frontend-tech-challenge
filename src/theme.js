import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#14213D', // Dark blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FCA311', // Orange
    },
    background: {
      default: '#E5E5E5', // Light gray
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#000000', // Black
      secondary: '#14213D', // Dark blue for secondary text
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '1rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
