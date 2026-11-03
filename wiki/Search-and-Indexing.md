# Search and indexing

The canonical site is [www.pcssiirobotics.org](https://www.pcssiirobotics.org/). Page titles, descriptions, structured data, `robots.txt`, and `sitemap.xml` are generated for that domain. The GitHub Pages companion guide is marked `noindex` so it does not compete with the primary site.

The site identifies [Aarti S Ravikumar](https://ai-aarti.com/) as its author and Pioneer Charter School of Science II (PCSS II) as its school.

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
