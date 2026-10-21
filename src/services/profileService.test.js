import axios from 'axios';
import { fetchDisplayName } from './profileService';

jest.mock('axios', () => ({ get: jest.fn() }));
beforeEach(() => jest.clearAllMocks());

test('extracts only the public display name from the authenticated Spotify profile', async () => {
  axios.get.mockResolvedValue({ data: { display_name: '  Zoë  O’Connor 🎧  ', email: 'private@example.com', id: 'private-user-id' } });
  expect(await fetchDisplayName('test-token')).toBe('Zoë O’Connor 🎧');
  expect(axios.get).toHaveBeenCalledWith('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer test-token' }, timeout: 5000,
  });
});

test('profile failure or unavailable names fall back without blocking the aura', async () => {
  axios.get.mockRejectedValueOnce(new Error('Profile unavailable'));
  expect(await fetchDisplayName('test-token')).toBe('');
  axios.get.mockResolvedValueOnce({ data: { display_name: null } });
  expect(await fetchDisplayName('test-token')).toBe('');
});

test('does not request a profile for public visitors', async () => {
  expect(await fetchDisplayName(null)).toBe('');
  expect(axios.get).not.toHaveBeenCalled();
});
