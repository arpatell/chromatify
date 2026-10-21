import React, { useState } from 'react';
import { getSpotifyAuthUrl } from '../config/spotify';
import { AuraSleeve, ColorPalette, SAMPLE_AURA } from './AuraSleeve';
import Icon from './Icon';

export default function Login() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    setIsConnecting(true); setError('');
    try { window.location.assign(await getSpotifyAuthUrl()); }
    catch { setError('Spotify couldn’t open. Please try again.'); setIsConnecting(false); }
  };
  return (
    <main id="main-content" className="login-layout">
      <div className="login-copy"><h1>Your music.<br />In full color.</h1><p className="login-description">Musical aura based on your Spotify listening history. Turn the tracks you love into a color palette that’s unmistakably you.</p><button type="button" className="button button-primary connect-button" onClick={handleLogin} disabled={isConnecting}>{isConnecting ? 'Connecting…' : 'Connect Spotify'}<Icon name="arrow" size={20} /></button><p className="login-note">Choose a time frame. Find your colors. Share your aura.</p>{error && <p className="inline-error" role="alert">{error}</p>}<div className="login-how"><span className="small-spectrum" aria-hidden="true" /><span>Made from the colors in your album artwork.</span></div></div>
      <div className="login-preview"><div className="preview-caption"><span>A little preview of the possibilities.</span><Icon name="arrow" size={18} /></div><AuraSleeve result={SAMPLE_AURA} /><ColorPalette result={SAMPLE_AURA} /></div>
    </main>
  );
}
