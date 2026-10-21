import axios from 'axios';
import { normalizeDisplayName } from '../utils/sharing';

export async function fetchDisplayName(accessToken) {
  if (!accessToken) return '';
  try {
    const { data } = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });
    // Only the public display name becomes part of the shareable result.
    return normalizeDisplayName(data?.display_name);
  } catch {
    // A missing profile must not prevent generating or sharing an aura.
    return '';
  }
}
