import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TrendingUp, BarChart2 } from 'lucide-react';

export const MovingAverageNode = memo(({ data, selected }) => {
  const windowSize = data?.config?.windowSize || 10;

  return (
    <div className={`w-60 bg-slate-950/90 border-2 ${
      selected ? 'border-purple-400 shadow-xl shadow-purple-500/30' : 'border-purple-500/40'
    } rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all relative`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 bg-purple-400 border-2 border-slate-950 !left-[-7px] shadow-md shadow-purple-400"
      />

      <div className="flex items-center justify-between border-b border-purple-500/20 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-400 shadow-sm shadow-purple-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 block">{data?.title || 'Moving Average'}</span>
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider">PROCESSING</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">WINDOW:</span>
          <span className="text-purple-300 font-extrabold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[11px]">{windowSize} samples</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">ALGORITHM:</span>
          <span className="text-slate-300 font-semibold">Simple SMA</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 bg-purple-400 border-2 border-slate-950 !right-[-7px] shadow-md shadow-purple-400"
      />
    </div>
  );
});

MovingAverageNode.displayName = 'MovingAverageNode';
