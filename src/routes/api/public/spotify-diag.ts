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
          const { getUserTokenForDiag, getPlaylistOwnerForDiag, getLastUserScope } = await import(
            "@/lib/spotify.server"
          );
          const { accessToken, me } = await getUserTokenForDiag();
          const playlist = await getPlaylistOwnerForDiag(accessToken);

          // Try both Spotify-supported append formats with a known track, then clean it up if either works.
          const testUri = "spotify:track:4cOdK2wGLETKBW3PvgPWqT";
          const jsonAppendRes = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris: [testUri] }),
            },
          );
          const jsonAppendBody = await jsonAppendRes.text();

          let queryAppend: { status: number; body: string } | null = null;
          if (!jsonAppendRes.ok) {
            const queryAppendRes = await fetch(
              `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${encodeURIComponent(testUri)}`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
              },
            );
            queryAppend = { status: queryAppendRes.status, body: await queryAppendRes.text() };
          }

          let cleanup: { status: number; body: string } | null = null;
          if (jsonAppendRes.ok || queryAppend?.status === 201) {
            const cleanupRes = await fetch(
              `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ tracks: [{ uri: testUri }] }),
              },
            );
            cleanup = { status: cleanupRes.status, body: await cleanupRes.text() };
          }

          let temporaryPlaylistTest: {
            create: { status: number; body: string };
            append: { status: number; body: string } | null;
            cleanup: { status: number; body: string } | null;
          } | null = null;
          const createTempRes = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "SSC API diagnostic temp playlist",
              public: false,
              description: "Temporary diagnostic playlist. Safe to remove.",
            }),
          });
          const createTempBody = await createTempRes.text();
          temporaryPlaylistTest = {
            create: { status: createTempRes.status, body: createTempBody },
            append: null,
            cleanup: null,
          };

          if (createTempRes.ok) {
            const tempPlaylist = JSON.parse(createTempBody) as { id: string };
            const appendTempRes = await fetch(
              `https://api.spotify.com/v1/playlists/${tempPlaylist.id}/tracks`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: [testUri] }),
              },
            );
            temporaryPlaylistTest.append = {
              status: appendTempRes.status,
              body: await appendTempRes.text(),
            };

            const cleanupTempRes = await fetch(
              `https://api.spotify.com/v1/playlists/${tempPlaylist.id}/followers`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
              },
            );
            temporaryPlaylistTest.cleanup = {
              status: cleanupTempRes.status,
              body: await cleanupTempRes.text(),
            };
          }

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
            testAppend: { json: { status: jsonAppendRes.status, body: jsonAppendBody }, query: queryAppend, cleanup },
            temporaryPlaylistTest,
            grantedScope: getLastUserScope(),
          });

        } catch (e: any) {
          return new Response(`Diag failed: ${e?.message ?? String(e)}`, { status: 500 });
        }
      },
    },
  },
});
