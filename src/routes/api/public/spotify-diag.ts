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
          return Response.json({
            authorizedAs: { id: me.id, display_name: me.display_name, product: me.product },
            playlist: {
              id: playlist.id,
              name: playlist.name,
              owner: playlist.owner,
              collaborative: playlist.collaborative,
              public: playlist.public,
            },
            match: me.id === playlist.owner.id,
          });
        } catch (e: any) {
          return new Response(`Diag failed: ${e?.message ?? String(e)}`, { status: 500 });
        }
      },
    },
  },
});
