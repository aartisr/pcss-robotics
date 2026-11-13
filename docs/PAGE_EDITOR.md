# Page editor

Open `/admin/` and sign in with the password configured on the server. Choose one of the eight pages, add or reorder blocks, edit their fields, and press **Publish**. The public page uses the same Puck configuration and JSON data as the preview.

Templates live in [`templates/`](../templates/), one JSON file per route. The editor offers blocks for hero sections, headings, text, images, card grids, callouts, two-column layouts, and the site's interactive features. The team page has a dedicated **Team roster** block: select it, expand a member by name in the right panel, edit their fields, and publish. The robots page consists of a page heading, separate **Engineering question** blocks, and an inset note; all of their text and steps are editable. The simulator, arcade, and sponsor tools remain feature blocks so their behavior stays intact; their internal UI is still maintained in React.

## Configuration

Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as server environment variables. Locally, `.env.local` or `.env` also works; `.env.local` takes priority over `.env`, while variables supplied by the process take priority over both. Use a unique password and a random secret of at least 32 characters. These values must not use the `VITE_` prefix. See [`.env.example`](../.env.example).

Local development writes published pages to `templates/*.json`. Commit those changes as usual.

On Vercel, configure `GITHUB_CONTENT_TOKEN` with repository Contents read/write permission, `GITHUB_CONTENT_REPO` as `owner/repo`, and optionally `GITHUB_CONTENT_BRANCH` (defaults to `main`). Publishing commits the edited JSON template to that branch. Public pages read the latest JSON through the server API, and the commit can also trigger a normal Vercel rebuild for static discovery content. Without GitHub configuration, deployed publishing returns an error rather than pretending to save to Vercel's read-only filesystem.

The editor uses an eight-hour, HTTP-only, same-site signed cookie. The password and GitHub token stay server-side. Published content is available through the public read endpoint; write requests require authentication.
