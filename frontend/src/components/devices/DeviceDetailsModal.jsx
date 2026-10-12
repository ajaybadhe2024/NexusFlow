import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Cpu, MapPin, Activity, Clock, Radio, Thermometer, Gauge, RotateCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeviceDetailsModal = ({ isOpen, onClose, device }) => {
  const navigate = useNavigate();

  if (!device) return null;

  const handleOpenTelemetry = () => {
    onClose();
    navigate(`/telemetry?device=${device.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Device Telemetry & Specs" maxWidth="max-w-xl">
      <div className="space-y-5">
        {/* Device Header Info Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-100 truncate">{device.name}</h3>
                <Badge status={device.status}>{device.status}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">{device.id}</span>
                <span>•</span>
                <span>{device.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Readout Grid */}
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Telemetry Readouts
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                <span>TEMP</span>
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-1.5 text-lg font-black font-mono text-cyan-400">
                {device.temperature ? `${device.temperature}°C` : 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                <span>PRESSURE</span>
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="mt-1.5 text-lg font-black font-mono text-blue-400">
                {device.pressure ? `${device.pressure} PSI` : 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                <span>VIBRATION</span>
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-1.5 text-lg font-black font-mono text-amber-400">
                {device.vibration ? `${device.vibration} mm/s` : 'N/A'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                <span>RPM</span>
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-1.5 text-lg font-black font-mono text-emerald-400">
                {device.rpm ? device.rpm.toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Metadata Details */}
        <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" /> Factory Location:
            </span>
            <span className="font-semibold text-slate-100">{device.location}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Last Telemetry Heartbeat:
            </span>
            <span className="font-mono text-slate-300">{device.lastSeen || 'Just now'}</span>
          </div>

          {device.description && (
            <div className="pt-2">
              <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-slate-400" /> Operational Notes:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                {device.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={Radio} onClick={handleOpenTelemetry}>
            View Live Telemetry Stream
          </Button>
        </div>
      </div>
    </Modal>
  );
};
