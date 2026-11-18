import { config as loadDotenv } from 'dotenv';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

loadDotenv({ path: '.env.local', quiet: true });
loadDotenv({ path: '.env', quiet: true });

const sessionCookie = 'pcss_editor_session';
const stateCookie = 'pcss_oauth_state';
const sessionSeconds = 60 * 60 * 8;
const stateSeconds = 60 * 10;

type Provider = 'github' | 'google';
type OAuthConfig = {
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
};

function providerConfig(provider: Provider): OAuthConfig {
  if (provider === 'github') {
    return {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    };
  }
  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };
}

function allowedEmails() {
  return (process.env.OAUTH_ALLOWED_EMAILS ?? '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
}

function callbackUrl() {
  const configured = process.env.OAUTH_CALLBACK_URL ?? '';
  if (!configured) return '';
  try {
    const url = new URL(configured);
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(localHttp && !process.env.VERCEL && process.env.NODE_ENV !== 'production')) return '';
    if (url.pathname !== '/api/oauth' || url.username || url.password || url.search || url.hash) return '';
    return url.toString();
  } catch {
    return '';
  }
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? '';
  return secret.length >= 32 ? secret : '';
}

function availableProviders(): Provider[] {
  return (['github', 'google'] as const).filter(provider => {
    const config = providerConfig(provider);
    return Boolean(config.clientId && config.clientSecret);
  });
}

export function oauthStatus() {
  const providers = availableProviders();
  const configured = Boolean(sessionSecret() && callbackUrl() && allowedEmails().length && providers.length);
  return { configured, providers: configured ? providers : [] };
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function cookieValue(req: IncomingMessage, name: string) {
  return req.headers.cookie?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function signedPayload(payload: object, secret: string) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

function readSignedPayload<T>(value: string | undefined, secret: string): T | undefined {
  if (!value) return undefined;
  const [encoded, signature, extra] = value.split('.');
  if (!encoded || !signature || extra !== undefined || !safeEqual(signature, sign(encoded, secret))) return undefined;
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T;
  } catch {
    return undefined;
  }
}

type Session = { email: string; provider: Provider; expires: number };

export function authenticated(req: IncomingMessage) {
  const secret = sessionSecret();
  const emails = allowedEmails();
  if (!secret || !emails.length) return false;
  const session = readSignedPayload<Session>(cookieValue(req, sessionCookie), secret);
  return Boolean(
    session
    && (session.provider === 'github' || session.provider === 'google')
    && Number.isSafeInteger(session.expires)
    && session.expires > Date.now()
    && typeof session.email === 'string'
    && emails.includes(session.email.toLowerCase()),
  );
}

function secureCookie() {
  return process.env.VERCEL || process.env.NODE_ENV === 'production' ? ' Secure;' : '';
}

function setCookie(name: string, value: string, maxAge: number, sameSite: 'Lax' | 'Strict' = 'Strict') {
  return `${name}=${value}; HttpOnly;${secureCookie()} SameSite=${sameSite}; Path=/; Max-Age=${maxAge}`;
}

function clearCookie(name: string, sameSite: 'Lax' | 'Strict' = 'Strict') {
  return setCookie(name, '', 0, sameSite);
}

function redirect(res: ServerResponse, location: string, cookies?: string[]) {
  res.statusCode = 302;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Location', location);
  if (cookies?.length) res.setHeader('Set-Cookie', cookies);
  res.end();
}

function adminUrl(error?: string) {
  return error ? `/admin/?oauth_error=${encodeURIComponent(error)}` : '/admin/';
}

function json(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(value));
}

type OAuthState = { state: string; verifier: string; expires: number };

async function begin(res: ServerResponse, providerValue: string) {
  if (providerValue !== 'github' && providerValue !== 'google') return json(res, 400, { error: 'Unsupported sign-in provider.' });
  const provider: Provider = providerValue;
  const status = oauthStatus();
  if (!status.configured || !status.providers.includes(provider)) return redirect(res, adminUrl('unavailable'));

  const config = providerConfig(provider);
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const expires = Date.now() + stateSeconds * 1000;
  const secret = sessionSecret();
  const signedState = signedPayload({ provider, state, verifier, expires }, secret);
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const authorization = new URL(config.authorizationEndpoint);
  authorization.searchParams.set('client_id', config.clientId);
  authorization.searchParams.set('redirect_uri', callbackUrl());
  authorization.searchParams.set('response_type', 'code');
  authorization.searchParams.set('state', state);
  authorization.searchParams.set('code_challenge', challenge);
  authorization.searchParams.set('code_challenge_method', 'S256');
  authorization.searchParams.set('scope', provider === 'github' ? 'read:user user:email' : 'openid email profile');
  redirect(res, authorization.toString(), [setCookie(stateCookie, signedState, stateSeconds, 'Lax')]);
}

async function jsonResponse(response: Response) {
  if (!response.ok) throw new Error(`OAuth provider returned HTTP ${response.status}.`);
  return response.json() as Promise<Record<string, unknown>>;
}

async function exchangeCode(provider: Provider, code: string, verifier: string) {
  const config = providerConfig(provider);
  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: callbackUrl(),
      code_verifier: verifier,
      grant_type: 'authorization_code',
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const token = await jsonResponse(response);
  if (typeof token.access_token !== 'string' || !token.access_token) throw new Error('OAuth provider did not return an access token.');
  return token.access_token;
}

async function verifiedEmail(provider: Provider, accessToken: string) {
  if (provider === 'google') {
    const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10_000),
    });
    const user = await jsonResponse(response);
    if (typeof user.email !== 'string' || user.email_verified !== true) return '';
    return user.email.toLowerCase();
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const userResponse = await fetch('https://api.github.com/user', { headers, signal: AbortSignal.timeout(10_000) });
  const user = await jsonResponse(userResponse);
  if (typeof user.id !== 'number') throw new Error('GitHub did not return a user identity.');
  const emailsResponse = await fetch('https://api.github.com/user/emails', { headers, signal: AbortSignal.timeout(10_000) });
  const emails = await jsonResponse(emailsResponse);
  if (!Array.isArray(emails)) throw new Error('GitHub did not return verified email addresses.');
  const allowed = new Set(allowedEmails());
  const match = emails.find((item): item is { email: string; verified: true } => (
    Boolean(item)
    && typeof item === 'object'
    && typeof (item as Record<string, unknown>).email === 'string'
    && (item as Record<string, unknown>).verified === true
    && allowed.has(((item as Record<string, unknown>).email as string).toLowerCase())
  ));
  return match?.email.toLowerCase() ?? '';
}

async function finish(req: IncomingMessage, res: ServerResponse, url: URL) {
  const secret = sessionSecret();
  const stateCookieValue = cookieValue(req, stateCookie);
  const stateData = readSignedPayload<OAuthState & { provider: Provider }>(stateCookieValue, secret);
  const state = url.searchParams.get('state') ?? '';
  const clearState = clearCookie(stateCookie, 'Lax');
  if (
    !stateData
    || !state
    || !safeEqual(stateData.state, state)
    || !Number.isSafeInteger(stateData.expires)
    || stateData.expires <= Date.now()
    || (stateData.provider !== 'github' && stateData.provider !== 'google')
  ) return redirect(res, adminUrl('failed'), [clearState, clearCookie(sessionCookie)]);

  if (url.searchParams.has('error')) {
    return redirect(res, adminUrl('cancelled'), [clearState, clearCookie(sessionCookie)]);
  }
  const code = url.searchParams.get('code') ?? '';
  if (!code || code.length > 2048) return redirect(res, adminUrl('failed'), [clearState, clearCookie(sessionCookie)]);

  try {
    const accessToken = await exchangeCode(stateData.provider, code, stateData.verifier);
    const email = await verifiedEmail(stateData.provider, accessToken);
    if (!email || !allowedEmails().includes(email)) {
      return redirect(res, adminUrl('not_allowed'), [clearState, clearCookie(sessionCookie)]);
    }
    const session = signedPayload({ email, provider: stateData.provider, expires: Date.now() + sessionSeconds * 1000 } satisfies Session, secret);
    return redirect(res, adminUrl(), [clearState, setCookie(sessionCookie, session, sessionSeconds)]);
  } catch (error) {
    console.error('OAuth sign-in failed:', error);
    return redirect(res, adminUrl('failed'), [clearState, clearCookie(sessionCookie)]);
  }
}

export async function oauthApi(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const provider = url.searchParams.get('provider');
  if (provider) return begin(res, provider);
  return finish(req, res, url);
}

export function clearEditorSession(res: ServerResponse) {
  res.setHeader('Set-Cookie', clearCookie(sessionCookie));
}
