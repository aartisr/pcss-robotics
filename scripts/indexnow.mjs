#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicDir = join(root, 'public');
const endpoint = 'https://api.indexnow.org/indexnow';
const keyPattern = /^[A-Za-z0-9-]{8,128}$/;

function usage() {
  console.log(`Usage: npm run indexnow -- [--dry-run] [--sitemap PATH] [--key KEY] [--key-file PATH] [--key-location URL] [--batch-size N] [--skip-key-verification]
       npm run indexnow -- --init-key

Reads page URLs from public/sitemap.xml by default and submits them to IndexNow.
The key file must be deployed at https://<site-host>/<key>.txt first.

Options:
  --init-key       Generate a key file in public/ (does not submit)
  --dry-run        List URLs and batches without network requests
  --sitemap PATH   Use a different local XML sitemap
  --key KEY        Use this key instead of auto-detecting a key file
  --key-file PATH  Read the key from a local file outside public/
  --key-location URL  Live HTTPS URL of the key file (for a subpath site)
  --skip-key-verification  Skip the local live-key fetch when a network proxy blocks it
  --batch-size N   URLs per POST, 1-10000 (default: 1000)
  --help           Show this help`);
}

function optionsFrom(argv) {
  const options = { sitemap: join(publicDir, 'sitemap.xml'), batchSize: 1000 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--skip-key-verification') options.skipKeyVerification = true;
    else if (arg === '--init-key') options.initKey = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--sitemap' || arg === '--key' || arg === '--key-file' || arg === '--key-location' || arg === '--batch-size') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      if (arg === '--sitemap') options.sitemap = resolve(value);
      if (arg === '--key') options.key = value;
      if (arg === '--key-file') options.keyFile = resolve(value);
      if (arg === '--key-location') options.keyLocation = value;
      if (arg === '--batch-size') options.batchSize = Number(value);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (!Number.isInteger(options.batchSize) || options.batchSize < 1 || options.batchSize > 10000) {
    throw new Error('--batch-size must be an integer from 1 to 10000');
  }
  return options;
}

function decodeXmlText(text) {
  return text.replace(/&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, (entity, code) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    const lower = code.toLowerCase();
    if (named[lower]) return named[lower];
    const number = lower.startsWith('#x') ? parseInt(lower.slice(2), 16) : Number(lower.slice(1));
    return Number.isInteger(number) && number >= 0 && number <= 0x10ffff
      ? String.fromCodePoint(number)
      : entity;
  });
}

function urlsFromSitemap(path) {
  if (!existsSync(path)) throw new Error(`Sitemap not found: ${path}`);
  const xml = readFileSync(path, 'utf8');
  if (/<sitemapindex\b/i.test(xml)) {
    throw new Error('Sitemap indexes are not supported; pass a page sitemap with --sitemap.');
  }
  const urls = [...xml.matchAll(/<url>\s*<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXmlText(match[1].trim()));
  if (urls.length === 0) throw new Error(`No <url><loc> entries found in ${path}`);

  const first = new URL(urls[0]);
  if (first.protocol !== 'https:') throw new Error('Sitemap page URLs must use HTTPS.');
  const host = first.host;
  const unique = new Set();
  for (const raw of urls) {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.host !== host || url.username || url.password || url.hash) {
      throw new Error(`Invalid or off-host sitemap URL: ${raw}`);
    }
    unique.add(url.href);
  }
  return { host, origin: first.origin, urls: [...unique] };
}

function keysInPublic() {
  return readdirSync(publicDir)
    .filter((file) => file.endsWith('.txt') && keyPattern.test(file.slice(0, -4)))
    .map((file) => file.slice(0, -4))
    .filter((key) => readFileSync(join(publicDir, `${key}.txt`), 'utf8').trim() === key);
}

function initKey() {
  const existing = keysInPublic();
  if (existing.length) {
    console.log(`IndexNow key file already exists: public/${existing[0]}.txt`);
    return;
  }
  const key = randomBytes(16).toString('hex');
  writeFileSync(join(publicDir, `${key}.txt`), key, { flag: 'wx', mode: 0o644 });
  console.log(`Created public/${key}.txt. Deploy it before submitting URLs.`);
}

function resolveKey(options) {
  if (options.keyFile) {
    const key = basename(options.keyFile, '.txt');
    if (!keyPattern.test(key) || !options.keyFile.endsWith('.txt') || !existsSync(options.keyFile)) {
      throw new Error('--key-file must point to an existing <key>.txt file.');
    }
    if (readFileSync(options.keyFile, 'utf8').trim() !== key || (options.key && options.key !== key)) {
      throw new Error('--key-file must contain exactly the key in its filename.');
    }
    return key;
  }
  const keys = keysInPublic();
  const key = options.key ?? process.env.INDEXNOW_KEY ?? (keys.length === 1 ? keys[0] : undefined);
  if (!key || !keyPattern.test(key)) {
    throw new Error('No unambiguous valid key found. Run --init-key or pass --key KEY.');
  }
  if (!keys.includes(key)) throw new Error(`public/${key}.txt must exist and contain exactly the key.`);
  return key;
}

async function verifiedKeyLocation(origin, key, explicit, urls, skipVerification) {
  const location = explicit ?? `${origin}/${key}.txt`;
  const url = new URL(location);
  if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password || url.search || url.hash || !url.pathname.endsWith(`/${key}.txt`)) {
    throw new Error('--key-location must be an HTTPS URL for the key file on the submitted host.');
  }
  const scope = new URL('.', url).href;
  if (urls.some((page) => !page.startsWith(scope))) {
    throw new Error(`All submitted URLs must be within the key file scope: ${scope}`);
  }
  if (skipVerification) {
    console.warn(`Skipping local key fetch for ${location}; IndexNow will validate the key.`);
    return location;
  }
  const response = await fetch(location, { signal: AbortSignal.timeout(10000), redirect: 'follow' });
  if (!response.ok || response.url !== location || (await response.text()).trim() !== key) {
    throw new Error(`IndexNow key is not publicly available at ${location}. Deploy the key file first.`);
  }
  return location;
}

async function postBatch(host, key, keyLocation, urls, batchNumber) {
  const body = JSON.stringify({ host, key, keyLocation, urlList: urls });
  for (let attempt = 1; attempt <= 3; attempt++) {
    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body,
        signal: AbortSignal.timeout(20000)
      });
    } catch (error) {
      if (attempt === 3) throw new Error(`Batch ${batchNumber} failed after 3 attempts: ${error.message}`);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 2000));
      continue;
    }
    if (response.status === 200 || response.status === 202) {
      console.log(`Batch ${batchNumber}: ${urls.length} URLs accepted (HTTP ${response.status}).`);
      return;
    }
    const details = (await response.text()).slice(0, 300);
    if (attempt === 3 || (response.status !== 429 && response.status < 500)) {
      throw new Error(`Batch ${batchNumber} failed (HTTP ${response.status}): ${details}`);
    }
    const retryAfter = Number(response.headers.get('retry-after'));
    const delayMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 30000)
      : attempt * 2000;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
  }
}

async function main() {
  const options = optionsFrom(process.argv.slice(2));
  if (options.help) return usage();
  if (options.initKey) return initKey();

  const { host, origin, urls } = urlsFromSitemap(options.sitemap);
  const batches = [];
  for (let i = 0; i < urls.length; i += options.batchSize) {
    batches.push(urls.slice(i, i + options.batchSize));
  }
  console.log(`Found ${urls.length} unique URLs for ${host} in ${batches.length} batch(es).`);
  if (options.dryRun) {
    for (const url of urls) console.log(url);
    return;
  }

  const key = resolveKey(options);
  const keyLocation = await verifiedKeyLocation(origin, key, options.keyLocation, urls, options.skipKeyVerification);
  for (let i = 0; i < batches.length; i++) {
    await postBatch(host, key, keyLocation, batches[i], i + 1);
  }
  console.log('IndexNow received all URLs. Acceptance does not guarantee indexing.');
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
