# Deployment

## Primary website: Vercel

`vercel.json` sets the Vite framework, public npm install, `npm run build`, and `dist` output. Use Node 22.12 or newer in the Vercel project. The build generates static discovery pages and checks output for unintended repository and registry references.

```sh
npm run lint
npm run build
```

The live site's canonical address is [https://www.pcssiirobotics.org/](https://www.pcssiirobotics.org/). Configure that domain in Vercel; keep GitHub Pages on its default GitHub domain.

## Companion guide: GitHub Pages

The `docs/` folder contains a small static guide. The `.github/workflows/pages.yml` workflow uploads and deploys this folder after changes to it on `main`, or when run manually. Its canonical URL is the GitHub Pages address; the main robotics site remains on Vercel.

In the [public repository](https://github.com/aartisr/pcss-robotics), choose **Settings → Pages → GitHub Actions** as the build and deployment source. The Pages guide is also public.

The Pages guide links to the canonical Vercel website. The Vite application is deployed separately by Vercel from the same public repository.
