import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6600', // Orange
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#161616',
    },
    text: {
      primary: '#ffffff',
      secondary: '#FF6600',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161616',
        },
      },
    },
  },
});

export default theme;
