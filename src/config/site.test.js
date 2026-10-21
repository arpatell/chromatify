const original = process.env.REACT_APP_SITE_URL;
afterEach(() => {
  if (original === undefined) delete process.env.REACT_APP_SITE_URL;
  else process.env.REACT_APP_SITE_URL = original;
});

test.each([
  ['https://music.example/some-path', 'music.example'],
  ['new-chromatify.example', 'new-chromatify.example'],
  ['https://user:secret@invalid.example', 'chromatify.vercel.app'],
])('export branding uses the configured production host: %s', (configured, expected) => {
  jest.resetModules();
  process.env.REACT_APP_SITE_URL = configured;
  expect(require('./site').PRODUCTION_SITE_HOST).toBe(expected);
});
