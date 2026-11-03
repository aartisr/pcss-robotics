# Vercel deployment

The project is configured in `vercel.json` as a Vite site. Vercel runs `npm ci` against the public npm registry with Node 22, then `npm run build` and serves `dist`. The build generates the discovery pages and checks the output for private repository and registry references.

In Vercel project settings, use Node.js 22.x. The install command and committed `package-lock.json` use `registry.npmjs.org`. Keep any corporate npm registry configuration in your local user-level `~/.npmrc` or environment; do not add its URL or credentials to this repository or Vercel project settings.

Online arcade multiplayer requires a separately hosted WebSocket service. Set `VITE_ARENA_WS_URL` to that service's `wss://.../ws` address at build time to enable it. Without this variable, the deployed arcade opens in local two-player mode. The standalone `server.ts` is not part of the Vercel site build.

Before deploying, use Node 22.12 or newer and run `npm ci`, `npm run lint`, and `npm run build`. On the current workstation, `nvm use system` selects Node 22.19.0. The production build also runs `scripts/verify-vercel-output.mjs`.

The GitHub Pages companion guide and GitHub wiki are described in `GITHUB_PAGES_WIKI.md`.
