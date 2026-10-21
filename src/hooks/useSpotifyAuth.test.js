import { renderHook } from '@testing-library/react';
import axios from 'axios';
import { useSpotifyAuth } from './useSpotifyAuth';

jest.mock('axios', () => ({ post: jest.fn() }));
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { search: '?code=public-authorization-code', replace: jest.fn() };
});
afterAll(() => { window.location = originalLocation; });
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  axios.post.mockReturnValue(new Promise(() => {}));
});

test('a callback without its PKCE verifier returns to login without exchanging the code', () => {
  renderHook(() => useSpotifyAuth());
  expect(axios.post).not.toHaveBeenCalled();
  expect(window.location.replace).toHaveBeenCalledWith('/');
});

test('browser token exchange includes the verifier and never a client secret', () => {
  localStorage.setItem('spotify_pkce_verifier', 'test-verifier');
  renderHook(() => useSpotifyAuth());
  expect(axios.post).toHaveBeenCalledTimes(1);
  const [url, body] = axios.post.mock.calls[0];
  expect(url).toBe('https://accounts.spotify.com/api/token');
  expect(body.get('code_verifier')).toBe('test-verifier');
  expect(body.has('client_secret')).toBe(false);
});
