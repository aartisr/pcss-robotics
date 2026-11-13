import { useEffect, useMemo, useState } from 'react';
import { Puck, type Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { createPageConfig } from './config';
import { defaultPage, loadPage, PAGE_IDS } from './pageData';
import type { NavSection } from '../types';

const labels: Record<NavSection, string> = { home: 'Home', robots: 'Robots', research: 'Research', simulator: 'Simulator', team: 'Team', outreach: 'Outreach', arcade: 'Arcade', sponsors: 'Sponsors' };

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState('');
  const [page, setPage] = useState<NavSection>('home');
  const [data, setData] = useState<Data>(defaultPage('home'));
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const config = useMemo(() => createPageConfig(() => {}), []);

  useEffect(() => {
    fetch('/api/editor?session=1', { credentials: 'same-origin' }).then(response => response.json()).then(result => { setAuthenticated(Boolean(result.authenticated)); setConfigured(Boolean(result.configured)); }).catch(() => { setAuthenticated(false); setConfigured(false); });
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let current = true;
    setLoading(true);
    setMessage('');
    loadPage(page).then(next => { if (current) { setData(next); setDirty(false); } }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [page, authenticated]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setMessage('Signing in…');
    try {
      const response = await fetch('/api/editor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'login', password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Sign in failed.');
      setPassword('');
      setMessage('');
      setAuthenticated(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign in failed.'); }
  }

  async function publish(next: Data) {
    setMessage('Publishing…');
    try {
      const response = await fetch(`/api/editor?page=${page}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'save', data: next }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Publish failed.');
      setData(next);
      setDirty(false);
      setMessage('Published. Your page is live.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Publish failed.');
      throw error;
    }
  }

  if (authenticated === null) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">Opening editor…</div>;
  if (!authenticated) return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"><form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"><p className="text-sm font-semibold text-sky-300">PCSS II Robotics</p><h1 className="mt-2 text-3xl font-bold">Page editor</h1><p className="mt-3 text-sm text-slate-300">Enter your editor password to continue.</p><label htmlFor="editor-password" className="mt-7 block text-sm font-semibold">Password</label><input id="editor-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 text-white focus:border-sky-400 focus:outline-none" required /><button type="submit" className="mt-5 min-h-12 w-full rounded-xl bg-sky-600 px-4 font-bold hover:bg-sky-500">Sign in</button>{message && <p role="alert" className="mt-4 text-sm text-amber-300">{message}</p>}{!configured && <p className="mt-4 text-sm text-slate-400">Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your server configuration.</p>}</form></main>;

  return <div className="flex h-dvh min-w-0 flex-col bg-white">
    <header className="grid shrink-0 grid-cols-2 items-center gap-2 border-b border-slate-200 bg-slate-950 px-3 py-3 text-white sm:flex sm:flex-wrap sm:px-4">
      <div className="col-span-2 min-w-0 sm:mr-auto">
        <strong className="text-sm">PCSS II Page editor</strong>
        <p className="text-xs text-slate-300">{page === 'team' ? 'Select Team roster, then open a member by name on the right.' : page === 'robots' ? 'Select any engineering question to edit its text and steps.' : 'Choose a page, edit it, then Publish.'}{dirty ? ' Unpublished changes.' : ''}</p>
      </div>
      <label className="sr-only sm:not-sr-only sm:text-sm" htmlFor="page-choice">Page</label>
      <select id="page-choice" value={page} onChange={event => { const next = event.target.value as NavSection; if (!dirty || window.confirm('Leave this page? Unpublished changes will be lost.')) setPage(next); }} className="col-span-2 min-h-11 min-w-0 w-full rounded-lg border border-slate-500 bg-slate-900 px-3 text-white sm:w-auto">{PAGE_IDS.map(id => <option key={id} value={id}>{labels[id]}</option>)}</select>
      <a href={page === 'home' ? '/' : `/${page}/`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center rounded-lg border border-slate-500 px-3 text-center text-sm hover:bg-slate-800">View page ↗</a>
      <button type="button" onClick={async () => { if (dirty && !window.confirm('Sign out? Unpublished changes will be lost.')) return; await fetch('/api/editor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) }); setAuthenticated(false); }} className="min-h-11 rounded-lg border border-slate-500 px-3 text-sm hover:bg-slate-800">Sign out</button>
    </header>
    {message && <p role="status" className="shrink-0 border-b border-sky-200 bg-sky-50 px-4 py-2 text-sm text-slate-900">{message}</p>}
    <div className="min-h-0 min-w-0 flex-1">
      {loading ? <div className="p-8 text-slate-700">Loading {labels[page]}…</div> : <Puck key={page} config={config} data={data} ui={((page === 'team' && data.content[1]?.type === 'TeamRoster') || (page === 'robots' && data.content[1]?.type === 'EngineeringTopic')) ? { itemSelector: { index: 1 }, rightSideBarVisible: true } : undefined} height="100%" onChange={() => setDirty(true)} onPublish={publish} />}
    </div>
  </div>;
}
