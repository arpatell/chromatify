import { getAuraName } from './auraNaming';

const mix = { auraColor: '#ac86ed', palette: ['#ac86ed', '#ed997e', '#8fc4b0'], songs: [{ id: 'track-one' }, { id: 'track-two' }] };

test('the same listening mix keeps its title without random renaming', () => {
  expect(getAuraName(mix)).toBe(getAuraName(JSON.parse(JSON.stringify(mix))));
  expect(getAuraName({ ...mix, auraColor: '#AC86ED', palette: mix.palette.map((color) => color.toUpperCase()) })).toBe(getAuraName(mix));
  expect(getAuraName(mix)).not.toMatch(/Electric|Neon|Vivid|Lush|Soft/);
});

test('the track mix participates in naming instead of only the single blended color', () => {
  const names = new Set(Array.from({ length: 24 }, (_, index) => getAuraName({ ...mix, songs: [{ id: `different-track-${index}` }] })));
  expect(names.size).toBeGreaterThan(18);
});

test('titles are short, readable pairs that fit the sleeve', () => {
  const colors = ['#ed997e', '#8fc4b0', '#ac86ed', '#4168d4', '#f06a91'];
  colors.forEach((auraColor) => {
    const words = getAuraName({ auraColor, palette: [auraColor] }).split(' ');
    expect(words).toHaveLength(2);
    expect(words[0]).not.toBe(words[1]);
    expect(words.every((word) => word.length <= 10)).toBe(true);
  });
});
