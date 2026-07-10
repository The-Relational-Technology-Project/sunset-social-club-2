import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/spotify-diag")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        if (!token || token !== process.env.SPOTIFY_SETUP_TOKEN) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { getUserTokenForDiag, getPlaylistOwnerForDiag } = await import(
            "@/lib/spotify.server"
          );
          const { accessToken, me } = await getUserTokenForDiag();
          const playlist = await getPlaylistOwnerForDiag(accessToken);

          // Try a real append with a known track (Rick Astley - Never Gonna Give You Up)
          const testUri = "spotify:track:4cOdK2wGLETKBW3PvgPWqT";
          const appendRes = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
              body: JSON.stringify({ uris: [testUri] }),
            },
          );
          const appendBody = await appendRes.text();

          return Response.json({
            authorizedAs: me,
            playlist: {
              id: playlist.id,
              name: playlist.name,
              owner: playlist.owner,
              collaborative: playlist.collaborative,
              public: playlist.public,
            },
            match: me.id === playlist.owner.id,
            testAppend: { status: appendRes.status, body: appendBody },
          });

        } catch (e: any) {
          return new Response(`Diag failed: ${e?.message ?? String(e)}`, { status: 500 });
        }
      },
    },
  },
});
