import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { generateAura } from '../services/auraService';

jest.mock('../services/auraService', () => ({ generateAura: jest.fn() }));
jest.mock('../services/sharedTrackService', () => ({ loadSharedTrackArtwork: async (songs) => songs }));
jest.mock('./AuraSleeve', () => ({ AuraSleeve: () => <div />, ColorPalette: () => <div /> }));
jest.mock('./SharePanel', () => () => <section data-testid="share-panel"><button>Save image</button><button>Copy link</button></section>);

const result = { auraColor: '#ac86ed', auraName: 'Daydream Stereo', ownerName: 'Alex', createdAt: '2026-10-21T10:00:00.000Z', timeRange: 'short_term', top3Colors: ['#ac86ed'], topSongs: [] };

test('shared results retain the original owner and date while allowing re-sharing', async () => {
  const { container } = render(<Dashboard sharedAura={result} notify={() => {}} />);
  expect(await screen.findByRole('heading', { level: 1, name: 'Alex’s Chromatify' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Make your aura' })).toBeTruthy();
  expect(screen.getByTestId('share-panel')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Share this aura' })).toBeTruthy();
  expect(container.querySelector('time').getAttribute('dateTime')).toBe(result.createdAt);
  expect(screen.getByRole('heading', { name: 'Top three colors' })).toBeTruthy();
});

test('older links retain a friendly anonymous heading without an invented creation date', async () => {
  const { container } = render(<Dashboard sharedAura={{ ...result, ownerName: '', createdAt: '' }} notify={() => {}} />);
  expect(await screen.findByRole('heading', { level: 1, name: 'A little music. A lot of color.' })).toBeTruthy();
  expect(screen.getByTestId('share-panel')).toBeTruthy();
  expect(container.querySelector('time')).toBeNull();
});

test('owners can still share their generated results', async () => {
  generateAura.mockResolvedValue(result);
  render(<Dashboard accessToken="test-token" notify={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Generate my aura' }));
  expect(await screen.findByTestId('share-panel')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Share your aura' })).toBeTruthy();
});

test('the shared-page invitation starts after four seconds and stops when its animation ends', async () => {
  jest.useFakeTimers();
  const matchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: false });
  try {
    render(<Dashboard sharedAura={result} notify={() => {}} />);
    const link = screen.getByRole('link', { name: 'Make your aura' });
    await act(async () => { jest.advanceTimersByTime(3999); });
    expect(link.classList.contains('create-aura-link--highlight')).toBe(false);
    act(() => { jest.advanceTimersByTime(1); });
    expect(link.classList.contains('create-aura-link--highlight')).toBe(true);
    fireEvent.animationEnd(link);
    expect(link.classList.contains('create-aura-link--highlight')).toBe(false);
  } finally {
    window.matchMedia = matchMedia;
    jest.useRealTimers();
  }
});

test('reduced motion keeps the invitation still', async () => {
  jest.useFakeTimers();
  const matchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: true });
  try {
    render(<Dashboard sharedAura={result} notify={() => {}} />);
    await act(async () => { jest.advanceTimersByTime(20000); });
    expect(screen.getByRole('link', { name: 'Make your aura' }).classList.contains('create-aura-link--highlight')).toBe(false);
  } finally {
    window.matchMedia = matchMedia;
    jest.useRealTimers();
  }
});
