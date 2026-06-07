import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'none';
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'none',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: '',
    blue: 'shadow-[0_0_20px_-5px_rgba(37,99,235,0.15)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]',
    indigo: 'shadow-[0_0_20px_-5px_rgba(79,70,229,0.15)] hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)]',
    emerald: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
    amber: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  };

  return (
    <div
      className={`
        backdrop-blur-xl backdrop-filter
        bg-white/60 dark:bg-slate-900/60
        border border-slate-200/50 dark:border-slate-800/50
        rounded-2xl p-6 transition-all duration-300
        ${glowStyles[glowColor]}
        ${hoverEffect ? 'hover:translate-y-[-2px] hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:bg-white/80 dark:hover:bg-slate-900/80' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
