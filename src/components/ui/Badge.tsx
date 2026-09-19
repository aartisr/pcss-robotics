import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  icon,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-semibold rounded-full select-none';

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5'
  };

  const variantStyles = {
    cyan: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30',
    purple: 'bg-purple-950/80 text-purple-300 border border-purple-500/30',
    emerald: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-950/80 text-amber-300 border border-amber-500/30',
    rose: 'bg-rose-950/80 text-rose-300 border border-rose-500/30',
    slate: 'bg-slate-900 text-slate-300 border border-white/10',
    outline: 'bg-transparent text-slate-300 border border-white/20'
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
