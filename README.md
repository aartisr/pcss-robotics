# PCSS II Robotics Website

A content-driven, production-ready robotics team website built with React, Vite, and TanStack.

This project is designed so non-developers can safely update most site content while developers keep a modular and resilient codebase.

## Why This README Exists

This guide is optimized for fast onboarding.

- If you want to run the site quickly: start at Quick Start.
- If you want to edit team content: jump to Content Editing.
- If you want to contribute code: use Developer Workflow.
- If you are deploying: see Deployment.

## Quick Start (2-3 Minutes)

1. Install dependencies

```bash
npm install
```

2. Run the local dev server

```bash
npm run dev
```

3. Open the app

- Site: http://127.0.0.1:3142/
- Admin: http://127.0.0.1:3142/admin

4. Validate before sharing changes

```bash
npm run lint
npm run build
```

## Tech Stack

- React 18
- Vite 6
- TanStack Router
- TanStack Query
- TanStack Table
- Lucide React
- Plain CSS

## Scripts

```bash
npm run dev      # development server
npm run build    # production build to dist/
npm run preview  # serve built output locally
npm run lint     # eslint checks
```

## Project Principles

- Content-first: most copy and page structure lives in JSON.
- Modular UI: section renderers are split into focused components.
- Resilient runtime: app includes normalization and error boundaries.
- Responsive by default: layout adapts cleanly from mobile to desktop.

## Architecture At A Glance

```text
src/
  admin/
    AdminPage.jsx                    # browser editor for content
  assets/
    robotics-lab-hero.png
  components/
    AppErrorBoundary.jsx             # global recovery boundary
    Icon.jsx
    Layout.jsx
    Pages.jsx
    Sections.jsx                     # section type registry/router
    sections/                        # modular section renderers
      ContactSection.jsx
      EventsSection.jsx
      FeatureGridSection.jsx
      GallerySection.jsx
      HeroSection.jsx
      JoinSection.jsx
      ProgramsSection.jsx
      RobotsSection.jsx
      SectionIntro.jsx
      SponsorTiersSection.jsx
      StorySection.jsx
      TimelineSection.jsx
      utils.js
  content/
    siteContent.json                 # default source-of-truth content
  data/
    contentModel.js                  # normalization and safe defaults
    contentStore.js                  # load/save/reset/export flow
  main.jsx
  router.jsx
  styles.css
```

## Content Editing

### Source of Truth

Default content is in:

- src/content/siteContent.json

This file defines:

- Brand and contact info
- Navigation
- Home hero and homepage sections
- All content pages
- Events, sponsors, robots, media, outreach, join, contact

### Browser Admin Flow

The Admin page is intended for fast content editing:

- URL: http://127.0.0.1:3142/admin
- Stores edits in browser localStorage
- Exports JSON for commit-ready updates

Recommended workflow:

1. Open Admin and edit content.
2. Click Export JSON.
3. Replace src/content/siteContent.json with exported content.
4. Run lint and build.
5. Commit and push.

### Reset Local Admin Data

If your browser data gets out of sync, click Reset in Admin.

This clears localStorage and reloads defaults from src/content/siteContent.json.

## Routing Model

- The home route is always /.
- Content pages are generated from the pages array in JSON.
- Admin lives at /admin.
- Route generation is hardened against malformed or duplicate slugs.

Core router file:

- src/router.jsx

## Section System (Extensible)

Section rendering is registry-driven.

Main registry:

- src/components/Sections.jsx

Add a new section type:

1. Create a renderer in src/components/sections/.
2. Import it in src/components/Sections.jsx.
3. Add the type mapping in the components object.
4. Use that type in siteContent.json.

Current supported types:

- featureGrid
- timeline
- story
- values
- programs
- robots
- sponsorTiers
- events
- gallery
- contact
- join

Unknown section types fall back to the feature grid renderer.

## Resilience Features

This project includes several runtime protections:

- Content normalization with defaults and sanitization:
  - src/data/contentModel.js
- Safe load/save/reset behaviors:
  - src/data/contentStore.js
- App-level crash recovery UI:
  - src/components/AppErrorBoundary.jsx
- Defensive rendering for optional/malformed content:
  - section components and layout guards

## Responsive UX Notes

- Mobile menu and adaptive grids are built into styles.
- Large tables support horizontal scroll on small screens.
- Focus-visible styles are included for keyboard users.
- Reduced-motion preference is respected.

Core style file:

- src/styles.css

## Deployment

This is a static Vite app.

1. Build production assets:

```bash
npm run build
```

2. Deploy dist/ to any static host:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps
- AWS S3 + CloudFront
- Cloudflare Pages

### Vercel

This repository is configured to deploy cleanly on Vercel.

- Package metadata is configured for a private repository workflow.
- The project uses a private corporate npm registry through .npmrc.
- SPA route handling is configured in vercel.json so direct visits to routes like /about and /admin resolve to index.html.

Recommended Vercel settings:

- Framework preset: Vite
- Install command: npm install
- Build command: npm run build
- Output directory: dist

Key deploy files:

- .npmrc
- vercel.json
- package.json
- package-lock.json

## Developer Workflow

1. Create a branch.
2. Implement focused changes.
3. Run checks:

```bash
npm run lint
npm run build
```

4. Commit with a clear message.
5. Push and open a pull request.

## Troubleshooting

### Port Conflict

Run on another port:

```bash
npm run dev -- --port 3143
```

### Build Fails After Content Edits

Validate JSON quickly:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/siteContent.json','utf8')); console.log('JSON OK')"
```

Then rerun:

```bash
npm run build
```

### Admin Changes Not Matching Repo Files

Admin writes to browser localStorage only until you export and replace src/content/siteContent.json.

### Visual Changes Not Updating

Restart dev server and hard refresh browser.

## Final QA Checklist

Run:

```bash
npm run lint
npm run build
```

Manually verify:

- Home and all nav pages load correctly
- /admin loads and edits persist locally
- Mobile navigation and section layouts behave properly
- Contact links and CTA links are valid
- No console errors on key routes

## License and Ownership

This repository is owned by the PCSS II Robotics maintainers.

This project is licensed under the MIT License.

See the full license text in LICENSE.
