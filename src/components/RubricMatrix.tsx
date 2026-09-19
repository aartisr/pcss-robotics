import React, { useState } from 'react';
import { RUBRIC_CATEGORIES } from '../data/evaluationData';
import { TargetType } from '../types';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, Filter, Award } from 'lucide-react';

export const RubricMatrix: React.FC = () => {
  const [filter, setFilter] = useState<'all' | TargetType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(RUBRIC_CATEGORIES[0].id);

  const filteredCategories = RUBRIC_CATEGORIES.filter(cat => {
    if (filter === 'all') return true;
    return cat.target === filter;
  });

  const averageScore =
    filteredCategories.reduce((acc, curr) => acc + curr.score, 0) /
    (filteredCategories.length || 1);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            7-Pillar Standardized Rubric (1 to 10 Scale)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Graded across architecture, code quality, design, domain accuracy, performance, SEO/AEO, and interactive innovation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter:</span>
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filter === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({RUBRIC_CATEGORIES.length})
            </button>
            <button
              onClick={() => setFilter('repo')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filter === 'repo'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GitHub Repo
            </button>
            <button
              onClick={() => setFilter('website')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filter === 'website'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Website
            </button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {filteredCategories.map((cat) => {
          const isExpanded = expandedId === cat.id;

          const getScoreColor = (score: number) => {
            if (score >= 9.0) return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
            if (score >= 8.0) return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
            if (score >= 7.0) return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
            if (score >= 6.0) return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
            return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
          };

          return (
            <div
              key={cat.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-cyan-800/60 bg-slate-900/90 shadow-md shadow-cyan-950/20'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Collapsed Row Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-base sm:text-lg shrink-0 ${getScoreColor(cat.score)}`}>
                    {cat.score.toFixed(1)}
                    <span className="text-xs font-normal text-slate-400 ml-0.5">/10</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-semibold text-white truncate">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {cat.target === 'repo' ? 'GitHub' : 'Website'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                        Weight: {cat.weight}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {cat.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="hidden sm:block w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${cat.score * 10}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                    <strong className="text-white">Detailed Evaluation Rationale:</strong>{' '}
                    {cat.summary}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-emerald-400 text-xs uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" />
                        Key Strengths & High Scores
                      </div>
                      <ul className="space-y-1.5 text-slate-300 text-xs">
                        {cat.strengths.map((str: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold shrink-0">&bull;</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/30 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-rose-400 text-xs uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" />
                        Gaps & Penalized Areas
                      </div>
                      <ul className="space-y-1.5 text-slate-300 text-xs">
                        {cat.weaknesses.map((weak: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold shrink-0">&bull;</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Concrete Code Evidence */}
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Verified Code & Network Evidence:
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      {cat.evidence}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Weighted Score Callout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-400">
        <div>
          Filtered Group Average:{' '}
          <strong className="text-white text-sm font-mono ml-1">
            {averageScore.toFixed(2)} / 10
          </strong>
        </div>
        <div className="text-slate-400">
          Scale: 9.0–10.0 (Exceptional) | 8.0–8.9 (Proficient) | 7.0–7.9 (Good) | 5.0–6.9 (Needs Work) | &lt;5.0 (Inadequate)
        </div>
      </div>
    </div>
  );
};
