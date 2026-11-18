# Website editor: school handoff

This guide covers how school staff can access and publish website updates, and what the next maintainer needs to keep the editor working.

## What the editor does

The editor is available at [`/admin/`](https://www.pcssiirobotics.org/admin/). It lets an authorized editor update page content without changing application code. The public website remains viewable by everyone; sign-in is only required to make edits.

An editor can update any of the eight pages in the page selector. Pages are built from reusable content blocks, such as headings, text, images, cards, and callouts. Some interactive features are managed in code and are not intended to be rebuilt in the editor.

**Publishing is immediate.** On the production site, Publish saves the page to the configured GitHub branch (`main` by default) as a Git commit. All authorized editors can publish all pages; there are no separate roles or page-by-page permissions.

## Day-to-day editing

1. Open [`/admin/`](https://www.pcssiirobotics.org/admin/).
2. Choose **Continue with GitHub** or **Continue with Google**.
3. Sign in with an account whose verified email address is on the approved editor list.
4. Choose a page, make your changes, and use the preview or **View page** link to check them.
5. Select **Publish** when the changes are ready. Wait for the confirmation message.
6. Use **Sign out** when finished. Sign-in sessions expire automatically after eight hours.

If you leave a page with unpublished edits, the editor warns that those changes will be lost. Once published, a change is recorded as a commit in GitHub and can be reviewed or reverted there by someone with repository access.

## Who can edit

Access is limited to the email addresses in the server setting `OAUTH_ALLOWED_EMAILS`. Use a comma-separated list, for example:

```text
editor.one@example.org,editor.two@example.org
```

Email matching ignores capitalization and surrounding spaces. Google accounts must have a verified email. GitHub accounts must have a verified email that GitHub makes available to the app.

To add or remove an editor, update `OAUTH_ALLOWED_EMAILS` in the deployment settings and redeploy. Removing an address prevents it from authenticating again and invalidates its existing editor session on the next request.

## One-time sign-in setup

The site supports GitHub and Google sign-in. Set up only the provider(s) the school plans to offer.

### Register the application with each provider

Use this exact production callback address in each OAuth application:

```text
https://www.pcssiirobotics.org/api/oauth
```

- **GitHub:** Create an OAuth App for the website. Set its callback URL to the address above. The editor requests `read:user` and `user:email` access so it can confirm the account and its verified email.
- **Google:** Create an OAuth client for a web application. Add the address above as an authorized redirect URI. The editor requests `openid`, `email`, and `profile` to confirm the Google account and verified email. Follow the school’s Google Workspace policy for consent-screen and user-access settings.

Each provider gives the application a client ID and client secret. The client secret must remain private.

### Set server-side environment variables

In the Vercel project, open **Settings → Environment Variables** and configure these for **Production**:

| Variable | What it is |
| --- | --- |
| `OAUTH_CALLBACK_URL` | `https://www.pcssiirobotics.org/api/oauth` |
| `OAUTH_ALLOWED_EMAILS` | Comma-separated list of staff/editor email addresses |
| `ADMIN_SESSION_SECRET` | A randomly generated secret with at least 32 characters |
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret |

If the school enables only one provider, only that provider’s client ID and secret are needed. Do not put secrets in variables beginning with `VITE_`; those are exposed to the browser. Do not commit credentials or paste them into this guide, source code, email, or an issue.

After changing any environment variable, redeploy the site. The sign-in page only displays providers that have both credentials configured and whose shared OAuth settings are valid.

## Publishing setup

OAuth credentials let an editor sign in. A separate GitHub token lets the website publish page content. Both are required for production editing.

In Vercel, configure:

| Variable | What it is |
| --- | --- |
| `GITHUB_CONTENT_REPO` | `aartisr/pcss-robotics` |
| `GITHUB_CONTENT_BRANCH` | `main` (this is the default if unset) |
| `GITHUB_CONTENT_TOKEN` | A fine-grained GitHub token with **Contents: Read and write** permission for this repository |

Keep this publishing token server-side and separate from the OAuth client secrets. If the editor reports that publishing is unavailable, check these three settings and redeploy. The editor displays a warning when required publishing settings are missing.

## If something goes wrong

| What you see | What to check |
| --- | --- |
| No sign-in button, or “OAuth sign-in is not configured” | Confirm the callback URL, allowed email list, session secret, and both credentials for the selected provider are set in Vercel. Redeploy after changes. |
| “This account is not authorized” | Sign in with the intended account. Confirm its verified email is listed in `OAUTH_ALLOWED_EMAILS`; for GitHub, verify that email in the GitHub account. |
| Provider reports a redirect/callback URL error | The URL registered with the provider and `OAUTH_CALLBACK_URL` must match exactly, including `/api/oauth`. Production must use HTTPS. |
| Sign-in returns to the editor with a generic failure | Check the provider’s client ID and secret, its callback URL, and the provider’s application/consent settings. Do not share secrets when requesting help. |
| Sign-in works but Publish fails or shows a warning | Check `GITHUB_CONTENT_REPO`, `GITHUB_CONTENT_BRANCH`, and `GITHUB_CONTENT_TOKEN`, including the token’s repository and Contents permissions. |
| A published page is not showing the intended change | Confirm the Publish success message and review the latest page-template commit on the configured GitHub branch. |

If the problem continues, contact the person who manages the Vercel project or the `aartisr/pcss-robotics` repository. Share the error message and approximate time, but never send OAuth secrets, session secrets, or the GitHub publishing token.

## Privacy and security notes

- The site’s pages are public; OAuth protects the ability to edit and publish them.
- Only the configured provider and verified email are used to decide editor access. The app does not create student accounts or provide different editor roles.
- The app does not store provider access tokens. Its signed, HTTP-only session cookie expires after eight hours. Sign out to end the browser session sooner.
- OAuth client secrets, the session secret, and the GitHub publishing token are server-only settings. Keep them out of source control and browser-visible configuration.

## Maintainer reference

The user-facing editor is in [`src/editor/Admin.tsx`](../src/editor/Admin.tsx). OAuth start, callback, email checks, and editor sessions are handled in [`server/oauth.ts`](../server/oauth.ts), with the deployed route in [`api/oauth.ts`](../api/oauth.ts). Page reads and protected publishing are handled in [`server/editorApi.ts`](../server/editorApi.ts). Automated OAuth coverage is in [`src/editor/oauth.test.ts`](../src/editor/oauth.test.ts).

For local development, the callback may be `http://localhost:3000/api/oauth` in `.env.local`; do not use that HTTP callback in production. Example variable names are listed in [`.env.example`](../.env.example). Local publishing writes to `templates/*.json`; production publishing commits to the configured GitHub branch.
