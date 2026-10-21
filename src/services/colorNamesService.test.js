let getColorNames;
let getCachedColorName;
let isAbstractColorName;
const originalFetch = global.fetch;
const response = (colors) => ({ ok: true, json: async () => ({ colors }) });
beforeEach(() => {
  jest.resetModules();
  ({ getColorNames, getCachedColorName, isAbstractColorName } = require('./colorNamesService'));
  global.fetch = jest.fn();
});
afterAll(() => { global.fetch = originalFetch; });

test('batch maps provider names by requested hex rather than response order or nearest color', async () => {
  const palette = ['#838484', '#8f8f8f', '#a37060'];
  fetch.mockResolvedValue(response([
    { requestedHex: '#a37060', hex: '#a37161', name: 'Dusty Rose' },
    { requestedHex: '#838484', hex: '#848484', name: 'Storm Cloud' },
    { requestedHex: '#8f8f8f', hex: '#919191', name: 'Silver Grey' },
  ]));
  expect(await getColorNames(palette)).toEqual(['Storm Cloud', 'Silver Grey', 'Dusty Rose']);
  expect(fetch).toHaveBeenCalledTimes(1);
  const [url, options] = fetch.mock.calls[0];
  expect(url).toBe('https://api.color.pizza/v1/?values=838484,8F8F8F,A37060');
  expect(options.credentials).toBe('omit');
  expect(options.referrerPolicy).toBe('no-referrer');
  expect(getCachedColorName('#838484')).toBe('Storm Cloud');
});

test('arbitrary warm, cool, light, dark and neutral colors use the provider, with shared request/cache', async () => {
  const palette = ['#f3eadb', '#07152b', '#e2a62c', '#16bf99', '#bc61e2', '#777777'];
  const expected = ['Warm Paper', 'Deep Ink', 'Golden Haze', 'Jade', 'Orchid Haze', 'Steel Grey'];
  let resolve;
  fetch.mockReturnValue(new Promise((done) => { resolve = done; }));
  const first = getColorNames(palette);
  const second = getColorNames([...palette].reverse());
  resolve(response(palette.map((requestedHex, i) => ({ requestedHex, name: expected[i] }))));
  expect(await first).toEqual(expected);
  expect(await second).toEqual([...expected].reverse());
  expect(await getColorNames(palette)).toEqual(expected);
  expect(fetch).toHaveBeenCalledTimes(1);
});

test.each(['network', 'http', 'malformed'])('provider %s failure uses the broad non-food catalog', async (mode) => {
  if (mode === 'network') fetch.mockRejectedValueOnce(new Error('offline'));
  else if (mode === 'http') fetch.mockResolvedValueOnce({ ok: false });
  else fetch.mockResolvedValueOnce(response([{ requestedHex: '#123456', name: null }]));
  const [name] = await getColorNames(['#123456']);
  expect(isAbstractColorName(name)).toBe(true);
  expect(name).not.toBe('#123456');
  expect(await getColorNames(['#123456'])).toEqual([name]);
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('food names select the closest applicable catalog match, including compound and unknown food names', async () => {
  const colors = ['#c45434', '#9a121f', '#ed997e'];
  fetch.mockResolvedValue(response(colors.map((requestedHex, i) => ({ requestedHex, name: ['Spicy Tomato', 'Crantini', 'Peach Melba'][i] }))));
  const names = await getColorNames(colors);
  expect(names[0]).toBe('Bronze Satin');
  expect(names[1]).toBe('Ruby Red');
  names.forEach((name) => expect(isAbstractColorName(name)).toBe(true));
  ['Tomato', 'Apple Green', 'Chocolate', 'Crantini', 'Lemon Chiffon', 'Mint', 'Honey'].forEach((name) => expect(isAbstractColorName(name)).toBe(false));
});

test('the entire local catalog follows the abstract vocabulary', () => {
  const catalog = require('../data/abstractColorNames.json');
  expect(catalog.length).toBeGreaterThan(3000);
  catalog.forEach(([name]) => expect(isAbstractColorName(name)).toBe(true));
});

test('invalid input never reaches the provider', async () => {
  expect(await getColorNames(['#abc', null, '#xyzxyz'])).toEqual(['Unknown', 'Unknown', 'Unknown']);
  expect(fetch).not.toHaveBeenCalled();
});
