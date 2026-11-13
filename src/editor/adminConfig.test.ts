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
  return JSON.parse(result) as { configured: boolean; authenticated: boolean };
}

test('editor session checks current server environment without exposing secrets', async () => {
  const originalPassword = process.env.ADMIN_PASSWORD;
  const originalSecret = process.env.ADMIN_SESSION_SECRET;
  try {
    process.env.ADMIN_PASSWORD = 'test-password';
    process.env.ADMIN_SESSION_SECRET = 'test-session-secret';
    const ready = await sessionStatus();
    assert.deepEqual(ready, { configured: true, authenticated: false });
    assert.ok(!JSON.stringify(ready).includes('test-session-secret'));

    delete process.env.ADMIN_SESSION_SECRET;
    assert.deepEqual(await sessionStatus(), { configured: false, authenticated: false });
  } finally {
    if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalPassword;
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  }
});
