import React from 'react';
import { ScoreGauge } from './ScoreGauge';
import { OVERALL_SCORES, REPO_METRICS, WEBSITE_METRICS } from '../data/evaluationData';
import { ExternalLink, Github, Globe, Award, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ScorecardOverviewProps {
  onSelectTab: (tab: 'rubric' | 'repo' | 'website' | 'recommendations' | 'evaluator') => void;
}

export const ScorecardOverview: React.FC<ScorecardOverviewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-8">
      {/* Target Subject Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
              <Award className="w-3.5 h-3.5" />
              Comprehensive Technical & UX Audit
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              PCSS II Robotics (FTC #23548) Evaluation
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              In-depth assessment of the open-source GitHub repository{' '}
              <span className="text-cyan-300 font-mono text-xs bg-slate-800/80 px-1.5 py-0.5 rounded">
                aartisr/pcss-robotics
              </span>{' '}
              and the live production platform at{' '}
              <span className="text-cyan-300 font-mono text-xs bg-slate-800/80 px-1.5 py-0.5 rounded">
                https://www.pcssiirobotics.org/
              </span>
              , scored against modern web engineering, FIRST Tech Challenge presentation, performance, and SEO/AEO standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/aartisr/pcss-robotics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition text-sm font-medium shadow-sm"
            >
              <Github className="w-4 h-4 text-cyan-400" />
              <span>Inspect GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://www.pcssiirobotics.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition shadow-lg shadow-cyan-900/30"
            >
              <Globe className="w-4 h-4" />
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Scorecard Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GitHub Repo Score Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                <Github className="w-4 h-4 text-cyan-400" />
                <span>GitHub Repository</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                Grade: {OVERALL_SCORES.repoGrade}
              </span>
            </div>

            <div className="py-2">
              <ScoreGauge
                score={OVERALL_SCORES.repo}
                colorScheme="amber"
                sublabel="Rating"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Content-driven architecture with TanStack Router & Puck editor</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Single squashed commit dump & generic &quot;react-example&quot; name</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>0 automated test suites; dead boilerplate files present</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('repo')}
            className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700/60 transition"
          >
            Explore Full Repo Audit &rarr;
          </button>
        </div>

        {/* Live Website Score Card */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 flex flex-col justify-between shadow-lg shadow-cyan-950/20 hover:border-cyan-700/60 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Production Website</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                Grade: {OVERALL_SCORES.websiteGrade}
              </span>
            </div>

            <div className="py-2">
              <ScoreGauge
                score={OVERALL_SCORES.website}
                colorScheme="teal"
                sublabel="Rating"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rich FTC specs (Kraken V2, AeroStrike, Vortex) & 501(c)(3) sponsor tiers</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pioneering AEO with /llms.txt and AI search engine crawler support</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Critical SEO flaw: Canonical domain tags point to .xyz instead of .org</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('website')}
            className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 transition"
          >
            Explore Live Site Audit &rarr;
          </button>
        </div>

        {/* Combined Platform Score Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Combined Ecosystem</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/40">
                Grade: {OVERALL_SCORES.ecosystemGrade}
              </span>
            </div>

            <div className="py-2">
              <ScoreGauge
                score={OVERALL_SCORES.ecosystem}
                colorScheme="blue"
                sublabel="Rating"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Far exceeds typical high school robotics team online presence</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Interactive Sponsor ROI calculator and arcade mini-game catalog</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Fixing 3 critical hygiene issues elevates the project to a 9.5+</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('recommendations')}
            className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700/60 transition"
          >
            View Priority Fix Roadmap &rarr;
          </button>
        </div>
      </div>

      {/* Snapshot Telemetry Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>Key Verified Technical Metrics</span>
          <span className="text-xs font-normal text-slate-400">(Audited via live git clone & HTTP inspection)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {WEBSITE_METRICS.slice(0, 3).concat(REPO_METRICS.slice(0, 3)).map((m, idx) => {
            const badgeClass =
              m.status === 'positive'
                ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40'
                : m.status === 'warning'
                ? 'text-amber-400 bg-amber-950/30 border-amber-900/40'
                : m.status === 'negative'
                ? 'text-rose-400 bg-rose-950/30 border-rose-900/40'
                : 'text-slate-400 bg-slate-800/30 border-slate-700/40';

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 transition"
              >
                <div className="text-[11px] font-medium text-slate-400 truncate">{m.label}</div>
                <div className="mt-1 text-sm font-bold text-white truncate">{m.value}</div>
                <div className="mt-1 text-[10px] text-slate-400 leading-tight line-clamp-2">{m.sublabel}</div>
                <div className={`mt-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border ${badgeClass}`}>
                  {m.status.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Verdict Summary Callout */}
      <div className="rounded-xl border border-cyan-900/30 bg-cyan-950/20 p-5 text-sm leading-relaxed text-slate-300">
        <strong className="text-cyan-300">Executive Evaluator Takeaway:</strong> PCSS II Robotics (FTC #23548) has built an unusually sophisticated and ambitious web presence that outclasses 95% of high school robotics teams. Its live site delivers genuine sponsor conversion tools, rich CAD/mechanical robot histories, and forward-looking LLM/AEO crawlability. The primary detractor is repository hygiene: a single-commit squash, dead boilerplate artifacts, lack of unit tests, and a high-impact canonical domain split (`.org` vs `.xyz`) in the metadata. Addressing these items will instantly elevate both scores into the 9.5+ tier.
      </div>
    </div>
  );
};
