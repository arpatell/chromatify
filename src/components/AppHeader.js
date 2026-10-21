import React from 'react';
import Icon from './Icon';
import AuraMark from './AuraMark';

export default function AppHeader({ mode, onToggleTheme, onSupport, connected }) {
  const disconnect = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('token_expiry');
    window.location.assign('/');
  };
  return (
    <header className="app-header">
      <a className="wordmark" href="/" aria-label="Chromatify home">Chromatify<AuraMark /></a>
      <nav className="header-actions" aria-label="App controls">
        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}><Icon name={mode === 'dark' ? 'sun' : 'moon'} /></button>
        <button type="button" className="icon-button coffee-button" onClick={onSupport} aria-label="Support development" title="Buy me a coffee"><Icon name="coffee" /></button>
        {connected && <button type="button" className="disconnect-button" onClick={disconnect}>Disconnect</button>}
      </nav>
    </header>
  );
}
