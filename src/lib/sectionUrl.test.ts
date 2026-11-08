import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalSectionUrl } from './sectionUrl';

test('preserves arcade invite parameters through legacy URL normalization', () => {
  assert.equal(canonicalSectionUrl('arcade', '?section=arcade&room=Team%20A', '#game'), '/arcade/?room=Team+A#game');
});

test('removes only the legacy section parameter', () => {
  assert.equal(canonicalSectionUrl('home', '?section=home&campaign=fall'), '/?campaign=fall');
  assert.equal(canonicalSectionUrl('team', ''), '/team/');
});
