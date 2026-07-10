// Server-only Spotify helpers. Never import into client code.
// Two auth modes:
//  - App token (Client Credentials) for public search
//  - User token (Refresh Token) for playlist modification on the club's account

interface CachedToken {
  token: string;
  expiresAt: number;
}

let appTokenCache: CachedToken | null = null;
let userTokenCache: CachedToken | null = null;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

async function getAppToken(): Promise<string> {
  if (appTokenCache && appTokenCache.expiresAt > Date.now() + 60_000) {
    return appTokenCache.token;
  }
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Spotify app token failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  appTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return appTokenCache.token;
}

async function getUserToken(): Promise<string> {
  if (userTokenCache && userTokenCache.expiresAt > Date.now() + 60_000) {
    return userTokenCache.token;
  }
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const refreshToken = requireEnv("SPOTIFY_REFRESH_TOKEN");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error(`Spotify refresh failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number; scope?: string };
  lastUserScope = data.scope ?? null;
  userTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return userTokenCache.token;
}

let lastUserScope: string | null = null;
export function getLastUserScope() {
  return lastUserScope;
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  artists: string;
  album: string;
  albumArt: string | null;
  durationMs: number;
  previewUrl: string | null;
}

export async function searchTracks(query: string, limit = 8): Promise<SpotifyTrack[]> {
  const q = query.trim();
  if (!q) return [];
  const token = await getAppToken();
  const url = `https://api.spotify.com/v1/search?type=track&limit=${limit}&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    throw new Error(`Spotify search failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    tracks: {
      items: Array<{
        id: string;
        uri: string;
        name: string;
        duration_ms: number;
        preview_url: string | null;
        artists: Array<{ name: string }>;
        album: { name: string; images: Array<{ url: string; width: number }> };
      }>;
    };
  };
  return data.tracks.items.map((t) => {
    const images = t.album.images ?? [];
    const smallest =
      images.length > 0 ? images.reduce((a, b) => (a.width < b.width ? a : b)) : null;
    return {
      id: t.id,
      uri: t.uri,
      name: t.name,
      artists: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      albumArt: smallest?.url ?? null,
      durationMs: t.duration_ms,
      previewUrl: t.preview_url,
    };
  });
}

export async function getTrack(trackId: string): Promise<SpotifyTrack | null> {
  const token = await getAppToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(trackId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Spotify track lookup failed [${res.status}]: ${await res.text()}`);
  }
  const t = (await res.json()) as {
    id: string;
    uri: string;
    name: string;
    duration_ms: number;
    preview_url: string | null;
    artists: Array<{ name: string }>;
    album: { name: string; images: Array<{ url: string; width: number }> };
  };
  const images = t.album.images ?? [];
  const smallest =
    images.length > 0 ? images.reduce((a, b) => (a.width < b.width ? a : b)) : null;
  return {
    id: t.id,
    uri: t.uri,
    name: t.name,
    artists: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    albumArt: smallest?.url ?? null,
    durationMs: t.duration_ms,
    previewUrl: t.preview_url,
  };
}

export async function appendTrackToPlaylist(trackUri: string): Promise<{ snapshotId: string }> {
  const playlistId = requireEnv("SPOTIFY_PLAYLIST_ID");
  const doJsonRequest = async (token: string) =>
    fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [trackUri] }),
    });
  const doQueryRequest = async (token: string) =>
    fetch(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks?uris=${encodeURIComponent(trackUri)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

  let token = await getUserToken();
  let res = await doJsonRequest(token);
  if (res.status === 401) {
    userTokenCache = null;
    token = await getUserToken();
    res = await doJsonRequest(token);
  }
  if (res.status === 403) {
    res = await doQueryRequest(token);
    if (res.status === 401) {
      userTokenCache = null;
      token = await getUserToken();
      res = await doQueryRequest(token);
    }
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Spotify append failed [${res.status}]: ${body}`);
  }
  const data = (await res.json()) as { snapshot_id: string };
  return { snapshotId: data.snapshot_id };
}

export async function removeTrackFromPlaylist(trackUri: string): Promise<{ snapshotId: string }> {
  const playlistId = requireEnv("SPOTIFY_PLAYLIST_ID");
  const doRequest = async (token: string) =>
    fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: [{ uri: trackUri }] }),
    });
  let token = await getUserToken();
  let res = await doRequest(token);
  if (res.status === 401) {
    userTokenCache = null;
    token = await getUserToken();
    res = await doRequest(token);
  }
  if (!res.ok) {
    throw new Error(`Spotify remove failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as { snapshot_id: string };
  return { snapshotId: data.snapshot_id };
}

// One-time OAuth setup helpers
export const SPOTIFY_SCOPES = "playlist-modify-public playlist-modify-private";

export function buildAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForRefreshToken(
  code: string,
  redirectUri: string,
): Promise<{ refreshToken: string; accessToken: string }> {
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error(`Spotify code exchange failed [${res.status}]: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; refresh_token: string };
  return { refreshToken: data.refresh_token, accessToken: data.access_token };
}

export async function getUserTokenForDiag(): Promise<{
  accessToken: string;
  me: { id: string; display_name: string | null; product: string };
}> {
  userTokenCache = null;
  const accessToken = await getUserToken();
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`/me failed [${res.status}]: ${await res.text()}`);
  const me = (await res.json()) as { id: string; display_name: string | null; product: string };
  return { accessToken, me };
}

export async function getPlaylistOwnerForDiag(accessToken: string): Promise<{
  id: string;
  name: string;
  collaborative: boolean;
  public: boolean;
  owner: { id: string; display_name: string | null };
}> {
  const playlistId = requireEnv("SPOTIFY_PLAYLIST_ID");
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}?fields=id,name,collaborative,public,owner(id,display_name)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error(`playlist fetch failed [${res.status}]: ${await res.text()}`);
  return (await res.json()) as any;
}

