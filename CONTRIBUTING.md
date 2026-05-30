# Contributing Guide

Thanks for contributing to PCSS Robotics.

## Prerequisites

- Node.js 18+
- npm 9+

## Local Setup

```bash
npm install
npm run dev
```

Open:

- http://127.0.0.1:3142/
- http://127.0.0.1:3142/admin

## What To Change Where

- Team content: `src/content/siteContent.json`
- Section components: `src/components/sections/`
- Section registry: `src/components/Sections.jsx`
- Global layout: `src/components/Layout.jsx`
- Styling: `src/styles.css`

## Quality Gates

Before pushing, run:

```bash
npm run lint
npm run build
```

Your change should pass both commands.

## Branch and Commit Style

- Use short-lived feature branches.
- Keep commits focused and small.
- Use clear commit messages, e.g.:
  - `feat: add outreach resources section`
  - `fix: harden event date rendering`
  - `docs: improve deployment instructions`

## Pull Requests

Include:

- What changed
- Why it changed
- Screenshots for UI changes
- Any follow-up tasks

## Content Editing Flow (Non-Developers)

1. Edit content in `/admin`.
2. Export JSON.
3. Replace `src/content/siteContent.json`.
4. Run lint and build.
5. Open a PR.

## Notes

- This is a single-page app. Route rewrites are handled by `vercel.json` for production hosting.
- NPM registry is configured via `.npmrc` for the public npm workflow.
