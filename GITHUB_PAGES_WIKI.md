# GitHub Pages and wiki

## GitHub Pages

The static guide in `docs/` is published by `.github/workflows/pages.yml`. It links readers to the primary site at `https://www.pcssiirobotics.org/` and has its own canonical GitHub Pages URL and sitemap. The workflow uploads only `docs/`.

1. Push these files to `main` after reviewing the repository changes.
2. In repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
3. Run **Actions → Publish GitHub Pages → Run workflow** once, or change a file in `docs/` on `main` to trigger it.
4. Check the deployment URL shown by the workflow. Do not point `pcssiirobotics.org` at GitHub Pages; Vercel remains the primary host.

GitHub Pages from a private repository requires a plan that supports it. Its published pages are public even when the repository is private, so keep sensitive content out of `docs/`.

## Wiki

The Markdown pages in `wiki/` are the maintained source for the GitHub wiki. GitHub stores its wiki as a separate Git repository, so committing `wiki/` to the main repository alone does not publish the wiki.

1. In repository **Settings → General → Features**, enable **Wikis**.
2. Open the **Wiki** tab and create the first **Home** page. This initializes the wiki repository.
3. Authenticate GitHub access and run `bash scripts/publish-wiki.sh` from the project. The script copies the local wiki pages, commits changed pages, and pushes them to the repository's wiki. It leaves unrelated wiki pages intact.

The script derives the wiki address from `origin`; no private repository URL or credentials are stored in the project. GitHub wiki availability for private repositories also depends on the account plan.
