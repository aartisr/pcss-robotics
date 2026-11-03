# Deployment

## Primary website: Vercel

`vercel.json` sets the Vite framework, public npm install, `npm run build`, and `dist` output. Use Node 22.x in the Vercel project. The build generates the static discovery pages and checks output for private repository or registry references.

```sh
npm run lint
npm run build
```

The live site's canonical address is [https://www.pcssiirobotics.org/](https://www.pcssiirobotics.org/). Configure that domain in Vercel; keep GitHub Pages on its default GitHub domain.

## Companion guide: GitHub Pages

The `docs/` folder contains a small static guide. The `.github/workflows/pages.yml` workflow uploads and deploys this folder after changes to it on `main`, or when run manually. Its canonical URL is the GitHub Pages address; the main robotics site remains on Vercel.

In repository **Settings → Pages**, choose **GitHub Actions** as the build and deployment source. GitHub Pages for a private repository requires an eligible GitHub plan. The Pages site is public even if the repository itself is private.

The Pages guide links to the canonical Vercel website. It does not publish the Vite application or its private source.
