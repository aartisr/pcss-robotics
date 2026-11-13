import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';

test('team tabs survive parent rerenders, page-data refreshes, and unrelated controls', async () => {
  const browser = new Window({ url: 'http://localhost/team/' });
  Object.assign(globalThis, {
    window: browser,
    document: browser.document,
    localStorage: browser.localStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  Object.defineProperty(globalThis, 'navigator', { value: browser.navigator, configurable: true });
  for (const name of ['ResizeObserver', 'MutationObserver', 'IntersectionObserver', 'HTMLElement', 'Element', 'Node'] as const) {
    Object.assign(globalThis, { [name]: browser[name] ?? class { observe() {} unobserve() {} disconnect() {} } });
  }

  const { PageRenderer } = await import('./config');
  const data = JSON.parse(readFileSync(new URL('../../templates/team.json', import.meta.url), 'utf8'));
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const onNavigate = () => {};
  const sponsor = { openW9: false, resetW9: () => {} };
  const render = async (pageData = data, sponsorControls = sponsor) => act(async () => { root.render(React.createElement(PageRenderer, { data: pageData, onNavigate, sponsor: sponsorControls })); });
  const click = async (label: string) => {
    const button = [...container.querySelectorAll('button')].find(item => item.textContent?.startsWith(label));
    assert.ok(button, `Missing ${label} button`);
    await act(async () => { button.click(); });
  };

  try {
    await render();
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
    await click('Mentors (');
    assert.match(container.textContent, /Mentors & teachers/);
    await render();
    assert.match(container.textContent, /Mentors & teachers/);
    await render(structuredClone(data));
    assert.match(container.textContent, /Mentors & teachers/);
    await render(data, { ...sponsor, openW9: true });
    assert.match(container.textContent, /Mentors & teachers/);

    const planningMenu = container.querySelector('details');
    assert.ok(planningMenu);
    planningMenu.open = true;
    await render(structuredClone(data));
    assert.equal(planningMenu.isConnected, true);
    assert.equal(planningMenu.open, true);

    await click('Competitions');
    assert.match(container.textContent, /Competitions & challenges/);
    await render(structuredClone(data));
    assert.match(container.textContent, /Competitions & challenges/);
  } finally {
    await act(async () => { root.unmount(); });
    container.remove();
    await browser.happyDOM.cancelAsync();
  }
});
