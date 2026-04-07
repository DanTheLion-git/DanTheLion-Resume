/**
 * Spotify PKCE OAuth + Web Playback SDK helpers.
 *
 * The CLIENT_ID below is a public PKCE identifier — it is intentionally
 * included in client-side code and carries no security risk on its own.
 * PKCE was designed for exactly this: public clients with no stored secret.
 */

export const CLIENT_ID    = 'a7bbba876c354c84b9d5932024a1e951';
export const REDIRECT_URI = 'https://thelionsalliance.com/games/hitster/callback';
export const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
}

function base64URLEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ── Auth flow ─────────────────────────────────────────────────────────────────

export async function startSpotifyAuth(): Promise<void> {
  const verifier   = generateRandomString(128);
  const challenge  = base64URLEncode(await sha256(verifier));
  sessionStorage.setItem('spotify_verifier', verifier);

  const params = new URLSearchParams({
    client_id:             CLIENT_ID,
    response_type:         'code',
    redirect_uri:          REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge:        challenge,
    scope:                 SCOPES,
    show_dialog:           'true',   // always show consent screen → ensures new scopes are granted
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCode(code: string): Promise<void> {
  const verifier = sessionStorage.getItem('spotify_verifier');
  if (!verifier) throw new Error('No PKCE verifier in session — please restart auth.');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error_description ?? 'Token exchange failed');
  }

  const data = await res.json();
  storeTokens(data);
  sessionStorage.removeItem('spotify_verifier');
}

export async function refreshToken(): Promise<string> {
  const rt = localStorage.getItem('spotify_refresh_token');
  if (!rt) throw new Error('No refresh token stored.');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: rt,
      client_id:     CLIENT_ID,
    }),
  });

  if (!res.ok) throw new Error('Token refresh failed.');

  const data = await res.json();
  storeTokens(data);
  return data.access_token as string;
}

function storeTokens(data: Record<string, unknown>): void {
  localStorage.setItem('spotify_access_token',  data.access_token  as string);
  localStorage.setItem('spotify_token_expiry',  String(Date.now() + (data.expires_in as number) * 1000));
  if (data.refresh_token) {
    localStorage.setItem('spotify_refresh_token', data.refresh_token as string);
  }
}

export async function getValidToken(): Promise<string | null> {
  const token  = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  if (!token) return null;

  // Refresh 60 s before actual expiry
  if (expiry && Date.now() > Number(expiry) - 60_000) {
    try {
      return await refreshToken();
    } catch {
      logout();
      return null;
    }
  }

  return token;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('spotify_access_token');
}

export function logout(): void {
  ['spotify_access_token', 'spotify_refresh_token', 'spotify_token_expiry'].forEach(
    (k) => localStorage.removeItem(k)
  );
}

// ── Playback ──────────────────────────────────────────────────────────────────

export async function playTrack(trackUri: string, deviceId: string, token: string): Promise<void> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ uris: [trackUri], position_ms: 0 }),
    }
  );

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `Playback failed (${res.status})`);
  }
}
