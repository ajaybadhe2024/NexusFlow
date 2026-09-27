import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitFork } from 'lucide-react';

export const ConditionNode = memo(({ data, selected }) => {
  const logicType = data?.config?.logicType || 'AND';

  return (
    <div className={`w-56 bg-slate-900 border-2 ${
      selected ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-800'
    } rounded-xl p-3.5 shadow-2xl transition-all`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 !left-[-6px]"
      />

      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-400">
            <GitFork className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100">{data?.title || 'Condition'}</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-bold">Logic</span>
      </div>

      <div className="space-y-1 text-[11px] font-mono text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Gate:</span>
          <span className="text-emerald-300 font-bold">{logicType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Branching:</span>
          <span className="text-slate-400">Dual Out</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 !right-[-6px]"
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';
