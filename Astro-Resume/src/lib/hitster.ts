/**
 * Hitster game helpers: QR parsing and Spotify track info fetching.
 */

export interface TrackInfo {
  name:     string;
  artist:   string;
  year:     number;
  albumArt: string;
}

/** Parse a QR code value into a Spotify track URI, or null if unrecognised. */
export function parseQRToTrackUri(raw: string): string | null {
  const trimmed = raw.trim();

  // Full Spotify URI: spotify:track:XXXX
  if (/^spotify:track:[A-Za-z0-9]+$/.test(trimmed)) return trimmed;

  // Spotify open URL: https://open.spotify.com/track/XXXX or .../track/XXXX?...
  const m = trimmed.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
  if (m) return `spotify:track:${m[1]}`;

  return null;
}

export function trackIdFromUri(uri: string): string {
  return uri.split(':').pop() ?? '';
}

/** Fetch track metadata (name, artist, year, album art) via the Spotify API. */
export async function fetchTrackInfo(trackUri: string, accessToken: string): Promise<TrackInfo | null> {
  const id  = trackIdFromUri(trackUri);
  if (!id) return null;

  try {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;

    const d = await res.json();
    return {
      name:     d.name,
      artist:   (d.artists as Array<{ name: string }>).map((a) => a.name).join(', '),
      year:     new Date(d.album.release_date as string).getFullYear(),
      albumArt: (d.album.images as Array<{ url: string }>)[0]?.url ?? '',
    };
  } catch {
    return null;
  }
}
