import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { NavSection } from '../src/types';
import {
  AUTHOR,
  INDEXABLE_SECTIONS,
  SCHOOL,
  SECTION_METADATA,
  SHARE_IMAGE,
  SITE_URL,
  structuredDataFor
} from '../src/seo/siteMetadata';

const distDir = join(process.cwd(), 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const headPattern = /<!-- DISCOVERY_HEAD_START -->[\s\S]*?<!-- DISCOVERY_HEAD_END -->/;
if (!headPattern.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error('Discovery page markers were not found in the Vite output.');
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character] ?? character));

function pageHead(section: NavSection) {
  const page = SECTION_METADATA[section];
  const url = `${SITE_URL}${page.path}`;
  const schema = JSON.stringify(structuredDataFor(section)).replace(/</g, '\\u003c');
  return `<!-- DISCOVERY_HEAD_START -->
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="author" content="${escapeHtml(AUTHOR.name)}" />
    <meta name="robots" content="${page.indexable === false ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />
    <link rel="canonical" href="${url}" />
    <link rel="author" href="${AUTHOR.url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="PCSS II Robotics" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta property="og:image:alt" content="PCSS II Robotics student engineering" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${SHARE_IMAGE}" />
    <script id="site-jsonld" type="application/ld+json">${schema}</script>
    <!-- DISCOVERY_HEAD_END -->`;
}

function pageBody(section: NavSection) {
  const page = SECTION_METADATA[section];
  const links = INDEXABLE_SECTIONS.map((item) => {
    const entry = SECTION_METADATA[item];
    return `<a href="${entry.path}">${escapeHtml(entry.heading)}</a>`;
  }).join(' · ');
  const highlights = page.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<main id="content" style="max-width:74rem;margin:2rem auto;padding:1.5rem;color:#f1f5f9;font:1rem/1.65 system-ui,sans-serif">
    <p><a href="/" style="color:#7dd3fc">PCSS II Robotics</a> · <a href="${SCHOOL.url}" style="color:#7dd3fc">${escapeHtml(SCHOOL.name)} (${escapeHtml(SCHOOL.shortName)})</a></p>
    <h1 style="font-size:2rem;line-height:1.2">${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.summary)}</p>
    <ul>${highlights}</ul>
    <nav aria-label="Explore PCSS II Robotics">${links}</nav>
    <footer style="border-top:1px solid #1d3e70;margin-top:2rem;padding-top:1rem;color:#94a3b8;font-size:.75rem">Site by <a href="${AUTHOR.url}" rel="author" style="color:#cbd5e1">${escapeHtml(AUTHOR.name)}</a></footer>
  </main>`;
}

for (const section of Object.keys(SECTION_METADATA) as NavSection[]) {
  const page = SECTION_METADATA[section];
  // React mounts into #root on every visit. Visible HTML inside that element is
  // replaced at startup, which flashes an incomplete discovery page first.
  // Keep the static discovery copy available only to visitors without JS.
  const output = template
    .replace(headPattern, pageHead(section))
    .replace('</head>', `${section === 'home' ? '    <link rel="preload" as="image" href="/images/robotics-lab-hero.webp" fetchpriority="high" />\n  ' : ''}</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${pageBody(section)}</noscript>`);
  const directory = join(distDir, page.path);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'index.html'), output);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${INDEXABLE_SECTIONS.map((section) => `  <url><loc>${SITE_URL}${SECTION_METADATA[section].path}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
console.log(`Generated ${Object.keys(SECTION_METADATA).length} discovery pages and sitemap.xml`);
