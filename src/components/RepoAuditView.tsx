import React, { useState } from 'react';
import { Github, Code2, AlertTriangle, CheckCircle, FileText, GitCommit, Layers, Terminal, Sparkles } from 'lucide-react';

export const RepoAuditView: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'architecture' | 'hygiene' | 'dependencies' | 'cicd'>('architecture');

  return (
    <div className="space-y-6">
      {/* Repo Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Github className="w-4 h-4" />
            Repository Evaluation &bull; Score: 7.2 / 10
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            aartisr/pcss-robotics
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Target: <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">https://github.com/aartisr/pcss-robotics.git</code>
            &bull; Licensed under MIT &bull; React 19 + Vite 6 + TanStack Ecosystem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/40">
            Rating: 7.2 / 10 (Grade B)
          </span>
          <a
            href="https://github.com/aartisr/pcss-robotics"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
          >
            Open on GitHub &rarr;
          </a>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setSelectedSubTab('architecture')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            selectedSubTab === 'architecture'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Architecture & Routing
        </button>
        <button
          onClick={() => setSelectedSubTab('hygiene')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            selectedSubTab === 'hygiene'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Hygiene & Antipatterns
        </button>
        <button
          onClick={() => setSelectedSubTab('dependencies')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            selectedSubTab === 'dependencies'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Dependencies & Bundle Audit
        </button>
        <button
          onClick={() => setSelectedSubTab('cicd')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            selectedSubTab === 'cicd'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          CI/CD & Testing Gap
        </button>
      </div>

      {/* Tab 1: Architecture */}
      {selectedSubTab === 'architecture' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4 text-sm text-slate-300">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Content-Driven Headless Design
            </h4>
            <p className="leading-relaxed text-xs sm:text-sm">
              The project uses a clean content-first architecture. Rather than hardcoding text and section blocks in JSX, all team pages (About, Robots, Outreach, Sponsors, Events, Media, Circuit 2026) are structured in <code className="text-cyan-300 font-mono bg-slate-950 px-1 py-0.5 rounded">src/content/siteContent.json</code>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5" /> TanStack Router Dynamic Slugs
                </span>
                <p className="text-slate-400">
                  <code className="text-slate-200 font-mono">src/router.jsx</code> loops through <code className="text-slate-200 font-mono">content.pages</code> and creates dynamic routes with preload-on-intent and not-found fallbacks.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Puck Visual Page Editor
                </span>
                <p className="text-slate-400">
                  Integrated <code className="text-slate-200 font-mono">@puckeditor/core</code> at <code className="text-slate-200 font-mono">/admin/edit</code> allowing non-technical team members to drag and reorder sections in-browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hygiene */}
      {selectedSubTab === 'hygiene' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 leading-relaxed">
            <strong>Hygiene Audit Summary:</strong> The project demonstrates impressive frontend ambition, but displays telltale signs of a rapid AI-scaffolded dump that wasn&apos;t fully scrubbed before repository publication.
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Issue 1: Monolithic Single-Commit Git History
                </span>
                <span className="text-amber-400 font-mono">Severity: Medium</span>
              </div>
              <p className="text-xs text-slate-400">
                The repository has exactly one commit (<code className="text-slate-300 font-mono">c5e4fbb feat: 100% responsiveness...</code>). There is no incremental git commit history, feature branches, or PR reviews, making code archeology impossible.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Issue 2: Dead Boilerplate Entry Points
                </span>
                <span className="text-amber-400 font-mono">Severity: Medium</span>
              </div>
              <p className="text-xs text-slate-400">
                The repo contains <code className="text-slate-300 font-mono">src/main.jsx</code> (which runs the actual app), but also leaves <code className="text-slate-300 font-mono">src/main.tsx</code> and an empty <code className="text-slate-300 font-mono">src/App.tsx</code> (empty div) from the default template. This confuses contributors and linters.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Issue 3: Dual Lockfiles (package-lock.json + bun.lock)
                </span>
                <span className="text-amber-400 font-mono">Severity: Low</span>
              </div>
              <p className="text-xs text-slate-400">
                Committing both <code className="text-slate-300 font-mono">bun.lock</code> and <code className="text-slate-300 font-mono">package-lock.json</code> causes version drift between developers using Bun and CI running npm.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Issue 4: Default Package Name (&quot;react-example&quot;)
                </span>
                <span className="text-amber-400 font-mono">Severity: Low</span>
              </div>
              <p className="text-xs text-slate-400">
                <code className="text-slate-300 font-mono">package.json</code> has <code className="text-slate-300 font-mono">&quot;name&quot;: &quot;react-example&quot;</code> and <code className="text-slate-300 font-mono">&quot;version&quot;: &quot;0.0.0&quot;</code> rather than <code className="text-slate-300 font-mono">&quot;name&quot;: &quot;pcss-robotics&quot;</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dependencies */}
      {selectedSubTab === 'dependencies' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-sm font-semibold text-white">Dependency Manifest Analysis</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Package</th>
                    <th className="p-2.5">Version</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">react / react-dom</td>
                    <td className="p-2.5 font-mono">^19.0.1</td>
                    <td className="p-2.5">Core UI Runtime</td>
                    <td className="p-2.5 text-emerald-400">Modern / Stable</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">@tanstack/react-router</td>
                    <td className="p-2.5 font-mono">^1.139.16</td>
                    <td className="p-2.5">Type-safe routing</td>
                    <td className="p-2.5 text-emerald-400">Active & Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">@puckeditor/core</td>
                    <td className="p-2.5 font-mono">^0.23.0</td>
                    <td className="p-2.5">Visual CMS in /admin</td>
                    <td className="p-2.5 text-emerald-400">Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">motion</td>
                    <td className="p-2.5 font-mono">^12.23.24</td>
                    <td className="p-2.5">Animations</td>
                    <td className="p-2.5 text-emerald-400">Active & Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">express</td>
                    <td className="p-2.5 font-mono">^4.21.2</td>
                    <td className="p-2.5">Web Server</td>
                    <td className="p-2.5 text-rose-400 font-semibold">Unused (Pure Static SPA)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-cyan-300">@google/genai</td>
                    <td className="p-2.5 font-mono">^2.4.0</td>
                    <td className="p-2.5">Gemini AI Client</td>
                    <td className="p-2.5 text-amber-400">Declared, but Mocked in UI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: CI/CD */}
      {selectedSubTab === 'cicd' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              GitHub Actions Workflow (.github/workflows/ci.yml)
            </h4>
            <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`name: CI
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint   # <-- Warning: Invokes "tsc --noEmit" on JSX codebase
      - run: npm run build`}
            </pre>
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
              <strong>Testing & Linting Gap:</strong> There are currently 0 automated test suites. Moreover, <code className="font-mono text-white">npm run lint</code> is bound to TypeScript checking, but the project files are mostly <code className="font-mono text-white">.jsx</code>, meaning linting either fails or gives zero meaningful feedback.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
