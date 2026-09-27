import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ShieldAlert, GitCommit } from 'lucide-react';

export const ThresholdNode = memo(({ data, selected }) => {
  const operator = data?.config?.operator || '>';
  const value = data?.config?.value ?? 80;

  return (
    <div className={`w-60 bg-slate-950/90 border-2 ${
      selected ? 'border-amber-400 shadow-xl shadow-amber-500/30' : 'border-amber-500/40'
    } rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all relative`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-950 !left-[-7px] shadow-md shadow-amber-400"
      />

      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-400 shadow-sm shadow-amber-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 block">{data?.title || 'Threshold'}</span>
            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">RULE BOUNDARY</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">RULE:</span>
          <span className="text-amber-300 font-extrabold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[12px]">
            {operator} {value}°C
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">HYSTERESIS:</span>
          <span className="text-slate-400">0.5 Delta</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-950 !right-[-7px] shadow-md shadow-amber-400"
      />
    </div>
  );
});

ThresholdNode.displayName = 'ThresholdNode';
