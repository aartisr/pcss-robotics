import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canonicalSectionUrl } from '../lib/sectionUrl';

test('disabled team URLs normalize to the home page and the team template is empty', () => {
  const data = JSON.parse(readFileSync(new URL('../../templates/team.json', import.meta.url), 'utf8'));
  assert.equal(canonicalSectionUrl('team', ''), '/');
  assert.deepEqual(data.content, []);
});
