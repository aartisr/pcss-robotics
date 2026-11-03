# Arcade modes

The [arcade](https://www.pcssiirobotics.org/arcade/) opens in local two-player mode when no online game server is configured. Two players can use the same keyboard.

Online multiplayer needs a separately hosted WebSocket service. Set `VITE_ARENA_WS_URL` to that service's `wss://.../ws` address at build time to show the online mode. The Vite site on Vercel does not run the standalone `server.ts` WebSocket process.

Do not point the online mode at the Vercel site unless a compatible WebSocket endpoint has been deployed there.
