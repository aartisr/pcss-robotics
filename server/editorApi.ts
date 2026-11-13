import { config as loadDotenv } from 'dotenv';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// Local development mirrors Vite's env-file precedence without exposing secrets
// to the browser. Hosting-provided environment variables always take priority.
loadDotenv({ path: '.env.local', quiet: true });
loadDotenv({ path: '.env', quiet: true });

const ids = new Set(['home', 'robots', 'research', 'simulator', 'team', 'outreach', 'arcade', 'sponsors']);
const blocks = new Set(['Hero', 'SectionIntro', 'Paragraph', 'InsetNote', 'EngineeringTopic', 'CardGrid', 'Callout', 'Image', 'Columns', 'Feature', 'TeamRoster']);
const cookieName = 'pcss_editor_session';
const sessionSeconds = 60 * 60 * 8;

function config() {
  return { password: process.env.ADMIN_PASSWORD ?? '', secret: process.env.ADMIN_SESSION_SECRET ?? '', token: process.env.GITHUB_CONTENT_TOKEN ?? '', repo: process.env.GITHUB_CONTENT_REPO ?? '', branch: process.env.GITHUB_CONTENT_BRANCH ?? 'main' };
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signedSession(secret: string, expires: number) {
  const value = String(expires);
  return `${value}.${createHmac('sha256', secret).update(value).digest('hex')}`;
}

function authenticated(req: IncomingMessage) {
  const { password, secret } = config();
  if (!password || !secret) return false;
  const raw = req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!raw) return false;
  const [expires, signature] = raw.split('.');
  if (!expires || !signature || !Number.isSafeInteger(Number(expires)) || Number(expires) < Date.now()) return false;
  return safeEqual(raw, signedSession(secret, Number(expires)));
}

function send(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(value));
}

async function body(req: IncomingMessage) {
  const parsed = (req as IncomingMessage & { body?: unknown }).body;
  if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
  let text = '';
  for await (const chunk of req) {
    text += chunk.toString();
    if (text.length > 1024 * 1024) throw new Error('Page is too large.');
  }
  return JSON.parse(text || '{}') as Record<string, unknown>;
}

function validData(data: unknown): data is { root: object; content: unknown[] } {
  if (!data || typeof data !== 'object') return false;
  const page = data as Record<string, unknown>;
  if (!page.root || typeof page.root !== 'object' || !Array.isArray(page.content) || page.content.length > 200) return false;
  const validBlock = (item: unknown, depth: number): boolean => {
    if (depth > 8 || !item || typeof item !== 'object') return false;
    const node = item as Record<string, unknown>;
    if (!blocks.has(String(node.type)) || !node.props || typeof node.props !== 'object') return false;
    return Object.values(node.props).every(value => !Array.isArray(value) || value.length <= 200 && value.every(entry => !entry || typeof entry !== 'object' || !('type' in entry) || validBlock(entry, depth + 1)));
  };
  return page.content.every(item => validBlock(item, 0));
}

async function githubPage(id: string) {
  const { token, repo, branch } = config();
  const endpoint = `https://api.github.com/repos/${repo}/contents/templates/${id}.json?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`GitHub read failed (${response.status}).`);
  const file = await response.json() as { content: string; sha: string };
  return { data: JSON.parse(Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8')), sha: file.sha, endpoint };
}

async function load(id: string) {
  const { token, repo } = config();
  if (token && repo) return (await githubPage(id)).data;
  return JSON.parse(await readFile(path.join(process.cwd(), 'templates', `${id}.json`), 'utf8'));
}

async function save(id: string, data: unknown) {
  const { token, repo, branch } = config();
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    if (!token || !repo) throw new Error('Publishing requires GITHUB_CONTENT_TOKEN and GITHUB_CONTENT_REPO in the deployment configuration.');
    const current = await githubPage(id);
    const response = await fetch(current.endpoint.split('?')[0], { method: 'PUT', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Update ${id} page from Puck editor`, content: Buffer.from(`${JSON.stringify(data, null, 2)}\n`).toString('base64'), sha: current.sha, branch }) });
    if (!response.ok) throw new Error(`GitHub publish failed (${response.status}).`);
    return;
  }
  await writeFile(path.join(process.cwd(), 'templates', `${id}.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function editorApi(req: IncomingMessage, res: ServerResponse) {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const page = url.searchParams.get('page') ?? '';
    if (req.method === 'GET' && url.searchParams.get('session') === '1') return send(res, 200, { authenticated: authenticated(req), configured: Boolean(config().password && config().secret) });
    if (req.method === 'GET' && ids.has(page)) return send(res, 200, await load(page));
    if (req.method !== 'POST') return send(res, 404, { error: 'Not found.' });

    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'Invalid request origin.' });
    const input = await body(req);
    if (input.action === 'login') {
      const { password, secret } = config();
      if (!password || !secret) return send(res, 503, { error: 'Editor password is not configured.' });
      if (!safeEqual(String(input.password ?? ''), password)) return send(res, 401, { error: 'Incorrect password.' });
      const value = signedSession(secret, Date.now() + sessionSeconds * 1000);
      res.setHeader('Set-Cookie', `${cookieName}=${value}; HttpOnly; ${process.env.NODE_ENV === 'production' || process.env.VERCEL ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=${sessionSeconds}`);
      return send(res, 200, { authenticated: true });
    }
    if (input.action === 'logout') {
      res.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
      return send(res, 200, { authenticated: false });
    }
    if (!authenticated(req)) return send(res, 401, { error: 'Sign in to publish.' });
    if (input.action !== 'save' || !ids.has(page) || !validData(input.data)) return send(res, 400, { error: 'Invalid page data.' });
    await save(page, input.data);
    return send(res, 200, { saved: true });
  } catch (error) {
    console.error('Editor API error:', error);
    return send(res, 500, { error: error instanceof Error ? error.message : 'Editor request failed.' });
  }
}
