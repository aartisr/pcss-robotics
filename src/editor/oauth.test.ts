import test from 'node:test';
import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { authenticated, oauthApi, oauthStatus } from '../../server/oauth';

function request(url: string, cookie?: string) {
  return {
    method: 'GET',
    url,
    headers: { host: 'localhost', ...(cookie ? { cookie } : {}) },
  } as IncomingMessage;
}

function response() {
  const headers: Record<string, string | string[]> = {};
  return {
    headers,
    statusCode: 200,
    setHeader(name: string, value: string | string[]) { headers[name] = value; },
    end() {},
  } as unknown as ServerResponse & { headers: Record<string, string | string[]> };
}

function cookiePair(setCookie: string | string[], name: string) {
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  const cookie = cookies.find(value => value.startsWith(`${name}=`));
  assert.ok(cookie, `Expected ${name} cookie`);
  return cookie.split(';')[0];
}

const envKeys = [
  'ADMIN_SESSION_SECRET',
  'OAUTH_CALLBACK_URL',
  'OAUTH_ALLOWED_EMAILS',
  'GITHUB_OAUTH_CLIENT_ID',
  'GITHUB_OAUTH_CLIENT_SECRET',
  'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'NODE_ENV',
  'VERCEL',
];

function saveEnvironment() {
  return Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
}

function restoreEnvironment(original: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function configureGitHub() {
  process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-32-characters';
  process.env.OAUTH_CALLBACK_URL = 'http://localhost:3000/api/oauth';
  process.env.OAUTH_ALLOWED_EMAILS = 'editor@example.test';
  process.env.GITHUB_OAUTH_CLIENT_ID = 'github-client';
  process.env.GITHUB_OAUTH_CLIENT_SECRET = 'github-secret';
  delete process.env.GOOGLE_OAUTH_CLIENT_ID;
  delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  process.env.NODE_ENV = 'test';
  delete process.env.VERCEL;
}

test('production OAuth requires an HTTPS callback URL', () => {
  const originalEnv = saveEnvironment();
  try {
    configureGitHub();
    process.env.NODE_ENV = 'production';
    process.env.VERCEL = '1';
    assert.deepEqual(oauthStatus(), { configured: false, providers: [] });
  } finally {
    restoreEnvironment(originalEnv);
  }
});

test('GitHub OAuth validates state and grants sessions only to allowed verified emails', async () => {
  const originalEnv = saveEnvironment();
  const originalFetch = globalThis.fetch;
  try {
    configureGitHub();
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      if (url === 'https://github.com/login/oauth/access_token') {
        assert.match(String(init?.body), /code_verifier=/);
        return new Response(JSON.stringify({ access_token: 'provider-access-token' }), { status: 200 });
      }
      if (url === 'https://api.github.com/user') {
        return new Response(JSON.stringify({ id: 123 }), { status: 200 });
      }
      if (url === 'https://api.github.com/user/emails') {
        return new Response(JSON.stringify([
          { email: 'unverified@example.test', verified: false, primary: true },
          { email: 'editor@example.test', verified: true, primary: false },
        ]), { status: 200 });
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    };

    const startResponse = response();
    await oauthApi(request('/api/oauth?provider=github'), startResponse);
    const authorization = new URL(startResponse.headers.Location as string);
    assert.equal(authorization.hostname, 'github.com');
    assert.equal(authorization.searchParams.get('code_challenge_method'), 'S256');
    const state = authorization.searchParams.get('state');
    assert.ok(state);
    const stateCookie = cookiePair(startResponse.headers['Set-Cookie'], 'pcss_oauth_state');

    const callbackResponse = response();
    await oauthApi(request(`/api/oauth?code=auth-code&state=${state}`, stateCookie), callbackResponse);
    assert.equal(callbackResponse.headers.Location, '/admin/');
    const sessionCookie = cookiePair(callbackResponse.headers['Set-Cookie'], 'pcss_editor_session');
    assert.equal(authenticated(request('/api/editor', sessionCookie)), true);

    process.env.OAUTH_ALLOWED_EMAILS = 'someone-else@example.test';
    assert.equal(authenticated(request('/api/editor', sessionCookie)), false);

    const mismatchResponse = response();
    await oauthApi(request('/api/oauth?code=auth-code&state=wrong-state', stateCookie), mismatchResponse);
    assert.equal(mismatchResponse.headers.Location, '/admin/?oauth_error=failed');
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnvironment(originalEnv);
  }
});

test('Google OAuth rejects accounts without a verified email', async () => {
  const originalEnv = saveEnvironment();
  const originalFetch = globalThis.fetch;
  try {
    process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-32-characters';
    process.env.OAUTH_CALLBACK_URL = 'http://localhost:3000/api/oauth';
    process.env.OAUTH_ALLOWED_EMAILS = 'editor@example.test';
    process.env.GOOGLE_OAUTH_CLIENT_ID = 'google-client';
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'google-secret';
    delete process.env.GITHUB_OAUTH_CLIENT_ID;
    delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
    process.env.NODE_ENV = 'test';
    delete process.env.VERCEL;

    globalThis.fetch = async input => {
      const url = String(input);
      if (url === 'https://oauth2.googleapis.com/token') {
        return new Response(JSON.stringify({ access_token: 'provider-access-token' }), { status: 200 });
      }
      if (url === 'https://openidconnect.googleapis.com/v1/userinfo') {
        return new Response(JSON.stringify({ email: 'editor@example.test', email_verified: false }), { status: 200 });
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    };

    const startResponse = response();
    await oauthApi(request('/api/oauth?provider=google'), startResponse);
    const authorization = new URL(startResponse.headers.Location as string);
    const state = authorization.searchParams.get('state');
    assert.ok(state);
    const stateCookie = cookiePair(startResponse.headers['Set-Cookie'], 'pcss_oauth_state');

    const callbackResponse = response();
    await oauthApi(request(`/api/oauth?code=auth-code&state=${state}`, stateCookie), callbackResponse);
    assert.equal(callbackResponse.headers.Location, '/admin/?oauth_error=not_allowed');
    const cookies = callbackResponse.headers['Set-Cookie'] as string[];
    assert.ok(cookies.some(cookie => cookie.startsWith('pcss_editor_session=;')));
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnvironment(originalEnv);
  }
});
