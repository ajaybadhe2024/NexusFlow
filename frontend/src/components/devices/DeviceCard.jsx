import React from 'react';
import { Cpu, MapPin, Activity, Clock, Eye, Edit3, Power, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const DeviceCard = ({ device, onView, onEdit, onToggleStatus, onDelete }) => {
  const isOffline = device.status === 'Offline';
  const readingStr = device.temperature
    ? `${device.temperature}°C`
    : device.pressure
    ? `${device.pressure} PSI`
    : device.vibration
    ? `${device.vibration} mm/s`
    : device.rpm
    ? `${device.rpm} RPM`
    : 'N/A';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-100 truncate">{device.name}</h3>
              <span className="text-[11px] font-mono font-bold text-cyan-400">{device.id}</span>
            </div>
          </div>
          <Badge status={device.status}>{device.status}</Badge>
        </div>

        <div className="space-y-2.5 my-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Type:</span>
            <span className="text-slate-200 font-medium">{device.type}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Location:
            </span>
            <span className="text-slate-200 font-medium">{device.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Reading:
            </span>
            <span className="font-mono text-cyan-400 font-bold">{readingStr}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Last Seen:
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{device.lastSeen}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => onView && onView(device)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit && onEdit(device)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950 hover:text-amber-400 text-slate-400 transition-colors"
            title="Edit device"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleStatus && onToggleStatus(device.id)}
            className={`p-1.5 rounded-lg bg-slate-800 transition-colors ${
              isOffline 
                ? 'hover:bg-emerald-950 hover:text-emerald-400 text-slate-400' 
                : 'hover:bg-amber-950 hover:text-amber-400 text-slate-400'
            }`}
            title={isOffline ? 'Enable device' : 'Disable device'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete && onDelete(device.id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
            title="Delete device"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
