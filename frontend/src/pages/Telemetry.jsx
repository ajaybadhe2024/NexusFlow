import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, Cpu, Play, Pause, Filter } from 'lucide-react';
import { deviceService } from '../services/deviceService';
import { telemetryService } from '../services/telemetryService';
import { MetricCard } from '../components/telemetry/MetricCard';
import { TelemetryChart } from '../components/telemetry/TelemetryChart';
import { Button } from '../components/common/Button';

export const Telemetry = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDeviceId = searchParams.get('device') || 'TRB-001';

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId);
  
  // Requirement 2: Metric Selector
  const [selectedMetricFilter, setSelectedMetricFilter] = useState('all');

  // Requirement 3: Time Range (1m, 5m, 15m, 1h)
  const [timeRange, setTimeRange] = useState('15m');

  // Requirement 4: Live / Pause Control
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setDevices(deviceService.getDevices());
  }, []);

  useEffect(() => {
    // Load initial historical dataset for chosen device & time range
    const history = telemetryService.getTelemetryHistory(selectedDeviceId, timeRange);
    setChartData(history);

    // Subscribe to live telemetry feed tick
    const unsubscribe = telemetryService.subscribeLiveTelemetry((payload) => {
      // Requirement 4: Pause/Live Check
      if (!isLiveStreaming) return;

      const devState = payload.devices[selectedDeviceId];
      if (devState) {
        setChartData(prev => {
          const next = [...prev.slice(1), {
            time: payload.timestamp,
            temperature: devState.temp,
            pressure: devState.press,
            vibration: devState.vib,
            rpm: devState.rpm,
            threshold: 80
          }];
          return next;
        });
      }
    });

    return () => unsubscribe();
  }, [selectedDeviceId, timeRange, isLiveStreaming]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || {
    id: selectedDeviceId,
    name: 'Turbine Sensor #01',
    location: 'Factory Floor A'
  };

  // Requirement 5 & 6: Compute live stats for Current, Min, Max, Avg, Threshold
  const temps = chartData.map(d => d.temperature || 0);
  const currentTemp = temps[temps.length - 1] || 78.4;
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : 78.2;
  const minTemp = temps.length ? Math.min(...temps) : 70.1;
  const maxTemp = temps.length ? Math.max(...temps) : 86.4;

  const pressList = chartData.map(d => d.pressure || 0);
  const currentPress = pressList[pressList.length - 1] || 45.2;
  const avgPress = pressList.length ? (pressList.reduce((a, b) => a + b, 0) / pressList.length).toFixed(1) : 42.5;
  const minPress = pressList.length ? Math.min(...pressList) : 38.0;
  const maxPress = pressList.length ? Math.max(...pressList) : 58.0;

  const vibList = chartData.map(d => d.vibration || 0);
  const currentVib = vibList[vibList.length - 1] || 2.1;
  const avgVib = vibList.length ? (vibList.reduce((a, b) => a + b, 0) / vibList.length).toFixed(1) : 2.4;
  const minVib = vibList.length ? Math.min(...vibList) : 0.8;
  const maxVib = vibList.length ? Math.max(...vibList) : 7.2;

  const rpmList = chartData.map(d => d.rpm || 0);
  const currentRpm = rpmList[rpmList.length - 1] || 3450;
  const avgRpm = rpmList.length ? Math.round(rpmList.reduce((a, b) => a + b, 0) / rpmList.length) : 3400;
  const minRpm = rpmList.length ? Math.min(...rpmList) : 2900;
  const maxRpm = rpmList.length ? Math.max(...rpmList) : 3800;

  // Metric cards definitions
  const allMetricCards = [
    {
      id: 'temperature',
      title: 'Temperature',
      currentValue: currentTemp,
      unit: '°C',
      avg: avgTemp,
      min: minTemp,
      max: maxTemp,
      threshold: 80,
      color: 'cyan',
      dataKey: 'temperature',
      chartColor: '#06b6d4',
      chartTitle: 'Temperature (°C)'
    },
    {
      id: 'pressure',
      title: 'Pressure',
      currentValue: currentPress,
      unit: 'PSI',
      avg: avgPress,
      min: minPress,
      max: maxPress,
      threshold: 60,
      color: 'amber',
      dataKey: 'pressure',
      chartColor: '#f59e0b',
      chartTitle: 'Pressure (PSI)'
    },
    {
      id: 'vibration',
      title: 'Vibration',
      currentValue: currentVib,
      unit: 'mm/s',
      avg: avgVib,
      min: minVib,
      max: maxVib,
      threshold: 5.0,
      color: 'rose',
      dataKey: 'vibration',
      chartColor: '#f43f5e',
      chartTitle: 'Vibration Amplitude (mm/s)'
    },
    {
      id: 'rpm',
      title: 'Rotation Speed',
      currentValue: currentRpm,
      unit: 'RPM',
      avg: avgRpm,
      min: minRpm,
      max: maxRpm,
      threshold: 4500,
      color: 'emerald',
      dataKey: 'rpm',
      chartColor: '#10b981',
      chartTitle: 'Rotational Speed (RPM)'
    }
  ];

  // Filtered Cards & Charts based on Metric Selector
  const visibleMetrics = selectedMetricFilter === 'all'
    ? allMetricCards
    : allMetricCards.filter(m => m.id === selectedMetricFilter);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Live Stream Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
            Real-time Telemetry Monitor
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Monitoring sensor payload streams for <span className="text-cyan-400 font-semibold">{selectedDevice.name}</span> ({selectedDevice.id}).
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Requirement 1: Device Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                setSearchParams({ device: e.target.value });
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none font-mono cursor-pointer"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                  {d.id} ({d.name})
                </option>
              ))}
            </select>
          </div>

          {/* Requirement 2: Metric Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMetricFilter}
              onChange={(e) => setSelectedMetricFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none font-mono cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Metrics</option>
              <option value="temperature" className="bg-slate-900 text-slate-200">Temperature (°C)</option>
              <option value="pressure" className="bg-slate-900 text-slate-200">Pressure (PSI)</option>
              <option value="vibration" className="bg-slate-900 text-slate-200">Vibration (mm/s)</option>
              <option value="rpm" className="bg-slate-900 text-slate-200">Rotation Speed (RPM)</option>
            </select>
          </div>

          {/* Requirement 3: Time Range Selector (1m, 5m, 15m, 1h) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: '1m', label: '1m' },
              { id: '5m', label: '5m' },
              { id: '15m', label: '15m' },
              { id: '1h', label: '1h' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                  timeRange === range.id 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Requirement 4: Live / Pause Control */}
          <Button
            variant={isLiveStreaming ? 'success' : 'outline'}
            size="sm"
            icon={isLiveStreaming ? Pause : Play}
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          >
            {isLiveStreaming ? 'Pause Feed' : 'Resume Live'}
          </Button>
        </div>
      </div>

      {/* Requirement 5 & 6: Telemetry Metric Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${visibleMetrics.length === 1 ? 'lg:grid-cols-1 max-w-lg mx-auto' : 'lg:grid-cols-4'} gap-4`}>
        {visibleMetrics.map((m) => (
          <MetricCard
            key={m.id}
            title={m.title}
            currentValue={m.currentValue}
            unit={m.unit}
            avg={m.avg}
            min={m.min}
            max={m.max}
            threshold={m.threshold}
            color={m.color}
          />
        ))}
      </div>

      {/* Requirement 7: Telemetry Charts Grid */}
      <div className={`grid grid-cols-1 ${visibleMetrics.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
        {visibleMetrics.map((m) => (
          <TelemetryChart
            key={m.id}
            title={m.chartTitle}
            data={chartData}
            dataKey={m.dataKey}
            color={m.chartColor}
            threshold={m.threshold}
            unit={m.unit}
            isLive={isLiveStreaming}
          />
        ))}
      </div>
    </div>
  );
};
