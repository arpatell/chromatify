import React, { useEffect, useState } from 'react';
import { getTimeRangeLabel, getCreationDateLabel } from '../utils/sharing';
import { getAuraName } from '../services/auraNaming';
import { getCachedColorName, getColorNames } from '../services/colorNamesService';
import AuraMark from './AuraMark';
import { PRODUCTION_SITE_HOST } from '../config/site';
import { calculateAuraColor, arrayToHex } from '../services/colorService';

const samplePalette = [[172, 134, 237], [237, 153, 126], [143, 196, 176]];
const sampleColors = samplePalette.map(arrayToHex);
const sampleAuraColor = arrayToHex(calculateAuraColor(samplePalette));

export const SAMPLE_AURA = {
  auraColor: sampleAuraColor, auraName: getAuraName({ auraColor: sampleAuraColor, palette: sampleColors }), timeRange: 'short_term',
  top3Colors: sampleColors,
  top3Names: ['Violet', 'Peach', 'Seafoam'], topSongs: [],
};

// Bound the darkest possible blend, including motion, then lift only as needed.
export function sleeveWash(colors) {
  const channels = colors.map((hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)));
  const darkest = [0, 1, 2].map((index) => Math.min(...channels.map((rgb) => rgb[index])));
  const luminance = (rgb) => rgb.reduce((sum, channel, index) => {
    const value = channel / 255;
    return sum + (value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][index];
  }, 0);
  const ink = luminance([18, 23, 25]);
  for (let wash = .23; wash <= .55; wash += .01) {
    if ((luminance(darkest.map((channel) => channel * (1 - wash) + 255 * wash)) + .05) / (ink + .05) >= 4.7) return wash;
  }
  return .55;
}

export function AuraSleeve({ result, compact = false, still = false }) {
  const colors = result.top3Colors.length ? result.top3Colors : [result.auraColor];
  const style = { '--aura-wash': sleeveWash([...colors, result.auraColor]), '--aura-color': result.auraColor, '--aura-first': colors[0], '--aura-second': colors[1] || colors[0], '--aura-third': colors[2] || result.auraColor };
  return (
    <div className={`aura-sleeve${compact ? ' aura-sleeve--compact' : ''}${still ? ' aura-sleeve--still' : ''}`} style={style}>
      <div className="aura-flow" aria-hidden="true" />
      <div className="sleeve-content">
        <h2 className={`aura-name${result.auraName.split(' ').some((word) => word.length > 8) ? ' aura-name--long' : ''}`}>{result.auraName.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word} </span>)}</h2>
        <div className="sleeve-meta"><span>{result.auraColor.toUpperCase()}</span><span>{getTimeRangeLabel(result.timeRange)}</span></div>
      </div>
    </div>
  );
}

export function ColorPalette({ result, onCopy }) {
  const key = result.top3Colors.join(',');
  const [resolved, setResolved] = useState({ key: '', names: [] });
  useEffect(() => {
    let active = true;
    getColorNames(key.split(',').filter(Boolean)).then((names) => {
      if (active) setResolved({ key, names });
    });
    return () => { active = false; };
  }, [key]);
  return (
    <div className="color-palette" aria-label="Top three colors">
      {result.top3Colors.map((color, index) => {
        const colorName = (resolved.key === key ? resolved.names[index] : getCachedColorName(color)) || 'Finding name...';
        const content = <><span className="color-swatch" style={{ background: color }} /><span className="color-details"><span className="color-name">{colorName}</span><span className="color-hex">{color.toUpperCase()}</span></span></>;
        return onCopy
          ? <button type="button" className="palette-color" key={`${color}-${index}`} onClick={() => onCopy(color)} aria-label={`Copy ${colorName} ${color}`} title="Copy color">{content}</button>
          : <div className="palette-color" key={`${color}-${index}`}>{content}</div>;
      })}
    </div>
  );
}

export function SpotifyAttribution() {
  return <span className="spotify-attribution"><span>Made with</span><img src="/spotify-logo.png" alt="Spotify" width="72" height="22" /></span>;
}

export function AuraExportCard({ result, cardRef }) {
  const creationDate = getCreationDateLabel(result.createdAt);
  return (
    <div className="export-card" ref={cardRef}>
      <div className="export-brand"><div className="export-brand-title">Chromatify<AuraMark /></div><span>{result.ownerName ? `${result.ownerName}’s music, in color.` : 'Music, in color.'}</span>{creationDate && <time dateTime={result.createdAt}>Created {creationDate}</time>}</div>
      <AuraSleeve result={result} compact still />
      <ColorPalette result={result} />
      <div className="export-tracks">
        {result.topSongs.slice(0, 3).map((song, index) => <div className="export-track" key={song.id}><span>{index + 1}</span><div><strong>{song.name}</strong><span>{song.artists?.[0]?.name || 'Unknown artist'}</span></div></div>)}
      </div>
      <div className="export-footer"><span>{PRODUCTION_SITE_HOST}</span><SpotifyAttribution /></div>
    </div>
  );
}
