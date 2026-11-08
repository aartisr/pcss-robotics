# PCSS II Robotics website

React and TypeScript site for PCSS II Robotics. The public build is a Vite static site; the optional `server.ts` provides local WebSocket arcade rooms.

Public repository: [aartisr/pcss-robotics](https://github.com/aartisr/pcss-robotics).

## Run locally

Use Node.js 22.12 or newer (as declared in `package.json`).
On this workstation, run `nvm use system` to select the installed Node 22.19.0 before installing.
The project `.npmrc` uses your user-level npm registry for local installs, including an internal mirror when configured. Keep registry addresses and credentials in your user-level `~/.npmrc`; Vercel explicitly installs from the public npm registry.

```sh
npm ci
npm run dev
```

Run the checks before publishing:

```sh
npm run lint
npm test
npm run build
```

## Change or add a section

- `src/App.tsx` owns the site shell and global dialogs. Keep feature content out of it.
- `src/components/SectionView.tsx` loads each feature on demand. Register a new section here.
- `src/types.ts` defines the `NavSection` union. Add the new section identifier there.
- `src/seo/siteMetadata.ts` defines its canonical path, title, description, and discovery metadata.
- `src/components/Navigation.tsx`, `MobileBottomNav.tsx`, and `CommandPaletteModal.tsx` choose where the section appears in navigation.
- `src/components/HomeSection.tsx` contains the home page. Its hero is a separate component, `HeroSection.tsx`.
- `src/components/SiteFooter.tsx` contains footer links and reuses the canonical paths from `siteMetadata.ts`.
- Event content is in `src/features/events/`; reusable learning resources are in `src/features/learning/`; engineering learning content is in `src/data/roboticsData.ts`. The student and mentor roster defaults are in `src/data/teamRosterData.ts`.

## Add a jam or event

Add one record to `src/features/events/events.ts`. Give it a stable `id`, start and end timestamps with time zone offsets, the venue or area, summary, highlights, and an optional registration URL. The event page, homepage feature, and history update from that catalog. Events move from upcoming to live to past based on their timestamps; the next upcoming event is featured automatically. Keep completed events in the catalog as history instead of leaving stale registration calls to action.

Haven’s local details come from the PCSS II Robotics flyer: November 14–15, 2026, 10 a.m.–4 p.m. each day, beginner guidance, food, a T-shirt, and surprise prizes for the top three projects. The flyer does not specify an exact venue. The current button uses Hack Club’s official Haven page until a local registration URL is available. Circuit’s June 6–7, 2026 dates come from the older event draft previously in this repository. Do not add attendance totals or outcomes without a source.

## Browser storage and arcade

Roster edits, apparel notes, and team planning records are saved only in the current browser's local storage; there is no shared submission backend. An arcade `?room=...` invite parameter survives canonical URL redirects. Hosted multiplayer requires `VITE_ARENA_WS_URL` and a running WebSocket server; without it the arcade starts in local play mode.
