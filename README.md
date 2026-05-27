# PCSS II Robotics Website

A standalone, editable, responsive robotics team website for **PCSS II Robotics** built with React, Vite, and TanStack.

The project is designed so team content can be maintained without changing component code. Most website copy, navigation, page data, events, sponsor tiers, robot archive entries, and contact details live in JSON and can also be edited through the built-in Admin page.

## Project Location

```bash
/Users/rraviku2/kailasa/pcss-robotics
```

## Tech Stack

- React 18
- Vite 6
- TanStack Router
- TanStack Query
- TanStack Table
- Lucide React icons
- Plain CSS with responsive layout rules

## Prerequisites

Install Node.js and npm before running the project.

Recommended:

```bash
node --version
npm --version
```

This project was verified with Node `v20.15.1` and npm `10.7.0`.

## Install Dependencies

From the project directory:

```bash
cd /Users/rraviku2/kailasa/pcss-robotics
npm install
```

This installs all runtime and development dependencies listed in `package.json`.

## Run Locally

Start the Vite development server:

```bash
cd /Users/rraviku2/kailasa/pcss-robotics
npm run dev
```

By default, the project is configured to run on port `3142`.

Open:

```text
http://127.0.0.1:3142/
```

Admin editor:

```text
http://127.0.0.1:3142/admin
```

If port `3142` is busy, run with a different port:

```bash
npm run dev -- --port 3143
```

Then open:

```text
http://127.0.0.1:3143/
```

## Build for Production

Create a production build:

```bash
npm run build
```

The generated static site will be written to:

```text
dist/
```

The `dist/` folder is intentionally ignored by git because it can always be regenerated.

## Preview the Production Build

After running `npm run build`, preview the compiled site locally:

```bash
npm run preview
```

By default, Vite preview is configured to use port `4142`.

Open:

```text
http://127.0.0.1:4142/
```

## Lint

Run ESLint:

```bash
npm run lint
```

This checks the source files for common JavaScript and React issues.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the production site into `dist/`.

```bash
npm run preview
```

Serves the production build locally for verification.

```bash
npm run lint
```

Runs ESLint against the project source.

## Project Structure

```text
pcss-robotics/
  index.html
  package.json
  package-lock.json
  vite.config.js
  README.md
  public/
    robots.txt
    sitemap.xml
  research/
    benchmark-notes.md
  src/
    main.jsx
    router.jsx
    styles.css
    admin/
      AdminPage.jsx
    assets/
      robotics-lab-hero.png
    components/
      Icon.jsx
      Layout.jsx
      Pages.jsx
      Sections.jsx
    content/
      siteContent.json
    data/
      contentStore.js
```

## Content Editing Model

The primary content file is:

```text
src/content/siteContent.json
```

This file controls:

- Brand name
- Tagline
- Location
- School name
- Email
- Navigation items
- Home hero copy
- Home page sections
- All generic pages
- Program pathways
- Robot archive entries
- Outreach copy
- Sponsor tiers
- Events
- Media entries
- Join page copy
- Contact page copy

To make permanent content changes, edit:

```bash
src/content/siteContent.json
```

Then rebuild:

```bash
npm run build
```

## Admin Editor

The project includes a browser-based Admin page:

```text
http://127.0.0.1:3142/admin
```

The Admin page lets you edit:

- Brand fields
- Page titles
- Page summaries
- Raw JSON content

Admin changes are saved to browser `localStorage`. This means:

- Changes are immediate in the current browser.
- Changes survive refreshes in that browser.
- Changes do not automatically update `src/content/siteContent.json`.
- Use **Export JSON** to download the edited content.
- Replace `src/content/siteContent.json` with the exported JSON when you want to commit those edits to the project.

## Admin JSON Workflow

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Open:

   ```text
   http://127.0.0.1:3142/admin
   ```

3. Edit content using the form fields or raw JSON editor.

4. Click **Export JSON**.

5. Use the exported JSON to update:

   ```text
   src/content/siteContent.json
   ```

6. Run:

   ```bash
   npm run lint
   npm run build
   ```

7. Commit the updated content.

## Reset Admin Edits

The Admin page has a **Reset** button.

Reset clears the browser's saved `localStorage` version and reloads the default content from:

```text
src/content/siteContent.json
```

Use this if the local Admin view gets out of sync or if invalid test content was saved.

## Pages and Routes

Routes are generated from the content model using TanStack Router.

Current public routes:

```text
/
/about
/programs
/robots
/outreach
/sponsors
/events
/media
/join
/contact
```

Admin route:

```text
/admin
```

The route definitions are created in:

```text
src/router.jsx
```

The pages themselves are rendered through reusable components in:

```text
src/components/Pages.jsx
src/components/Sections.jsx
```

## Add a New Page

To add a new page:

1. Open:

   ```text
   src/content/siteContent.json
   ```

2. Add a navigation item:

   ```json
   {
     "label": "Resources",
     "path": "/resources"
   }
   ```

3. Add a page object to the `pages` array:

   ```json
   {
     "slug": "resources",
     "title": "Resources",
     "summary": "Training links, engineering notebooks, and team templates.",
     "sections": [
       {
         "type": "featureGrid",
         "eyebrow": "Student resources",
         "title": "Reusable tools for the season",
         "items": [
           {
             "title": "Safety checklist",
             "body": "A quick checklist for safe workshop habits."
           }
         ]
       }
     ]
   }
   ```

4. Restart the dev server if needed.

5. Visit:

   ```text
   http://127.0.0.1:3142/resources
   ```

## Supported Section Types

The renderer currently supports these section `type` values:

```text
featureGrid
timeline
story
values
programs
robots
sponsorTiers
events
gallery
contact
join
```

Section rendering logic lives in:

```text
src/components/Sections.jsx
```

If a section type is not recognized, it falls back to the feature grid renderer.

## Add or Edit Events

Events live in `src/content/siteContent.json` inside the Events page.

Example:

```json
{
  "date": "2026-03-07",
  "name": "Community Robot Reveal",
  "category": "Outreach",
  "location": "PCSS II gym"
}
```

Dates should use this format:

```text
YYYY-MM-DD
```

## Add or Edit Sponsor Tiers

Sponsor tiers live in the Sponsors page section.

Example:

```json
{
  "tier": "Gold",
  "amount": "$2,500+",
  "benefits": [
    "Logo on sponsor wall",
    "Social recognition",
    "Event invitation"
  ]
}
```

## Add or Edit Robots

Robot archive entries live in the Robots page section.

Example:

```json
{
  "season": "2026",
  "name": "Rebuild Prototype",
  "status": "Planning",
  "summary": "Placeholder entry for the current season.",
  "highlights": [
    "Strategy notebook",
    "Modular drivetrain",
    "Early CAD reviews"
  ]
}
```

## Images and Assets

The current hero image is:

```text
src/assets/robotics-lab-hero.png
```

It is referenced in:

```text
src/styles.css
```

Search for:

```css
robotics-lab-hero.png
```

To replace the hero image:

1. Add the new image to:

   ```text
   src/assets/
   ```

2. Update the CSS background image path in `src/styles.css`.

3. Run:

   ```bash
   npm run build
   ```

## SEO Files

The project includes:

```text
public/robots.txt
public/sitemap.xml
```

These files are copied into `dist/` during production builds.

If the deployed domain or route list changes, update:

```text
public/sitemap.xml
```

## Deployment

This is a static Vite site. After building, deploy the contents of:

```text
dist/
```

to any static host.

Suitable hosts include:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps
- AWS S3 + CloudFront
- Cloudflare Pages

Basic deployment flow:

```bash
npm install
npm run lint
npm run build
```

Then publish:

```text
dist/
```

## Git Workflow

This project is initialized as an independent git repository.

Check status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Initial PCSS robotics site"
```

View the current branch:

```bash
git branch
```

The branch was initialized as:

```text
main
```

## Troubleshooting

### Port Already in Use

If `3142` is already being used:

```bash
npm run dev -- --port 3143
```

### Admin Changes Are Not Showing Default Content

The Admin page stores edits in browser `localStorage`.

Open:

```text
http://127.0.0.1:3142/admin
```

Click:

```text
Reset
```

This clears local edits and reloads content from `src/content/siteContent.json`.

### JSON Editor Stops Saving

If the raw JSON editor contains invalid JSON, the Admin page shows an error and does not save the broken value.

Fix the JSON syntax, then it will save again.

Common JSON mistakes:

- Missing comma between fields
- Extra comma after the final item in an object or array
- Unescaped quotation marks inside strings
- Missing closing bracket or brace

### Build Fails After Editing JSON

Validate the content file:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/siteContent.json','utf8')); console.log('JSON OK')"
```

Then rerun:

```bash
npm run build
```

### Styles Look Stale

Stop and restart the dev server:

```bash
Control-C
npm run dev
```

Then hard refresh the browser.

### Node Version Warning

TanStack Router is pinned to a Node-compatible version in `package.json`.

If npm warns about engines after dependency updates, check:

```bash
npm ls @tanstack/react-router
```

The project currently pins:

```text
@tanstack/react-router 1.139.16
```

## Verification Checklist

Before shipping changes:

```bash
npm run lint
npm run build
```

Then manually check:

```text
http://127.0.0.1:3142/
http://127.0.0.1:3142/about
http://127.0.0.1:3142/programs
http://127.0.0.1:3142/robots
http://127.0.0.1:3142/outreach
http://127.0.0.1:3142/sponsors
http://127.0.0.1:3142/events
http://127.0.0.1:3142/media
http://127.0.0.1:3142/join
http://127.0.0.1:3142/contact
http://127.0.0.1:3142/admin
```

Check at desktop and mobile widths.

## Research Notes

Benchmark notes from the reconstruction are stored at:

```text
research/benchmark-notes.md
```

The original live website could not be crawled from the development network because the domain, `robots.txt`, and `sitemap.xml` returned a Zscaler 403 block page. The current site structure was reconstructed as a complete robotics team website using public PCSS II context and comparable robotics team website patterns.
