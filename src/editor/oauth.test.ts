import test from 'node:test';
import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { editorApi } from '../../server/editorApi';
import { authenticated, oauthApi, oauthStatus } from '../../server/oauth';

type Provider = 'github' | 'google';
type OAuthResponse = ServerResponse & {
  headers: Record<string, string | string[]>;
  body: string;
};

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

function configureOAuth(provider?: Provider) {
  for (const key of envKeys) delete process.env[key];
  process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-32-characters';
  process.env.OAUTH_CALLBACK_URL = 'https://example.test/api/oauth';
  process.env.OAUTH_ALLOWED_EMAILS = 'editor@example.test';
  process.env.NODE_ENV = 'test';

  if (provider === 'github') {
    process.env.GITHUB_OAUTH_CLIENT_ID = 'github-client';
    process.env.GITHUB_OAUTH_CLIENT_SECRET = 'github-secret';
  } else if (provider === 'google') {
    process.env.GOOGLE_OAUTH_CLIENT_ID = 'google-client';
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'google-secret';
  } else if (provider === undefined) {
    process.env.GITHUB_OAUTH_CLIENT_ID = 'github-client';
    process.env.GITHUB_OAUTH_CLIENT_SECRET = 'github-secret';
    process.env.GOOGLE_OAUTH_CLIENT_ID = 'google-client';
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'google-secret';
  }
}

function makeRequest(
  url: string,
  options: { cookie?: string; method?: string; body?: unknown } = {},
) {
  return {
    method: options.method ?? 'GET',
    url,
    headers: { host: 'localhost', ...(options.cookie ? { cookie: options.cookie } : {}) },
    ...(options.body === undefined ? {} : { body: options.body }),
  } as IncomingMessage;
}

function makeResponse(): OAuthResponse {
  const headers: Record<string, string | string[]> = {};
  let body = '';
  return {
    headers,
    get body() { return body; },
    statusCode: 200,
    setHeader(name: string, value: string | string[]) { headers[name] = value; },
    end(value?: string) { body = value ?? ''; },
  } as unknown as OAuthResponse;
}

function setCookies(response: OAuthResponse) {
  const value = response.headers['Set-Cookie'];
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

function cookiePair(response: OAuthResponse, name: string) {
  const cookie = setCookies(response).find(value => value.startsWith(`${name}=`));
  assert.ok(cookie, `Expected ${name} cookie`);
  return cookie.split(';', 1)[0];
}

function clearCookieWasSet(response: OAuthResponse, name: string) {
  return setCookies(response).some(cookie => cookie.startsWith(`${name}=;`) && /Max-Age=0/.test(cookie));
}

async function beginSignIn(provider: Provider) {
  const response = makeResponse();
  await oauthApi(makeRequest(`/api/oauth?provider=${provider}`), response);
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers['Cache-Control'], 'no-store');
  const authorizationUrl = new URL(response.headers.Location as string);
  return {
    response,
    authorizationUrl,
    state: authorizationUrl.searchParams.get('state') ?? '',
    stateCookie: cookiePair(response, 'pcss_oauth_state'),
  };
}

async function finishSignIn(
  state: string,
  stateCookie: string,
  options: { code?: string; error?: string; cookie?: string } = {},
) {
  const callback = new URL('/api/oauth', 'https://example.test');
  if (options.code !== undefined) callback.searchParams.set('code', options.code);
  if (options.error !== undefined) callback.searchParams.set('error', options.error);
  if (state) callback.searchParams.set('state', state);
  const response = makeResponse();
  await oauthApi(makeRequest(callback.pathname + callback.search, {
    cookie: options.cookie ?? stateCookie,
  }), response);
  return response;
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  globalThis.fetch = async (input, init) => handler(String(input), init);
}

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status });
}

async function withEnvironment(
  provider: Provider | undefined,
  run: () => void | Promise<void>,
) {
  const originalEnvironment = saveEnvironment();
  const originalFetch = globalThis.fetch;
  configureOAuth(provider);
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnvironment(originalEnvironment);
  }
}

test('OAuth status requires complete credentials and reports only enabled providers', async () => {
  await withEnvironment(undefined, () => {
    assert.deepEqual(oauthStatus(), { configured: true, providers: ['github', 'google'] });

    delete process.env.OAUTH_ALLOWED_EMAILS;
    assert.deepEqual(oauthStatus(), { configured: false, providers: [] });

    process.env.OAUTH_ALLOWED_EMAILS = 'editor@example.test';
    delete process.env.ADMIN_SESSION_SECRET;
    assert.deepEqual(oauthStatus(), { configured: false, providers: [] });

    process.env.ADMIN_SESSION_SECRET = 'short';
    assert.deepEqual(oauthStatus(), { configured: false, providers: [] });

    process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-32-characters';
    delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    assert.deepEqual(oauthStatus(), { configured: false, providers: [] });
  });
});

test('OAuth status rejects unsafe callback URLs', async () => {
  await withEnvironment('github', () => {
    for (const callback of [
      'http://example.test/api/oauth',
      'https://example.test/wrong-path',
      'https://user:pass@example.test/api/oauth',
      'https://example.test/api/oauth?next=https://attacker.test',
      'https://example.test/api/oauth#fragment',
      'not a URL',
    ]) {
      process.env.OAUTH_CALLBACK_URL = callback;
      assert.deepEqual(oauthStatus(), { configured: false, providers: [] }, callback);
    }

    process.env.OAUTH_CALLBACK_URL = 'http://localhost:3000/api/oauth';
    assert.equal(oauthStatus().configured, true);
    process.env.NODE_ENV = 'production';
    assert.equal(oauthStatus().configured, false);
    process.env.NODE_ENV = 'test';
    process.env.VERCEL = '1';
    assert.equal(oauthStatus().configured, false);
  });
});

test('GitHub authorization uses state, PKCE, expected scope, and an HTTP-only Lax state cookie', async () => {
  await withEnvironment('github', async () => {
    const { response, authorizationUrl, state } = await beginSignIn('github');

    assert.equal(authorizationUrl.origin, 'https://github.com');
    assert.equal(authorizationUrl.pathname, '/login/oauth/authorize');
    assert.equal(authorizationUrl.searchParams.get('client_id'), 'github-client');
    assert.equal(authorizationUrl.searchParams.get('redirect_uri'), 'https://example.test/api/oauth');
    assert.equal(authorizationUrl.searchParams.get('response_type'), 'code');
    assert.equal(authorizationUrl.searchParams.get('scope'), 'read:user user:email');
    assert.equal(authorizationUrl.searchParams.get('code_challenge_method'), 'S256');
    assert.match(authorizationUrl.searchParams.get('code_challenge') ?? '', /^[A-Za-z0-9_-]{43}$/);
    assert.match(state, /^[A-Za-z0-9_-]{43}$/);

    const stateCookie = setCookies(response).find(cookie => cookie.startsWith('pcss_oauth_state='));
    assert.ok(stateCookie);
    assert.match(stateCookie, /HttpOnly/);
    assert.match(stateCookie, /SameSite=Lax/);
    assert.match(stateCookie, /Path=\//);
    assert.match(stateCookie, /Max-Age=600/);
    assert.doesNotMatch(stateCookie, /Secure/);
  });
});

test('Google authorization requests OIDC identity scopes with PKCE', async () => {
  await withEnvironment('google', async () => {
    const { authorizationUrl } = await beginSignIn('google');

    assert.equal(authorizationUrl.origin, 'https://accounts.google.com');
    assert.equal(authorizationUrl.pathname, '/o/oauth2/v2/auth');
    assert.equal(authorizationUrl.searchParams.get('client_id'), 'google-client');
    assert.equal(authorizationUrl.searchParams.get('redirect_uri'), 'https://example.test/api/oauth');
    assert.equal(authorizationUrl.searchParams.get('response_type'), 'code');
    assert.equal(authorizationUrl.searchParams.get('scope'), 'openid email profile');
    assert.equal(authorizationUrl.searchParams.get('code_challenge_method'), 'S256');
    assert.ok(authorizationUrl.searchParams.get('code_challenge'));
  });
});

test('OAuth endpoint rejects unsupported providers and non-GET requests', async () => {
  await withEnvironment('github', async () => {
    const unsupported = makeResponse();
    await oauthApi(makeRequest('/api/oauth?provider=facebook'), unsupported);
    assert.equal(unsupported.statusCode, 400);
    assert.deepEqual(JSON.parse(unsupported.body), { error: 'Unsupported sign-in provider.' });

    const methodNotAllowed = makeResponse();
    await oauthApi(makeRequest('/api/oauth', { method: 'POST' }), methodNotAllowed);
    assert.equal(methodNotAllowed.statusCode, 405);
    assert.deepEqual(JSON.parse(methodNotAllowed.body), { error: 'Method not allowed.' });
  });
});

test('OAuth start redirects safely when configuration or the requested provider is unavailable', async () => {
  await withEnvironment('github', async () => {
    delete process.env.OAUTH_ALLOWED_EMAILS;
    const unconfigured = makeResponse();
    await oauthApi(makeRequest('/api/oauth?provider=github'), unconfigured);
    assert.equal(unconfigured.headers.Location, '/admin/?oauth_error=unavailable');

    configureOAuth('github');
    const disabledProvider = makeResponse();
    await oauthApi(makeRequest('/api/oauth?provider=google'), disabledProvider);
    assert.equal(disabledProvider.headers.Location, '/admin/?oauth_error=unavailable');
  });
});

test('GitHub callback exchanges the code and creates an allowlisted signed session', async () => {
  await withEnvironment('github', async () => {
    process.env.OAUTH_ALLOWED_EMAILS = ' EDITOR@example.test ';
    mockFetch(async (url, init) => {
      if (url === 'https://github.com/login/oauth/access_token') {
        assert.equal(init?.method, 'POST');
        const form = new URLSearchParams(String(init?.body));
        assert.equal(form.get('client_id'), 'github-client');
        assert.equal(form.get('client_secret'), 'github-secret');
        assert.equal(form.get('redirect_uri'), 'https://example.test/api/oauth');
        assert.equal(form.get('grant_type'), 'authorization_code');
        assert.equal(form.get('code'), 'authorization-code');
        assert.ok(form.get('code_verifier'));
        return jsonResponse({ access_token: 'provider-access-token' });
      }
      if (url === 'https://api.github.com/user') {
        assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer provider-access-token');
        return jsonResponse({ id: 123 });
      }
      if (url === 'https://api.github.com/user/emails') {
        return jsonResponse([
          { email: 'not-verified@example.test', verified: false, primary: true },
          { email: 'Editor@example.test', verified: true, primary: false },
        ]);
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    });

    const { state, stateCookie } = await beginSignIn('github');
    const callback = await finishSignIn(state, stateCookie, { code: 'authorization-code' });
    assert.equal(callback.headers.Location, '/admin/');
    assert.equal(callback.statusCode, 302);

    const sessionCookie = cookiePair(callback, 'pcss_editor_session');
    const attributes = setCookies(callback).find(cookie => cookie.startsWith('pcss_editor_session='));
    assert.ok(attributes);
    assert.match(attributes, /HttpOnly/);
    assert.match(attributes, /SameSite=Strict/);
    assert.match(attributes, /Max-Age=28800/);
    assert.doesNotMatch(attributes, /provider-access-token|github-secret/);
    assert.equal(authenticated(makeRequest('/api/editor', { cookie: sessionCookie })), true);

    process.env.OAUTH_ALLOWED_EMAILS = 'another@example.test';
    assert.equal(authenticated(makeRequest('/api/editor', { cookie: sessionCookie })), false);
  });
});

test('Google callback creates a session only for an allowlisted verified email', async () => {
  await withEnvironment('google', async () => {
    mockFetch(async url => {
      if (url === 'https://oauth2.googleapis.com/token') {
        return jsonResponse({ access_token: 'google-access-token' });
      }
      if (url === 'https://openidconnect.googleapis.com/v1/userinfo') {
        return jsonResponse({ sub: 'google-user-1', email: 'EDITOR@example.test', email_verified: true });
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    });

    const { state, stateCookie } = await beginSignIn('google');
    const callback = await finishSignIn(state, stateCookie, { code: 'google-code' });
    assert.equal(callback.headers.Location, '/admin/');
    assert.equal(authenticated(makeRequest('/api/editor', {
      cookie: cookiePair(callback, 'pcss_editor_session'),
    })), true);
  });
});

test('Google callback denies unverified and non-allowlisted emails and clears any prior session', async () => {
  await withEnvironment('google', async () => {
    let verified = false;
    let email = 'editor@example.test';
    mockFetch(async url => {
      if (url === 'https://oauth2.googleapis.com/token') return jsonResponse({ access_token: 'google-access-token' });
      if (url === 'https://openidconnect.googleapis.com/v1/userinfo') {
        return jsonResponse({ email, email_verified: verified });
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    });

    for (const scenario of [
      { nextEmail: 'editor@example.test', isVerified: false },
      { nextEmail: 'other@example.test', isVerified: true },
    ]) {
      email = scenario.nextEmail;
      verified = scenario.isVerified;
      const { state, stateCookie } = await beginSignIn('google');
      const callback = await finishSignIn(state, stateCookie, { code: 'google-code' });
      assert.equal(callback.headers.Location, '/admin/?oauth_error=not_allowed');
      assert.ok(clearCookieWasSet(callback, 'pcss_editor_session'));
      assert.ok(clearCookieWasSet(callback, 'pcss_oauth_state'));
    }
  });
});

test('GitHub callback denies accounts without a verified allowlisted email', async () => {
  await withEnvironment('github', async () => {
    mockFetch(async url => {
      if (url === 'https://github.com/login/oauth/access_token') return jsonResponse({ access_token: 'github-access-token' });
      if (url === 'https://api.github.com/user') return jsonResponse({ id: 123 });
      if (url === 'https://api.github.com/user/emails') {
        return jsonResponse([{ email: 'editor@example.test', verified: false, primary: true }]);
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    });

    const { state, stateCookie } = await beginSignIn('github');
    const callback = await finishSignIn(state, stateCookie, { code: 'github-code' });
    assert.equal(callback.headers.Location, '/admin/?oauth_error=not_allowed');
    assert.ok(clearCookieWasSet(callback, 'pcss_editor_session'));
  });
});

test('OAuth callback rejects absent, mismatched, tampered, and expired state', async () => {
  await withEnvironment('github', async () => {
    let fetchCalls = 0;
    mockFetch(async () => {
      fetchCalls++;
      return jsonResponse({ access_token: 'must-not-be-requested' });
    });

    const missingCookieStart = await beginSignIn('github');
    const missingCookie = await finishSignIn(missingCookieStart.state, '', { code: 'code', cookie: '' });
    assert.equal(missingCookie.headers.Location, '/admin/?oauth_error=failed');

    const mismatchStart = await beginSignIn('github');
    const mismatch = await finishSignIn('wrong-state', mismatchStart.stateCookie, { code: 'code' });
    assert.equal(mismatch.headers.Location, '/admin/?oauth_error=failed');

    const tamperedStart = await beginSignIn('github');
    const [cookieName, cookieValue] = tamperedStart.stateCookie.split('=');
    const [payload, signature] = cookieValue.split('.');
    const last = signature.at(-1) === 'a' ? 'b' : 'a';
    const tamperedCookie = `${cookieName}=${payload}.${signature.slice(0, -1)}${last}`;
    const tampered = await finishSignIn(tamperedStart.state, tamperedCookie, { code: 'code' });
    assert.equal(tampered.headers.Location, '/admin/?oauth_error=failed');

    const expiredStart = await beginSignIn('github');
    const originalNow = Date.now;
    try {
      Date.now = () => originalNow() + 11 * 60 * 1000;
      const expired = await finishSignIn(expiredStart.state, expiredStart.stateCookie, { code: 'code' });
      assert.equal(expired.headers.Location, '/admin/?oauth_error=failed');
    } finally {
      Date.now = originalNow;
    }

    for (const invalid of [missingCookie, mismatch, tampered]) {
      assert.ok(clearCookieWasSet(invalid, 'pcss_oauth_state'));
      assert.ok(clearCookieWasSet(invalid, 'pcss_editor_session'));
    }
    assert.equal(fetchCalls, 0);
  });
});

test('OAuth denial, missing code, and oversized code do not contact providers', async () => {
  await withEnvironment('github', async () => {
    let fetchCalls = 0;
    mockFetch(async () => {
      fetchCalls++;
      return jsonResponse({ access_token: 'must-not-be-requested' });
    });

    const deniedStart = await beginSignIn('github');
    const denied = await finishSignIn(deniedStart.state, deniedStart.stateCookie, { error: 'access_denied' });
    assert.equal(denied.headers.Location, '/admin/?oauth_error=cancelled');

    const missingCodeStart = await beginSignIn('github');
    const missingCode = await finishSignIn(missingCodeStart.state, missingCodeStart.stateCookie);
    assert.equal(missingCode.headers.Location, '/admin/?oauth_error=failed');

    const oversizedCodeStart = await beginSignIn('github');
    const oversizedCode = await finishSignIn(oversizedCodeStart.state, oversizedCodeStart.stateCookie, {
      code: 'x'.repeat(2049),
    });
    assert.equal(oversizedCode.headers.Location, '/admin/?oauth_error=failed');
    assert.equal(fetchCalls, 0);
  });
});

test('provider and malformed-token failures clear cookies and redirect without granting access', async () => {
  await withEnvironment('github', async () => {
    const originalError = console.error;
    const loggedErrors: unknown[][] = [];
    console.error = (...args: unknown[]) => loggedErrors.push(args);
    try {
      for (const tokenResponse of [
        new Response('provider error', { status: 401 }),
        jsonResponse({ error: 'invalid_grant' }),
      ]) {
        mockFetch(async () => tokenResponse.clone());
        const { state, stateCookie } = await beginSignIn('github');
        const callback = await finishSignIn(state, stateCookie, { code: 'code' });
        assert.equal(callback.headers.Location, '/admin/?oauth_error=failed');
        assert.ok(clearCookieWasSet(callback, 'pcss_editor_session'));
      }

      mockFetch(async url => {
        if (url === 'https://github.com/login/oauth/access_token') return jsonResponse({ access_token: 'github-access-token' });
        return new Response('provider unavailable', { status: 503 });
      });
      const { state, stateCookie } = await beginSignIn('github');
      const callback = await finishSignIn(state, stateCookie, { code: 'code' });
      assert.equal(callback.headers.Location, '/admin/?oauth_error=failed');
      assert.ok(clearCookieWasSet(callback, 'pcss_editor_session'));
      assert.equal(loggedErrors.length, 3);
    } finally {
      console.error = originalError;
    }
  });
});

test('session authentication rejects absent, tampered, expired, and revoked sessions', async () => {
  await withEnvironment('github', async () => {
    assert.equal(authenticated(makeRequest('/api/editor')), false);

    mockFetch(async url => {
      if (url === 'https://github.com/login/oauth/access_token') return jsonResponse({ access_token: 'github-access-token' });
      if (url === 'https://api.github.com/user') return jsonResponse({ id: 123 });
      if (url === 'https://api.github.com/user/emails') {
        return jsonResponse([{ email: 'editor@example.test', verified: true }]);
      }
      throw new Error(`Unexpected OAuth request: ${url}`);
    });
    const { state, stateCookie } = await beginSignIn('github');
    const callback = await finishSignIn(state, stateCookie, { code: 'code' });
    const session = cookiePair(callback, 'pcss_editor_session');
    const authenticatedRequest = makeRequest('/api/editor', { cookie: session });
    assert.equal(authenticated(authenticatedRequest), true);

    const [name, value] = session.split('=');
    const [payload, signature] = value.split('.');
    const last = signature.at(-1) === 'a' ? 'b' : 'a';
    assert.equal(authenticated(makeRequest('/api/editor', {
      cookie: `${name}=${payload}.${signature.slice(0, -1)}${last}`,
    })), false);

    const originalNow = Date.now;
    try {
      Date.now = () => originalNow() + 8 * 60 * 60 * 1000 + 1;
      assert.equal(authenticated(authenticatedRequest), false);
    } finally {
      Date.now = originalNow;
    }

    process.env.OAUTH_ALLOWED_EMAILS = 'other@example.test';
    assert.equal(authenticated(authenticatedRequest), false);
  });
});

test('editor API rejects unauthenticated publishing and clears the session on logout', async () => {
  await withEnvironment('github', async () => {
    const unauthorized = makeResponse();
    await editorApi(makeRequest('/api/editor?page=home', {
      method: 'POST',
      body: { action: 'save', data: { root: {}, content: [] } },
    }), unauthorized);
    assert.equal(unauthorized.statusCode, 401);

    const logout = makeResponse();
    await editorApi(makeRequest('/api/editor', {
      method: 'POST',
      cookie: 'pcss_editor_session=old-session',
      body: { action: 'logout' },
    }), logout);
    assert.deepEqual(JSON.parse(logout.body), { authenticated: false });
    assert.ok(clearCookieWasSet(logout, 'pcss_editor_session'));
  });
});
