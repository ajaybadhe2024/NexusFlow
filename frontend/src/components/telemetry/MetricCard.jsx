import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

export const MetricCard = ({ title, currentValue, unit, avg, min, max, threshold, color = 'cyan' }) => {
  const isBreached = threshold && Number(currentValue) >= Number(threshold);

  const colorMap = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
  };

  const breachedStyles = 'border-rose-500/90 bg-rose-950/50 text-rose-400 shadow-lg shadow-rose-500/10 animate-pulse';

  return (
    <div className={`p-5 rounded-2xl border bg-slate-900 shadow-xl flex flex-col justify-between transition-all relative overflow-hidden backdrop-blur-md ${
      isBreached ? breachedStyles : colorMap[color] || colorMap.cyan
    }`}>
      {/* Top Accent line if breached */}
      {isBreached && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 animate-ping" />
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">{title}</span>
        {isBreached ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
        ) : (
          <Activity className="w-4 h-4 text-slate-400" />
        )}
      </div>

      <div className="my-2">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black font-mono tracking-tight text-slate-100">
            {currentValue} <span className="text-xs font-normal font-sans text-slate-400">{unit}</span>
          </div>

          {isBreached && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800 uppercase tracking-widest shrink-0">
              BREACHED
            </span>
          )}
        </div>

        {threshold && (
          <div className="text-[11px] font-mono mt-1.5 flex items-center justify-between">
            <span className="text-slate-400">Limit Boundary:</span>
            <span className={isBreached ? 'text-rose-400 font-bold' : 'text-slate-300'}>
              {threshold} {unit}
            </span>
          </div>
        )}
      </div>

      {/* Stats Breakdown: AVG, MIN, MAX */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 text-center bg-slate-950/60 p-2 rounded-xl">
        <div>
          <span className="text-[9px] text-slate-500 block uppercase tracking-wider">AVG</span>
          <span className="text-slate-200 font-semibold">{avg} {unit}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block uppercase tracking-wider">MIN</span>
          <span className="text-slate-200 font-semibold">{min} {unit}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block uppercase tracking-wider">MAX</span>
          <span className="text-slate-200 font-semibold">{max} {unit}</span>
        </div>
      </div>
    </div>
  );
};
