"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#687EDB', // Purple
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9563', // Orange
    },
    background: {
      default: '#E0E8F8', // Light blue
      paper: '#f3f6fc', // White
    },
    text: {
      primary: '#0c145e', // Black
      secondary: '#65748f', // Light purple for secondary text
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

interface ThemeRegistryProps {
  children: React.ReactNode;
  customTheme?: Theme;
}

export default function ThemeRegistry({ children, customTheme }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={customTheme || defaultTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
