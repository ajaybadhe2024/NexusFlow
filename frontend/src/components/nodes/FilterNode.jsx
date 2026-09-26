import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sliders } from 'lucide-react';

export const FilterNode = memo(({ data, selected }) => {
  const mode = data?.config?.mode || 'High-Pass';
  const cutoff = data?.config?.cutoff || 5.0;

  return (
    <div className={`w-56 bg-slate-900 border-2 ${
      selected ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-slate-800'
    } rounded-xl p-3.5 shadow-2xl transition-all`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-purple-500 border-2 border-slate-900 !left-[-6px]"
      />

      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-700 text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100">{data?.title || 'Filter'}</span>
        </div>
        <span className="text-[10px] text-purple-400 font-mono font-bold">Signal</span>
      </div>

      <div className="space-y-1 text-[11px] font-mono text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Mode:</span>
          <span className="text-purple-300 font-bold">{mode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Cutoff:</span>
          <span className="text-slate-300">{cutoff}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-purple-500 border-2 border-slate-900 !right-[-6px]"
      />
    </div>
  );
});

FilterNode.displayName = 'FilterNode';
