import React from 'react';
import { Badge } from '../common/Badge';
import { Eye, Edit3, Power, Trash2, Activity } from 'lucide-react';

export const DeviceTable = ({ devices, onView, onEdit, onToggleStatus, onDelete }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Device ID</th>
              <th className="py-3.5 px-4">Device Name</th>
              <th className="py-3.5 px-4">Device Type</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Last Seen</th>
              <th className="py-3.5 px-4">Current Reading</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {devices.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-500 font-mono text-xs">
                  No matching IoT devices found.
                </td>
              </tr>
            ) : (
              devices.map((d) => {
                // Determine readout format based on device metrics
                const readingStr = d.temperature
                  ? `${d.temperature}°C`
                  : d.pressure
                  ? `${d.pressure} PSI`
                  : d.vibration
                  ? `${d.vibration} mm/s`
                  : d.rpm
                  ? `${d.rpm} RPM`
                  : 'N/A';

                const isOffline = d.status === 'Offline';

                return (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{d.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{d.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{d.type}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={d.status}>{d.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{d.location}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{d.lastSeen}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {readingStr}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onView && onView(d)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-400 text-slate-300 transition-colors"
                          title="View device telemetry details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(d)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950 hover:text-amber-400 text-slate-300 transition-colors"
                          title="Edit device configuration"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(d.id)}
                          className={`p-1.5 rounded-lg bg-slate-800 transition-colors ${
                            isOffline 
                              ? 'hover:bg-emerald-950 hover:text-emerald-400 text-slate-400' 
                              : 'hover:bg-amber-950 hover:text-amber-400 text-slate-300'
                          }`}
                          title={isOffline ? 'Enable device (Set Online)' : 'Disable device (Set Offline)'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(d.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
