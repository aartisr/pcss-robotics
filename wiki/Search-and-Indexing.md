# Search and indexing

The primary site is [www.pcssiirobotics.org](https://www.pcssiirobotics.org/). Page titles, descriptions, structured data, `robots.txt`, and `sitemap.xml` are generated for that domain. The distinct GitHub Pages companion guide has its own canonical URL, sitemap, and IndexNow key file under `/pcss-robotics/`.

Every generated page links [Aarti S Ravikumar](https://ai-aarti.com/) as site author and [Pioneer Charter School of Science II (PCSS II)](https://saugus.pioneercss.org/) as the school. Shared structured data connects the club publisher to the school. The production build verifies these links and relationships on every page.

Search engines can read a page-specific title, summary, canonical URL, and internal navigation directly from the generated HTML, before JavaScript runs. `llms.txt` and `llms-full.txt` offer optional plain-text guides; they are not required for Google Search or its AI features. Helpful, accurate page content and crawlable HTML remain the priority.

## IndexNow

After a deployment updates canonical pages, preview the submission:

```sh
npm run indexnow -- --dry-run
```

Then submit the URLs in `public/sitemap.xml`:

```sh
npm run indexnow
```

The IndexNow key file must be live on the canonical domain before submission. See `INDEXNOW.md` in the project for the full setup and options. IndexNow notifies participating search engines but does not guarantee indexing.

The GitHub Pages guide is submitted separately using `docs/sitemap.xml` and its key file under `/pcss-robotics/`. The project `INDEXNOW.md` includes the exact command.
