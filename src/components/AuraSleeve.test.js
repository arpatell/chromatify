import React from 'react';
import { render, screen } from '@testing-library/react';
import { ColorPalette, sleeveWash, SAMPLE_AURA, AuraExportCard } from './AuraSleeve';
import { arrayToHex, calculateAuraColor } from '../services/colorService';
import { getColorNames } from '../services/colorNamesService';

jest.mock('../services/colorNamesService', () => ({ getColorNames: jest.fn(), getCachedColorName: () => undefined }));

test('homepage preview uses the generated aura hex rather than its first swatch', () => {
  const palette = [[172, 134, 237], [237, 153, 126], [143, 196, 176]];
  expect(SAMPLE_AURA.auraColor).toBe(arrayToHex(calculateAuraColor(palette)));
  expect(SAMPLE_AURA.auraColor).not.toBe(SAMPLE_AURA.top3Colors[0]);
});

test('export cards retain the original creator name and creation date', async () => {
  getColorNames.mockResolvedValue(['Violet']);
  const result = { ...SAMPLE_AURA, ownerName: 'Alex', createdAt: '2026-10-21T10:00:00.000Z', top3Colors: ['#ac86ed'], topSongs: [] };
  const { container } = render(<AuraExportCard result={result} />);
  expect(screen.getByText('Alex’s music, in color.')).toBeTruthy();
  expect(container.querySelector('time').getAttribute('dateTime')).toBe(result.createdAt);
  expect(await screen.findByText('Violet')).toBeTruthy();
});

test('current provider names replace old labels without changing swatch hex values', async () => {
  getColorNames.mockResolvedValue(['Dover Grey', 'Tin', 'Indian Reed']);
  const result = { top3Colors: ['#838484', '#8f8f8f', '#a37060'], top3Names: ['Lush Aqua', 'Lush Coral', 'Lush Coral'] };
  const { container } = render(<ColorPalette result={result} />);
  expect(await screen.findByText('Dover Grey')).toBeTruthy();
  expect(screen.getByText('Tin')).toBeTruthy();
  expect(screen.getByText('Indian Reed')).toBeTruthy();
  expect(screen.queryByText(/Lush/)).toBeNull();
  expect(screen.getByText('#838484')).toBeTruthy();
  expect(container.querySelector('.color-swatch').style.background).toBe('rgb(131, 132, 132)');
});

test('sleeve text remains readable over dark, mixed, and light palettes', () => {
  const luminance = (rgb) => rgb.reduce((sum, c, i) => {
    const v = c / 255;
    return sum + (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][i];
  }, 0);
  const ink = luminance([18, 23, 25]);
  [['#45178e', '#001344', '#0a0323'], ['#ff0000', '#00ff00', '#0000ff'], ['#ffffff', '#ffddaa', '#88eecc'], ['#000000']].forEach((palette) => {
    const wash = sleeveWash(palette);
    const rgb = palette.map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
    const darkest = [0, 1, 2].map((i) => Math.min(...rgb.map((c) => c[i])));
    const background = darkest.map((c) => c * (1 - wash) + 255 * wash);
    expect((luminance(background) + .05) / (ink + .05)).toBeGreaterThanOrEqual(4.5);
  });
});
