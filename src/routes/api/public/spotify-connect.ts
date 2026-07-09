import { createFileRoute } from "@tanstack/react-router";
import { buildAuthorizeUrl, exchangeCodeForRefreshToken } from "@/lib/spotify.server";

// One-time OAuth setup route. Gate with SPOTIFY_SETUP_TOKEN.
// Visit /api/public/spotify-connect?token=<SPOTIFY_SETUP_TOKEN> to start.
// After Spotify redirects back with ?code=..., this route displays the refresh
// token once so you can save it as SPOTIFY_REFRESH_TOKEN and revoke the setup
// token.

function redirectUri(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/public/spotify-connect`;
}

function html(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Spotify setup</title>
     <style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 20px;line-height:1.5}
     code{background:#f4f4f4;padding:2px 6px;border-radius:4px;word-break:break-all}
     .box{background:#fff8f2;border:1px solid #ec6a4c;padding:16px;border-radius:8px;margin:20px 0}</style>
     ${body}`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const Route = createFileRoute("/api/public/spotify-connect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const setupToken = process.env.SPOTIFY_SETUP_TOKEN;
        if (!setupToken) {
          return html("<h1>Setup unavailable</h1><p>SPOTIFY_SETUP_TOKEN is not configured.</p>", 500);
        }
        const providedToken = url.searchParams.get("token") ?? url.searchParams.get("state");
        if (providedToken !== setupToken) {
          return html("<h1>Not authorized</h1>", 401);
        }

        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        if (err) return html(`<h1>Spotify error</h1><p><code>${err}</code></p>`, 400);

        if (!code) {
          const authUrl = buildAuthorizeUrl(redirectUri(request), setupToken);
          return html(
            `<h1>Spotify setup</h1>
             <p>Click below to grant playlist access to your Spotify account. You'll be redirected back here with a refresh token.</p>
             <p><a href="${authUrl}"><strong>Continue to Spotify →</strong></a></p>`,
          );
        }

        try {
          const { refreshToken } = await exchangeCodeForRefreshToken(code, redirectUri(request));
          return html(
            `<h1>Success</h1>
             <p>Copy this refresh token and save it as the secret <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
             <div class="box"><code>${refreshToken}</code></div>
             <p>Once saved, delete or rotate the <code>SPOTIFY_SETUP_TOKEN</code> secret so this page can't be reused.</p>`,
          );
        } catch (e: any) {
          return html(`<h1>Exchange failed</h1><p><code>${String(e?.message ?? e)}</code></p>`, 500);
        }
      },
    },
  },
});
