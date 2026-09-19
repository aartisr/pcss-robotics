import React from 'react';

interface ScoreGaugeProps {
  score: number; // 1 to 10
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'teal' | 'blue' | 'amber' | 'emerald';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  colorScheme = 'teal'
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress from 0 to 1 based on score / 10
  const progress = Math.min(Math.max(score / 10, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  const colorMap = {
    teal: {
      track: '#132e35',
      stroke: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.4)',
      text: 'text-cyan-400',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50'
    },
    blue: {
      track: '#172554',
      stroke: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.4)',
      text: 'text-blue-400',
      badge: 'bg-blue-950/80 text-blue-300 border-blue-700/50'
    },
    amber: {
      track: '#3b2505',
      stroke: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      text: 'text-amber-400',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-700/50'
    },
    emerald: {
      track: '#062d1d',
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      text: 'text-emerald-400',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
    }
  };

  const scheme = colorMap[colorScheme];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.track}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${scheme.glow})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <div className="flex items-baseline">
            <span className={`text-3xl font-bold tracking-tight ${scheme.text}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-400 ml-0.5">/10</span>
          </div>
          {sublabel && (
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="mt-2 text-sm font-semibold text-slate-200">
          {label}
        </span>
      )}
    </div>
  );
};
