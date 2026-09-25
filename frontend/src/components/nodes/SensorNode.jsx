import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity, Radio, Cpu } from 'lucide-react';

export const SensorNode = memo(({ data, selected }) => {
  const device = data?.device || 'TRB-001';
  const metric = data?.metric || 'Temperature';
  const rate = data?.samplingRate || '1s';

  return (
    <div className={`w-60 bg-slate-950/90 border-2 ${
      selected ? 'border-cyan-400 shadow-xl shadow-cyan-500/30' : 'border-cyan-500/40'
    } rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all relative group`}>
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 block">{data?.title || 'Turbine Sensor'}</span>
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">DATA SOURCE</span>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
      </div>

      <div className="space-y-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">DEVICE ID:</span>
          <span className="text-cyan-400 font-extrabold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[11px]">{device}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">METRIC:</span>
          <span className="text-slate-200 font-semibold">{metric}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-[10px]">RATE:</span>
          <span className="text-slate-400">{rate}</span>
        </div>
      </div>

      {/* Output handle on right */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 bg-cyan-400 border-2 border-slate-950 !right-[-7px] shadow-md shadow-cyan-400"
      />
    </div>
  );
});

SensorNode.displayName = 'SensorNode';
