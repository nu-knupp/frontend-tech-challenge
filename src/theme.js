import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004d66', // Azul escuro do cabeçalho e cards
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8BC34A', // Verde claro (menu selecionado)
    },
    background: {
      default: '#f1f7f5', // Fundo geral
      paper: '#ffffff', // Cards em branco ou painel lateral branco
    },
    text: {
      primary: '#1d1d1d',
      secondary: '#4f4f4f',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
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
        },
      },
    },
  },
});

export default theme;
