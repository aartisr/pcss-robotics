import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow-cyan' | 'glow-purple';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl sm:rounded-3xl transition relative overflow-hidden';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10'
  };

  const variantStyles = {
    default: 'bg-slate-900 border border-white/10 shadow-xl',
    glass: 'bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl',
    'glow-cyan': 'bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/30',
    'glow-purple': 'bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl shadow-purple-950/30'
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
