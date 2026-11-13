import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_TEAM_ROSTER } from '../data/teamRosterData';
import { serializeRosterCsv } from './rosterCsv';

test('exports every roster member after a # character in an earlier record', () => {
  const csv = serializeRosterCsv(INITIAL_TEAM_ROSTER);
  const lines = csv.trimEnd().split('\r\n');

  assert.equal(lines.length, INITIAL_TEAM_ROSTER.length + 1);
  assert.match(lines[4], /FTC #23548 Chassis Iteration/);
  assert.match(lines[5], /Anthony Corpuz/);
  assert.match(csv, /Kevin Le/);
  assert.match(csv, /Dr\. Marcus Vance/);
});

test('quotes commas, double quotes, and line breaks without losing data', () => {
  const member = {
    ...INITIAL_TEAM_ROSTER[0],
    name: 'A "quoted" name',
    notes: 'First line, with comma\nSecond line'
  };
  const csv = serializeRosterCsv([member]);

  assert.match(csv, /"A ""quoted"" name"/);
  assert.match(csv, /"First line, with comma\nSecond line"/);
});
