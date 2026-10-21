import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: mode === 'dark' ? '#edac8d' : '#8a4429' },
    background: { default: mode === 'dark' ? '#121719' : '#f0f0e9', paper: mode === 'dark' ? '#1c2427' : '#fafaf5' },
    text: { primary: mode === 'dark' ? '#edf0e8' : '#172125', secondary: mode === 'dark' ? '#aebbbd' : '#546467' },
  },
  typography: { fontFamily: 'Manrope, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { minHeight: '100dvh' } } },
    MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none', borderRadius: 16 } } },
    MuiMenu: { styleOverrides: { paper: { backgroundImage: 'none' } } },
  },
});