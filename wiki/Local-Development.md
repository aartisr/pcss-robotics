# Local development

## Requirements

- Node.js 22.12 or newer within the Node 22 release line.
- npm and access to the dependencies in `package-lock.json`.

```sh
node --version
npm ci
npm run dev
```

The development server runs on port 3000. Run `npm run lint` for TypeScript checking and `npm run build` to produce the release files in `dist`.

The committed lockfile uses the public npm registry. Developers who need a corporate registry should configure it in their own user-level npm settings or environment. Do not commit a private registry URL or credentials.

The Vite development command serves the frontend. The standalone `server.ts` is a separate WebSocket application; see [[Arcade]].
