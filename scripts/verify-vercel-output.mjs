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

for (const file of required) {
  if (!existsSync(new URL(file, dist))) {
    throw new Error(`Missing Vercel output: ${file}`);
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
const vercel = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));
if (vercel.framework !== 'vite' || vercel.outputDirectory !== 'dist' || !vercel.installCommand.includes('registry.npmjs.org')) {
  throw new Error('Vercel must build the Vite site using the public npm registry.');
}
for (const [name, pkg] of Object.entries(lock.packages)) {
  if (pkg.resolved && new URL(pkg.resolved).hostname !== 'registry.npmjs.org') {
    throw new Error(`Nonpublic package URL in lockfile: ${name}`);
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
