import assert from 'node:assert/strict';
import test from 'node:test';
import { communityEvents, eventPhase, featuredEvent, formatEventDates } from './events';
import { structuredDataFor } from '../../seo/siteMetadata';
import { learningResources } from '../learning/resources';

test('features the next scheduled event and archives Circuit', () => {
  const now = new Date('2026-11-08T12:00:00-05:00');
  assert.equal(featuredEvent(now).id, 'haven-2026');
  assert.equal(eventPhase(communityEvents[1], now), 'past');
  assert.equal(eventPhase(communityEvents[0], now), 'upcoming');
});

test('event status changes at the scheduled boundaries', () => {
  const haven = communityEvents[0];
  assert.equal(eventPhase(haven, new Date('2026-11-14T10:00:00-05:00')), 'live');
  assert.equal(eventPhase(haven, new Date('2026-11-15T16:00:01-05:00')), 'past');
  assert.equal(formatEventDates(haven), 'November 14–15, 2026');
});

test('outreach discovery data lists both events from the shared catalog', () => {
  const graph = structuredDataFor('outreach')['@graph'];
  const eventNames = graph.filter(node => node['@type'] === 'Event').map(node => node.name);
  assert.deepEqual(eventNames, ['Hack Club Haven', 'Circuit 2026']);
});

test('Haven preparation points to the permanent PAT learning resource', () => {
  const haven = communityEvents.find(event => event.id === 'haven-2026');
  assert.ok(haven?.preparation);
  assert.equal(haven.preparation.resourceId, 'pat');
  assert.equal(learningResources.pat.url, 'https://pat.pcssiirobotics.org/');
  assert.equal(eventPhase(haven, new Date('2026-11-16T12:00:00-05:00')), 'past');
});
