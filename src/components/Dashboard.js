import React, { useEffect, useState } from 'react';
import { generateAura } from '../services/auraService';
import { TIME_RANGES, copyText, getTimeRangeLabel, getCreationDateLabel } from '../utils/sharing';
import { AuraSleeve, ColorPalette } from './AuraSleeve';
import SharePanel from './SharePanel';
import Icon from './Icon';
import { loadSharedTrackArtwork } from '../services/sharedTrackService';

export default function Dashboard({ accessToken, sharedAura, notify }) {
  const [timeRange, setTimeRange] = useState('short_term');
  const [result, setResult] = useState(sharedAura || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [highlightCreate, setHighlightCreate] = useState(false);
  const sharedTitle = result?.ownerName ? `${result.ownerName}’s Chromatify` : 'A little music. A lot of color.';
  const creationDate = getCreationDateLabel(result?.createdAt);
  useEffect(() => {
    if (!sharedAura || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => setHighlightCreate(true), 4000);
    return () => clearTimeout(timer);
  }, [sharedAura]);
  useEffect(() => {
    if (!sharedAura) return;
    let active = true;
    loadSharedTrackArtwork(sharedAura.topSongs).then((songs) => {
      if (active) setResult({ ...sharedAura, topSongs: songs });
    });
    return () => { active = false; };
  }, [sharedAura]);
  const generate = async (range = timeRange) => {
    setIsLoading(true); setError(''); setIsEmpty(false);
    try { const next = await generateAura(accessToken, range); setResult(next); setIsEmpty(!next); }
    catch { setError('Your aura couldn’t be generated. Check your connection and try again.'); }
    finally { setIsLoading(false); }
  };
  const changeRange = (range) => { setTimeRange(range); if (result || isEmpty) generate(range); };
  const copyColor = async (color) => {
    try { await copyText(color.toUpperCase()); notify(`${color.toUpperCase()} copied.`); }
    catch { notify(`Your color is ${color.toUpperCase()}. Copy it from the swatch label.`); }
  };
  const scrollToShare = () => {
    document.getElementById('share')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    document.querySelector('#share .button')?.focus({ preventScroll: true });
  };
  return (
    <main id="main-content" className={`dashboard${result ? ' dashboard--generated' : ''}`}>
      <div className="page-intro"><div><h1>{sharedAura ? sharedTitle : 'Your music, in color.'}</h1><p>{sharedAura ? 'A music aura made from their top tracks and album artwork.' : 'A color story made from the music you keep coming back to.'}{sharedAura && creationDate && <><br /><time dateTime={result.createdAt}>Created {creationDate}</time></>}</p></div>{sharedAura && <a className={`button button-primary create-aura-link${highlightCreate ? ' create-aura-link--highlight' : ''}`} href="/" onAnimationEnd={() => setHighlightCreate(false)}>Make your aura<Icon name="arrow" size={18} /></a>}</div>
      {!sharedAura && <div className="generation-controls"><div className="range-control" role="group" aria-label="Listening time range">{TIME_RANGES.map((range, index) => <button type="button" key={range.value} aria-pressed={timeRange === range.value} disabled={isLoading} onClick={() => changeRange(range.value)}>{index === 1 ? '6 months' : range.label}</button>)}</div><button type="button" className={`button ${result ? 'button-secondary' : 'button-primary'} generate-button`} disabled={isLoading} onClick={() => generate()}><Icon name={isLoading || result ? 'refresh' : 'arrow'} size={18} className={isLoading ? 'loading-icon' : undefined} />{isLoading ? 'Finding your colors…' : result ? 'Refresh aura' : 'Generate my aura'}</button></div>}
      {error && <div className="status-message status-message--error" role="alert"><p>{error}{result ? ' Your previous aura is still here.' : ''}</p><button type="button" className="text-button" disabled={isLoading} onClick={() => generate()}>Try again<Icon name="refresh" size={16} /></button></div>}
      {isEmpty && !isLoading && <section className="empty-state" aria-labelledby="empty-title"><Icon name="music" size={36} /><h2 id="empty-title">A few more songs, a little more color.</h2><p>No top tracks were found for {getTimeRangeLabel(timeRange).toLowerCase()}. Try another time frame or come back after some listening.</p></section>}
      {!result && !isEmpty && <section className="ready-state" aria-busy={isLoading}><h2>{isLoading ? 'A good mix takes a moment.' : 'Ready when you are.'}</h2><p>{isLoading ? 'Reading your top tracks and bringing their album-art colors together.' : 'Choose a time frame and generate your aura to see the colors in your music.'}</p></section>}
      {result && <>
        <div className={`result-layout${isLoading ? ' result-layout--loading' : ''}`} aria-busy={isLoading}>
          <section className="aura-section" aria-label={sharedAura ? 'Shared music aura' : 'Your music aura'}><AuraSleeve result={result} /><div className="palette-heading"><h2>{sharedAura ? 'Top three colors' : 'Your top three colors'}</h2><span>Tap a color to copy</span></div><ColorPalette result={result} onCopy={copyColor} /><button type="button" className="mobile-share button button-primary" onClick={scrollToShare}><Icon name="share" size={18} />{sharedAura ? 'Share this aura' : 'Share your aura'}</button></section>
          <section className="tracks-section" aria-labelledby="tracks-title"><div className="section-heading"><h2 id="tracks-title">Top tracks</h2><span>{getTimeRangeLabel(result.timeRange)}</span></div><ol className="track-list">{result.topSongs.slice(0, 7).map((song, index) => {
            const albumArt = song.album?.images?.[2]?.url || song.album?.images?.[1]?.url || song.album?.images?.[0]?.url;
            const content = <><span className="track-rank">{index + 1}</span>{albumArt ? <img className="album-art" src={albumArt} alt="" width="48" height="48" loading="lazy" /> : <span className="album-placeholder" style={{ background: result.songColors?.[song.id] || result.top3Colors[index % result.top3Colors.length] }}><Icon name="music" size={20} /></span>}<span className="track-info"><span className="track-name">{song.name}</span><span className="track-artist">{song.artists?.[0]?.name || 'Unknown artist'}</span></span>{song.external_urls?.spotify && <img className="track-spotify-logo" src="/spotify-logo.png" alt="Spotify" width="22" height="22" />}</>;
            return <li key={song.id}>{song.external_urls?.spotify ? <a className="track-row" href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer" aria-label={`${song.name} by ${song.artists?.[0]?.name || 'Unknown artist'} on Spotify`}>{content}</a> : <div className="track-row">{content}</div>}</li>;
          })}</ol><p className="tracks-note">The music behind the mix.</p></section>
        </div>
        <SharePanel result={result} notify={notify} />
      </>}
      <div className="sr-only" role="status" aria-live="polite">{isLoading ? 'Generating your music aura.' : result ? `${result.auraName} aura ready for ${getTimeRangeLabel(result.timeRange)}.` : ''}</div>
    </main>
  );
}
