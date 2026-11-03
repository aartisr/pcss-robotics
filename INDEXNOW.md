# IndexNow submission

The `indexnow` script reads every canonical page URL from `public/sitemap.xml` and submits it to `https://api.indexnow.org/indexnow` in batches. The sitemap currently contains eight pages on `www.pcssiirobotics.org`.

1. Deploy the site, including the generated `public/<key>.txt` file. The script has already created a key file in `public/`; `npm run indexnow -- --init-key` will reuse it. The file must be reachable at `https://www.pcssiirobotics.org/<key>.txt` and display exactly the key.
2. Preview the URLs without network requests:

   ```sh
   npm run indexnow -- --dry-run
   ```

3. Submit after the pages and key file are live:

   ```sh
   npm run indexnow
   ```

The script rejects off-host sitemap URLs, deduplicates entries, verifies the deployed key file, and accepts IndexNow's HTTP 200 or 202 response. It retries temporary 429 and server errors. Use `--sitemap PATH`, `--key KEY`, or `--batch-size N` when needed; run `npm run indexnow -- --help` for the full CLI. IndexNow requests notification and does not guarantee indexing. Submit after publishing or changing pages rather than repeatedly submitting unchanged URLs.

Protocol reference: https://www.indexnow.org/documentation

## GitHub Pages guide

The companion guide has a separate host and key file. After the GitHub Pages workflow publishes `docs/`, submit its URL with:

```sh
npm run indexnow -- \
  --sitemap docs/sitemap.xml \
  --key-file docs/d141232f237190f38691eb991d368c7f.txt \
  --key-location https://aartisr.github.io/pcss-robotics/d141232f237190f38691eb991d368c7f.txt
```

The key file's `/pcss-robotics/` location authorizes URLs only under that path. Submit the primary site and GitHub Pages guide separately because IndexNow batches contain URLs from one host.
