import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { AuraExportCard } from './AuraSleeve';
import { buildShareUrl, copyText, getTimeRangeLabel } from '../utils/sharing';
import Icon from './Icon';
import { getColorNames } from '../services/colorNamesService';

export default function SharePanel({ result, notify }) {
  const cardRef = useRef(null);
  const [prepared, setPrepared] = useState(null);
  const [imageError, setImageError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const hasNativeShare = typeof navigator.share === 'function';
  const shareUrl = buildShareUrl(result);

  useEffect(() => {
    let cancelled = false;
    setImageError('');
    setPrepared(null);
    const prepare = async () => {
      try {
        await Promise.all([document.fonts?.ready, getColorNames(result.top3Colors)]);
        // Let the palette's async names commit before capturing the card.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (cancelled) return;
        const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: '#121719', useCORS: true, logging: false });
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Image export failed');
        if (!cancelled) setPrepared({ result, file: new File([blob], `chromatify-${result.timeRange}.png`, { type: 'image/png' }) });
      } catch {
        if (!cancelled) setImageError('The image could not be prepared. Try again, or copy your aura link.');
      }
    };
    prepare();
    return () => { cancelled = true; };
  }, [result, attempt]);

  const file = prepared?.result === result ? prepared.file : null;
  const saveImage = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Image saved. Share it wherever you like.');
  };
  const shareImage = async () => {
    if (!file) return;
    if (!navigator.canShare?.({ files: [file] })) {
      saveImage();
      return;
    }
    try {
      // The image is prepared before this click to preserve the share gesture.
      await navigator.share({ files: [file], title: 'My Chromatify aura', text: `${result.auraName} — my ${getTimeRangeLabel(result.timeRange).toLowerCase()} in color.` });
    } catch (error) {
      if (error.name !== 'AbortError') notify('Sharing could not open. Use Save image or Copy link instead.');
    }
  };
  const copyLink = async () => {
    try { await copyText(shareUrl); notify('Aura link copied. Anyone can open it without Spotify.'); }
    catch { notify('Copy is unavailable. Select and copy the link below.'); }
  };

  return (
    <section className="share-section" id="share" aria-labelledby="share-title">
      <div className="share-copy"><h2 id="share-title">Good music. Great colors.<br />Pass it on.</h2><p>A little piece of your listening taste, ready to go anywhere.</p></div>
      <div className="share-tools">
        <div className="share-preview" aria-label="Aura image preview"><AuraExportCard result={result} /></div>
        <div className="share-controls">
          <div className="share-buttons">
            <button type="button" className="button button-primary" disabled={!file} onClick={hasNativeShare ? shareImage : saveImage}><Icon name={hasNativeShare ? 'share' : 'download'} />{file ? (hasNativeShare ? 'Share image' : 'Save image') : (imageError ? 'Image unavailable' : 'Preparing image…')}</button>
            {hasNativeShare && <button type="button" className="button button-secondary" disabled={!file} onClick={saveImage}><Icon name="download" />Save image</button>}
            <button type="button" className="button button-secondary" onClick={copyLink}><Icon name="link" />Copy link</button>
          </div>
          {imageError ? <div className="share-error" role="alert"><p>{imageError}</p><button type="button" className="text-button" onClick={() => setAttempt((value) => value + 1)}>Try image again<Icon name="refresh" size={16} /></button></div> : <p className="share-hint" aria-live="polite">{file ? 'Portrait PNG · 1080 × 1920 · ready for your story' : 'Putting the finishing touches on your image.'}</p>}
          <details className="share-link-details"><summary>View your shareable link</summary><label className="sr-only" htmlFor="share-url">Shareable aura link</label><input id="share-url" readOnly value={shareUrl} onFocus={(event) => event.target.select()} /></details>
        </div>
      </div>
      <div className="export-render" aria-hidden="true"><AuraExportCard result={result} cardRef={cardRef} /></div>
    </section>
  );
}
