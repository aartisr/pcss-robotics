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

The committed lockfile uses public npm URLs. The project `.npmrc` remaps them to the registry in your user-level npm configuration for local installs, including an internal mirror. Keep the registry address and credentials out of this public repository. On the current workstation, `nvm use system` selects Node 22.19.0.

The Vite development command serves the frontend. The standalone `server.ts` is a separate WebSocket application; see [[Arcade]].
