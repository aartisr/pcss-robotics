import React, { useState } from 'react';
import { RECOMMENDATIONS } from '../data/evaluationData';
import { PriorityLevel } from '../types';
import { Check, Copy, AlertOctagon, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleCopy = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRecs = RECOMMENDATIONS.filter((r) => {
    if (filterPriority === 'all') return true;
    return r.priority.startsWith(filterPriority);
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    if (priority.startsWith('P0')) return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
    if (priority.startsWith('P1')) return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
    if (priority.startsWith('P2')) return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Action Roadmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Remediation Roadmap: From 7.9 to 9.5+
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized engineering checklist to address identified repository gaps, image payloads, and canonical SEO splits.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1 shrink-0">
          {['all', 'P0', 'P1', 'P2', 'P3'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                filterPriority === p
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadge(rec.priority)}`}>
                  {rec.priority}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Target: {rec.target.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">
                  Effort: <strong className="text-slate-200">{rec.effort}</strong>
                </span>
              </div>
            </div>

            <h4 className="text-base font-semibold text-white">
              {rec.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {rec.description}
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
              <strong className="text-emerald-400">Target Outcome & Impact:</strong> {rec.impact}
            </div>

            {rec.codeSolution && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-cyan-400">
                    File: {rec.filePath}
                  </span>
                  <button
                    onClick={() => handleCopy(rec.id, rec.codeSolution)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  >
                    {copiedId === rec.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                  {rec.codeSolution}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
