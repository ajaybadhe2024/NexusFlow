import React from 'react';

export const Badge = ({ children, status = 'default', className = '', showDot = true }) => {
  const statusStyles = {
    online: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50 dot-emerald-400',
    running: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50 dot-emerald-400',
    offline: 'bg-slate-900 text-slate-400 border-slate-700 dot-slate-400',
    stopped: 'bg-slate-900 text-slate-400 border-slate-700 dot-slate-400',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-800/50 dot-amber-400',
    critical: 'bg-rose-950/80 text-rose-400 border-rose-800/50 dot-rose-400',
    draft: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/50 dot-cyan-400',
    info: 'bg-sky-950/80 text-sky-400 border-sky-800/50 dot-sky-400',
    resolved: 'bg-slate-900 text-slate-400 border-slate-700 dot-slate-400',
    default: 'bg-slate-800 text-slate-300 border-slate-700 dot-slate-400'
  };

  const dots = {
    online: 'bg-emerald-400 animate-pulse',
    running: 'bg-emerald-400 animate-pulse',
    offline: 'bg-slate-400',
    stopped: 'bg-slate-400',
    warning: 'bg-amber-400 animate-pulse',
    critical: 'bg-rose-400 animate-ping',
    draft: 'bg-cyan-400',
    info: 'bg-sky-400',
    resolved: 'bg-emerald-500',
    default: 'bg-slate-400'
  };

  const normalizedStatus = (status || 'default').toLowerCase();
  const style = statusStyles[normalizedStatus] || statusStyles.default;
  const dotStyle = dots[normalizedStatus] || dots.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />}
      {children}
    </span>
  );
};
