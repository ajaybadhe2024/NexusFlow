import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calculator } from 'lucide-react';

export const MathNode = memo(({ data, selected }) => {
  const operation = data?.config?.operation || 'Multiply (*)';
  const factor = data?.config?.factor || 1.8;

  return (
    <div className={`w-56 bg-slate-900 border-2 ${
      selected ? 'border-sky-500 shadow-lg shadow-sky-500/20' : 'border-slate-800'
    } rounded-xl p-3.5 shadow-2xl transition-all`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-sky-500 border-2 border-slate-900 !left-[-6px]"
      />

      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-700 text-sky-400">
            <Calculator className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100">{data?.title || 'Math Operation'}</span>
        </div>
        <span className="text-[10px] text-sky-400 font-mono font-bold">Math</span>
      </div>

      <div className="space-y-1 text-[11px] font-mono text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">Operation:</span>
          <span className="text-sky-300 font-bold">{operation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Factor:</span>
          <span className="text-slate-300">{factor}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-sky-500 border-2 border-slate-900 !right-[-6px]"
      />
    </div>
  );
});

MathNode.displayName = 'MathNode';
