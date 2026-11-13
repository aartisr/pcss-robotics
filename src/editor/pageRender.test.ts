import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Render, type Data } from '@puckeditor/core';
import { createPageConfig } from './config';
import { TeamSection } from '../components/TeamSection';
import { INITIAL_TEAM_ROSTER } from '../data/teamRosterData';

const PAGE_IDS = ['home', 'robots', 'research', 'simulator', 'team', 'outreach', 'arcade', 'sponsors'] as const;

test('every JSON page renders through Puck with the application React instance', () => {
  const config = createPageConfig(() => {});
  for (const id of PAGE_IDS) {
    const data = JSON.parse(readFileSync(new URL(`../../templates/${id}.json`, import.meta.url), 'utf8')) as Data;
    const html = renderToString(React.createElement(Render, { config, data }));
    assert.match(html, /<section/, `${id} should render page content`);
  }
});

test('team roster uses published member data instead of a browser-local roster', () => {
  const roster = [{ ...INITIAL_TEAM_ROSTER[0], name: 'Edited team member' }];
  const html = renderToString(React.createElement(TeamSection, { roster }));
  assert.match(html, /Edited team member/);
  assert.doesNotMatch(html, /Add student/);
});

test('robots page body is editable JSON blocks', () => {
  const page = JSON.parse(readFileSync(new URL('../../templates/robots.json', import.meta.url), 'utf8')) as Data;
  assert.deepEqual(page.content.map(block => block.type), ['SectionIntro', 'EngineeringTopic', 'EngineeringTopic', 'EngineeringTopic', 'InsetNote']);
  const html = renderToString(React.createElement(Render, { config: createPageConfig(() => {}), data: page }));
  assert.match(html, /How a robot moves/);
  assert.match(html, /Test turning, stopping, and repeatability/);
  assert.match(html, /Robot profiles can be added/);
});
