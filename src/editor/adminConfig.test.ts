import test from 'node:test';
import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { editorApi } from '../../server/editorApi';

async function sessionStatus() {
  let result = '';
  const request = { method: 'GET', url: '/api/editor?session=1', headers: { host: 'localhost' } } as IncomingMessage;
  const response = {
    statusCode: 200,
    setHeader() {},
    end(value: string) { result = value; },
  } as unknown as ServerResponse;
  await editorApi(request, response);
  return JSON.parse(result) as { configured: boolean; authenticated: boolean; missingPublishConfig: string[] };
}

async function teamPageRequest() {
  let result = '';
  let statusCode = 200;
  const request = { method: 'GET', url: '/api/editor?page=team', headers: { host: 'localhost' } } as IncomingMessage;
  const response = {
    get statusCode() { return statusCode; },
    set statusCode(value: number) { statusCode = value; },
    setHeader() {},
    end(value: string) { result = value; },
  } as unknown as ServerResponse;
  await editorApi(request, response);
  return { statusCode, body: JSON.parse(result) as { error: string } };
}

test('editor API hides the team page by default', async () => {
  const original = process.env.VITE_PUBLIC_TEAM_PAGE;
  try {
    delete process.env.VITE_PUBLIC_TEAM_PAGE;
    assert.deepEqual(await teamPageRequest(), { statusCode: 404, body: { error: 'Page not found.' } });
  } finally {
    if (original === undefined) delete process.env.VITE_PUBLIC_TEAM_PAGE;
    else process.env.VITE_PUBLIC_TEAM_PAGE = original;
  }
});

test('editor session checks OAuth configuration without exposing secrets', async () => {
  const keys = ['ADMIN_SESSION_SECRET', 'OAUTH_CALLBACK_URL', 'OAUTH_ALLOWED_EMAILS', 'GITHUB_OAUTH_CLIENT_ID', 'GITHUB_OAUTH_CLIENT_SECRET', 'GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET'];
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    process.env.ADMIN_SESSION_SECRET = 'test-session-secret-with-more-than-32-characters';
    process.env.OAUTH_CALLBACK_URL = 'https://example.test/api/oauth';
    process.env.OAUTH_ALLOWED_EMAILS = 'editor@example.test';
    process.env.GITHUB_OAUTH_CLIENT_ID = 'test-client-id';
    process.env.GITHUB_OAUTH_CLIENT_SECRET = 'test-client-secret';
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const ready = await sessionStatus();
    assert.deepEqual(ready, { authenticated: false, configured: true, providers: ['github'], missingPublishConfig: [] });
    assert.ok(!JSON.stringify(ready).includes('test-session-secret-with-more-than-32-characters'));
    assert.ok(!JSON.stringify(ready).includes('test-client-secret'));

    delete process.env.OAUTH_ALLOWED_EMAILS;
    assert.deepEqual(await sessionStatus(), { authenticated: false, configured: false, providers: [], missingPublishConfig: [] });
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('deployed editor reports missing publishing settings without exposing values', async () => {
  const original = Object.fromEntries(['VERCEL', 'GITHUB_CONTENT_TOKEN', 'GITHUB_CONTENT_REPO'].map(key => [key, process.env[key]]));
  try {
    process.env.VERCEL = '1';
    delete process.env.GITHUB_CONTENT_TOKEN;
    delete process.env.GITHUB_CONTENT_REPO;
    assert.deepEqual((await sessionStatus()).missingPublishConfig, ['GITHUB_CONTENT_TOKEN', 'GITHUB_CONTENT_REPO']);
    process.env.GITHUB_CONTENT_TOKEN = 'test-secret-token';
    process.env.GITHUB_CONTENT_REPO = 'owner/repo';
    const ready = await sessionStatus();
    assert.deepEqual(ready.missingPublishConfig, []);
    assert.ok(!JSON.stringify(ready).includes('test-secret-token'));
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
