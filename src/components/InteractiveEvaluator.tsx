import React, { useState } from 'react';
import { RUBRIC_CATEGORIES } from '../data/evaluationData';
import { ScoreGauge } from './ScoreGauge';
import { Sliders, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

export const InteractiveEvaluator: React.FC = () => {
  const [categories, setCategories] = useState(
    RUBRIC_CATEGORIES.map((c) => ({ ...c }))
  );
  const [copied, setCopied] = useState(false);

  const handleScoreChange = (id: string, newScore: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, score: newScore } : cat))
    );
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, weight: newWeight } : cat))
    );
  };

  const handleReset = () => {
    setCategories(RUBRIC_CATEGORIES.map((c) => ({ ...c })));
  };

  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);

  const calculatedScore =
    totalWeight > 0
      ? categories.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight
      : 0;

  const repoCategories = categories.filter((c) => c.target === 'repo');
  const repoWeight = repoCategories.reduce((sum, c) => sum + c.weight, 0);
  const repoScore =
    repoWeight > 0
      ? repoCategories.reduce((sum, c) => sum + c.score * c.weight, 0) / repoWeight
      : 0;

  const websiteCategories = categories.filter((c) => c.target === 'website');
  const websiteWeight = websiteCategories.reduce((sum, c) => sum + c.weight, 0);
  const websiteScore =
    websiteWeight > 0
      ? websiteCategories.reduce((sum, c) => sum + c.score * c.weight, 0) / websiteWeight
      : 0;

  const handleCopySummary = () => {
    const text = `PCSS Robotics Evaluation Summary:
• Overall Ecosystem Score: ${calculatedScore.toFixed(1)} / 10
• GitHub Repository (aartisr/pcss-robotics): ${repoScore.toFixed(1)} / 10
• Production Website (pcssiirobotics.org): ${websiteScore.toFixed(1)} / 10

Category Breakdown:
${categories
  .map((c) => `- ${c.name} (${c.target.toUpperCase()}): ${c.score.toFixed(1)} / 10 (Weight: ${c.weight}%)`)
  .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Interactive Evaluator & Weight Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize scoring criteria and pillar weights according to your team, sponsor, or competition evaluation rubric.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recalculated Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-400 mb-2">Adjusted Repo Score</span>
          <ScoreGauge score={repoScore} size={110} strokeWidth={8} colorScheme="amber" />
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-400 mb-2">Adjusted Website Score</span>
          <ScoreGauge score={websiteScore} size={110} strokeWidth={8} colorScheme="teal" />
        </div>
        <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 flex flex-col items-center">
          <span className="text-xs font-bold text-cyan-300 mb-2">Weighted Ecosystem Score</span>
          <ScoreGauge score={calculatedScore} size={110} strokeWidth={8} colorScheme="blue" />
        </div>
      </div>

      {/* Interactive Controls List */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{cat.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {cat.target.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold text-sm">
                  {cat.score.toFixed(1)} / 10
                </span>
                <span className="text-slate-400">
                  Weight: <strong className="text-slate-200">{cat.weight}%</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Score Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Adjust Score (1.0 to 10.0)</span>
                  <span className="text-cyan-300 font-mono">{cat.score.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={cat.score}
                  onChange={(e) => handleScoreChange(cat.id, parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Weight Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Adjust Weight (%)</span>
                  <span className="text-slate-200 font-mono">{cat.weight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={cat.weight}
                  onChange={(e) => handleWeightChange(cat.id, parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
