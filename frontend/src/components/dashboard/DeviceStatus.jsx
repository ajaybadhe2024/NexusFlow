import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const DeviceStatus = ({ devices = [] }) => {
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const warningCount = devices.filter(d => d.status === 'Warning').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Device Health Overview
          </h3>
          <span className="text-xs text-slate-400 font-mono">{devices.length} Total</span>
        </div>

        {/* Status Breakdown Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex gap-0.5 my-3">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(onlineCount / (devices.length || 1)) * 100}%` }} title="Online" />
          <div className="bg-amber-500 h-full transition-all" style={{ width: `${(warningCount / (devices.length || 1)) * 100}%` }} title="Warning" />
          <div className="bg-rose-500 h-full transition-all" style={{ width: `${(offlineCount / (devices.length || 1)) * 100}%` }} title="Offline" />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Online</span>
            <span className="text-lg font-bold text-emerald-400">{onlineCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Warning</span>
            <span className="text-lg font-bold text-amber-400">{warningCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Offline</span>
            <span className="text-lg font-bold text-rose-400">{offlineCount}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
        {devices.slice(0, 3).map((device) => (
          <div key={device.id} className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-slate-400 text-[11px]">{device.id}</span>
              <span className="text-slate-200 font-medium truncate">{device.name}</span>
            </div>
            <Badge status={device.status}>{device.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
