import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const required = [
  'index.html',
  'research/index.html',
  'team/index.html',
  'outreach/index.html',
  'arcade/index.html',
  'sponsors/index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  '764b7768543ae5888b09743f7aeb1c40.txt',
];
const forbidden = /github\.com\/(?!(?:sponsors\/|aartisr\/pcss-robotics(?:[/?#"'\s<>]|$)))[^/\s"'<>]+\/[^/\s"'<>]+|artifactory|jfrog|npm\.pkg\.github/i;
const textExtensions = /\.(?:html|js|css|json|txt|xml)$/;
const siteUrl = 'https://www.pcssiirobotics.org';
const author = { name: 'Aarti S Ravikumar', url: 'https://ai-aarti.com/' };
const school = { name: 'Pioneer Charter School of Science II', url: 'https://saugus.pioneercss.org/' };

for (const file of required) {
  if (!existsSync(new URL(file, dist))) {
    throw new Error(`Missing Vercel output: ${file}`);
  }
}

for (const file of required.filter((item) => item.endsWith('index.html'))) {
  const html = readFileSync(new URL(file, dist), 'utf8');
  const path = file === 'index.html' ? '/' : `/${file.slice(0, -'index.html'.length)}`;
  const canonical = `${siteUrl}${path}`;
  const schema = html.match(/<script id="site-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const body = html.split('</head>')[1] ?? '';
  if (file === 'index.html' && !html.includes('<link rel="preload" as="image" href="/images/robotics-lab-hero.webp"')) {
    throw new Error('The home hero must be discoverable before JavaScript runs.');
  }
  if (!body.includes('<div id="root"></div><noscript><main') || !body.includes('</main></noscript>')) {
    throw new Error(`Visible discovery content would flash before React mounts in ${file}`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}"`) ||
      !html.includes(`<meta name="author" content="${author.name}"`) ||
      !html.includes(`<link rel="author" href="${author.url}"`) ||
      !body.includes(`href="${author.url}"`) ||
      !body.includes(`href="${school.url}"`) || !schema) {
    throw new Error(`Missing canonical or linked author/school attribution in ${file}`);
  }
  const graph = JSON.parse(schema[1])['@graph'];
  const person = graph.find((item) => item['@type'] === 'Person');
  const organization = graph.find((item) => item['@type'] === 'EducationalOrganization');
  const club = graph.find((item) => item['@id'] === `${siteUrl}/#organization`);
  const page = graph.find((item) => item['@type'] === 'WebPage');
  if (person?.name !== author.name || person?.url !== author.url ||
      organization?.name !== school.name || organization?.url !== school.url ||
      club?.parentOrganization?.['@id'] !== organization['@id'] ||
      page?.url !== canonical || page?.author?.['@id'] !== person['@id'] ||
      page?.publisher?.['@id'] !== club['@id'] || page?.about?.['@id'] !== organization['@id']) {
    throw new Error(`Inconsistent author, school, or publisher structured data in ${file}`);
  }
}

function inspectDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      inspectDirectory(path);
    } else if (textExtensions.test(entry.name) && forbidden.test(readFileSync(path, 'utf8'))) {
      throw new Error(`Unapproved repository or registry reference in deployment output: ${path}`);
    }
  }
}

inspectDirectory(fileURLToPath(dist));

const lock = JSON.parse(readFileSync(new URL('package-lock.json', root), 'utf8'));
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const vercel = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));
if (vercel.framework !== 'vite' || vercel.outputDirectory !== 'dist' || !vercel.installCommand.includes('registry.npmjs.org')) {
  throw new Error('Vercel must build the Vite site using the public npm registry.');
}
const directSource = /(?:git\+|git@|ssh:\/\/|https?:\/\/|file:|link:)/i;
for (const [name, spec] of Object.entries({
  ...manifest.dependencies,
  ...manifest.devDependencies,
  ...manifest.optionalDependencies
})) {
  if (directSource.test(spec)) {
    throw new Error(`Direct dependency source is not allowed in package.json: ${name}`);
  }
}
for (const [name, pkg] of Object.entries(lock.packages)) {
  if (pkg.resolved && new URL(pkg.resolved).hostname !== 'registry.npmjs.org') {
    throw new Error(`Nonpublic package URL in lockfile: ${name}`);
  }
  if (typeof pkg.version === 'string' && directSource.test(pkg.version)) {
    throw new Error(`Direct package source in lockfile: ${name}`);
  }
  for (const [dependency, spec] of Object.entries({
    ...pkg.dependencies,
    ...pkg.optionalDependencies,
    ...pkg.peerDependencies
  })) {
    if (directSource.test(spec)) {
      throw new Error(`Direct dependency source in lockfile: ${name} -> ${dependency}`);
    }
  }
  for (const [nativePackage, expectedVersion] of Object.entries(pkg.optionalDependencies ?? {})) {
    if (!/(?:linux-x64-gnu|linux-x64)$/.test(nativePackage)) continue;
    const available = Object.entries(lock.packages).some(([path, entry]) =>
      (path === `node_modules/${nativePackage}` || path.endsWith(`/node_modules/${nativePackage}`))
        && entry.version === expectedVersion
    );
    if (!available) {
      throw new Error(`Missing Linux native dependency in lockfile: ${nativePackage}@${expectedVersion}`);
    }
  }
}

console.log('Vercel output and public npm lockfile verified.');
