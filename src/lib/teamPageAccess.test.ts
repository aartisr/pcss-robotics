import assert from 'node:assert/strict';
import test from 'node:test';
import { clearStoredTeamData, isPublicTeamPageEnabled, TEAM_LOCAL_STORAGE_KEYS } from './teamPageAccess';

test('public team access requires an explicit true value', () => {
  assert.equal(isPublicTeamPageEnabled('true'), true);
  assert.equal(isPublicTeamPageEnabled(undefined), false);
  assert.equal(isPublicTeamPageEnabled('false'), false);
  assert.equal(isPublicTeamPageEnabled('TRUE'), false);
});

test('clears only the known team-related browser storage keys', () => {
  const removed: string[] = [];
  clearStoredTeamData({ removeItem: key => removed.push(key) });
  assert.deepEqual(removed, TEAM_LOCAL_STORAGE_KEYS);
});
