import assert from 'node:assert/strict';
import test from 'node:test';
import type { TeamMember } from '../types';
import { serializeRosterCsv } from './rosterCsv';

const fixtureMembers: TeamMember[] = [
  {
    id: 'fixture-a',
    name: 'Sample Member A',
    role: 'Robotics Member',
    division: 'Software & Autonomous',
    grade: 'Grade 10',
    specialty: 'Testing',
    competition: 'Sample Challenge',
  },
  {
    id: 'fixture-b',
    name: 'Sample Member B',
    role: 'Robotics Member',
    division: 'Hardware & CAD',
    grade: 'Grade 11',
    specialty: 'Design',
  },
];

test('exports every roster member after a # character in an earlier record', () => {
  const csv = serializeRosterCsv(fixtureMembers);
  const lines = csv.trimEnd().split('\r\n');

  assert.equal(lines.length, fixtureMembers.length + 1);
  assert.match(lines[1], /Sample Member A/);
  assert.match(lines[2], /Sample Member B/);
});

test('quotes commas, double quotes, and line breaks without losing data', () => {
  const member = {
    ...fixtureMembers[0],
    name: 'A "quoted" name',
    notes: 'First line, with comma\nSecond line'
  };
  const csv = serializeRosterCsv([member]);

  assert.match(csv, /"A ""quoted"" name"/);
  assert.match(csv, /"First line, with comma\nSecond line"/);
});
