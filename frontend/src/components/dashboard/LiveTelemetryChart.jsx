import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';
import { Thermometer, Gauge, Activity, RotateCw, Radio } from 'lucide-react';
import { telemetryService } from '../../services/telemetryService';
import { deviceService } from '../../services/deviceService';

export const LiveTelemetryChart = () => {
  const [selectedDevice, setSelectedDevice] = useState('TRB-001');
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [data, setData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [currentReadouts, setCurrentReadouts] = useState({
    temp: 78.4,
    press: 45.2,
    vib: 2.1,
    rpm: 3450
  });

  useEffect(() => {
    setDevices(deviceService.getDevices());

    // Initial historical data setup
    const initial = telemetryService.getTelemetryHistory(selectedDevice, '15m');
    setData(initial);

    // Live subscription setup
    const unsubscribe = telemetryService.subscribeLiveTelemetry((payload) => {
      const deviceMetrics = payload.devices[selectedDevice] || { temp: 78.4, press: 45.2, vib: 2.1, rpm: 3450 };
      
      setCurrentReadouts({
        temp: deviceMetrics.temp,
        press: deviceMetrics.press,
        vib: deviceMetrics.vib,
        rpm: deviceMetrics.rpm
      });

      setData(prev => {
        const nextTime = payload.timestamp;
        const newPoint = {
          time: nextTime,
          temperature: deviceMetrics.temp,
          pressure: deviceMetrics.press,
          vibration: deviceMetrics.vib,
          rpm: deviceMetrics.rpm,
          threshold: activeMetric === 'temperature' ? 80 : activeMetric === 'pressure' ? 60 : activeMetric === 'vibration' ? 5.0 : 4000
        };
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    });

    return () => unsubscribe();
  }, [selectedDevice, activeMetric]);

  const metricsConfig = {
    temperature: {
      label: 'Temperature',
      unit: '°C',
      dataKey: 'temperature',
      color: '#06b6d4',
      bgGradientId: 'tempGradient',
      threshold: 80,
      domain: [50, 100],
      icon: Thermometer,
      currentVal: `${currentReadouts.temp}°C`,
      isWarning: currentReadouts.temp > 80
    },
    pressure: {
      label: 'Pressure',
      unit: 'PSI',
      dataKey: 'pressure',
      color: '#3b82f6',
      bgGradientId: 'pressGradient',
      threshold: 60,
      domain: [20, 80],
      icon: Gauge,
      currentVal: `${currentReadouts.press} PSI`,
      isWarning: currentReadouts.press > 60
    },
    vibration: {
      label: 'Vibration',
      unit: 'mm/s',
      dataKey: 'vibration',
      color: '#f59e0b',
      bgGradientId: 'vibGradient',
      threshold: 5.0,
      domain: [0, 10],
      icon: Activity,
      currentVal: `${currentReadouts.vib} mm/s`,
      isWarning: currentReadouts.vib > 5.0
    },
    rpm: {
      label: 'RPM',
      unit: 'RPM',
      dataKey: 'rpm',
      color: '#10b981',
      bgGradientId: 'rpmGradient',
      threshold: 4000,
      domain: [1000, 5000],
      icon: RotateCw,
      currentVal: `${currentReadouts.rpm?.toLocaleString()} RPM`,
      isWarning: currentReadouts.rpm > 4000
    }
  };

  const activeConfig = metricsConfig[activeMetric];

  return (
    <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col h-full backdrop-blur-md relative overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              Compact Live Telemetry Streams
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-700/60 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            High-frequency sensor stream readouts for Temperature, Pressure, Vibration & RPM
          </p>
        </div>

        {/* Device Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Device:</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>
                {d.id} ({d.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Metric Selector Cards Bar (Temperature, Pressure, Vibration, RPM) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {Object.entries(metricsConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isSelected = activeMetric === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {cfg.label}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={`text-base font-extrabold font-mono ${cfg.isWarning ? 'text-rose-400' : isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {cfg.currentVal}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{cfg.unit}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Responsive Area Chart */}
      <div className="w-full h-56 md:h-64 flex-1 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={activeConfig.bgGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis domain={activeConfig.domain} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: activeConfig.color,
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f8fafc',
                fontFamily: 'monospace'
              }}
            />
            <ReferenceLine
              y={activeConfig.threshold}
              label={{ 
                value: `LIMIT ${activeConfig.threshold} ${activeConfig.unit}`, 
                fill: '#f43f5e', 
                fontSize: 10, 
                position: 'insideTopRight', 
                fontFamily: 'monospace' 
              }}
              stroke="#f43f5e"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey={activeConfig.dataKey}
              stroke={activeConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${activeConfig.bgGradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
