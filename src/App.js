import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Snackbar } from '@mui/material';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { createAppTheme } from './theme';
import { useColorMode } from './hooks/useColorMode';
import { readSharedAura } from './utils/sharing';
import AppHeader from './components/AppHeader';
import SupportDialog from './components/SupportDialog';
import { SpotifyAttribution } from './components/AuraSleeve';
import Icon from './components/Icon';

const App = () => {
  const accessToken = useSpotifyAuth();
  const [mode, toggleTheme] = useColorMode();
  const [supportOpen, setSupportOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const sharedAura = useMemo(() => readSharedAura(window.location.search), []);
  const notify = (message) => setNotice({ message, key: Date.now() });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <AppHeader mode={mode} onToggleTheme={toggleTheme} onSupport={() => setSupportOpen(true)} connected={Boolean(accessToken)} />
        {accessToken || sharedAura ? <Dashboard accessToken={accessToken} sharedAura={sharedAura} notify={notify} /> : <Login />}
        <footer className="app-footer"><SpotifyAttribution /><a className="icon-button" href="https://github.com/arpatell/Chromatify" target="_blank" rel="noopener noreferrer" aria-label="Chromatify on GitHub" title="View on GitHub"><Icon name="github" size={18} /></a></footer>
      </div>
      <SupportDialog open={supportOpen} onClose={() => setSupportOpen(false)} notify={notify} />
      <Snackbar key={notice?.key} open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice(null)} message={notice?.message} action={<button type="button" className="icon-button" onClick={() => setNotice(null)} aria-label="Dismiss message"><Icon name="close" size={18} /></button>} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ bottom: { xs: 'calc(88px + env(safe-area-inset-bottom))', sm: 24 } }} />
    </ThemeProvider>
  );
};

export default App;
