import React from 'react';

export const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'cyan' }) => {
  const colorStyles = {
    cyan: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/40 shadow-cyan-500/10',
    emerald: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10',
    amber: 'bg-amber-950/40 text-amber-400 border-amber-500/40 shadow-amber-500/10',
    rose: 'bg-rose-950/40 text-rose-400 border-rose-500/40 shadow-rose-500/10',
    blue: 'bg-blue-950/40 text-blue-400 border-blue-500/40 shadow-blue-500/10',
  };

  const accentGlow = {
    cyan: 'from-cyan-500 to-blue-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-red-500',
    blue: 'from-blue-500 to-cyan-500',
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all relative overflow-hidden group backdrop-blur-md">
      {/* Accent Glowing Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentGlow[color] || accentGlow.cyan}`} />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${colorStyles[color] || colorStyles.cyan}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl md:text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isPositive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {change}
            </span>
            <span className="text-slate-500 text-[11px]">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};
