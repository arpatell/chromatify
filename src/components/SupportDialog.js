import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { KOFI_URL, SUPPORT_WALLETS } from '../config/support';
import { copyText } from '../utils/sharing';
import Icon from './Icon';

export default function SupportDialog({ open, onClose, notify }) {
  const [selected, setSelected] = useState('sol');
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const wallet = SUPPORT_WALLETS.find((item) => item.id === selected);
  const copyAddress = async () => {
    try { await copyText(wallet.address); notify(`${wallet.network} address copied.`); }
    catch { notify('Copy is unavailable. Select and copy the address below.'); }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="support-dialog" aria-labelledby="support-title">
      <DialogTitle id="support-title" component="div"><div className="dialog-heading"><h2>{cryptoOpen ? 'Support with crypto' : 'Keep the colors flowing.'}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close support"><Icon name="close" /></button></div></DialogTitle>
      <DialogContent>
        {!cryptoOpen && <><p className="support-intro">Enjoying Chromatify? Buy me a coffee to support development. Feedback and ideas are welcome on Ko-fi, too.</p>
        <div className="support-actions"><a className="button button-primary" href={KOFI_URL} target="_blank" rel="noopener noreferrer"><Icon name="coffee" />Support on Ko-fi<Icon name="external" size={16} /></a><button type="button" className="button button-secondary" onClick={() => setCryptoOpen(true)} aria-controls="crypto-wallets">Use crypto</button></div></>}
        {cryptoOpen && <button type="button" className="text-button" onClick={() => setCryptoOpen(false)}>Back to support options</button>}
        {cryptoOpen && <section id="crypto-wallets" className="crypto-section" aria-label="Crypto support">
          <h3>Choose a network</h3>
          <div className="network-options">{SUPPORT_WALLETS.map((item) => <button type="button" key={item.id} className="network-option" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}</div>
          <figure className="wallet-qr">
            <div className="wallet-qr-code"><QRCodeSVG value={wallet.address} size={200} level="M" marginSize={4} bgColor="#edf0e8" fgColor="#121719" title={`${wallet.network} wallet QR code`} /></div>
            <figcaption><strong>{wallet.network}</strong><span>Scan to copy the wallet address.</span></figcaption>
          </figure>
          <label className="wallet-label" htmlFor="wallet-address">{wallet.network} wallet address</label>
          <textarea id="wallet-address" className="wallet-address" value={wallet.address} readOnly rows={3} spellCheck={false} onFocus={(event) => event.target.select()} />
          <button type="button" className="button button-secondary" onClick={copyAddress}><Icon name="copy" size={18} />Copy {wallet.label} address</button>
        </section>}
      </DialogContent>
    </Dialog>
  );
}
