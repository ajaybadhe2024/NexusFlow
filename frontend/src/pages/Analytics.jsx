import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  Flame 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');

  // Dynamic analytics datasets mapped by timeframe
  const analyticsDatasets = {
    '24h': {
      summary: {
        avgThroughput: '5,120 msgs/s',
        totalAlerts: '34',
        totalRuleExecutions: '8,420',
        avgTemp: '74.8 °C',
        peakTemp: '83.2 °C'
      },
      tempTrends: [
        { label: '00:00', avgTemp: 71.2, maxTemp: 76.5 },
        { label: '04:00', avgTemp: 70.8, maxTemp: 75.1 },
        { label: '08:00', avgTemp: 74.4, maxTemp: 80.2 },
        { label: '12:00', avgTemp: 78.9, maxTemp: 83.2 },
        { label: '16:00', avgTemp: 76.5, maxTemp: 81.8 },
        { label: '20:00', avgTemp: 73.1, maxTemp: 77.9 }
      ],
      throughputData: [
        { time: '00:00', msgs: 4200 },
        { time: '04:00', msgs: 3900 },
        { time: '08:00', msgs: 5800 },
        { time: '12:00', msgs: 7100 },
        { time: '16:00', msgs: 6400 },
        { time: '20:00', msgs: 4800 }
      ],
      alertDistribution: [
        { name: 'Temperature Exceeded', value: 14, color: '#f43f5e' },
        { name: 'Vibration Spike', value: 8, color: '#f59e0b' },
        { name: 'Pressure Drop', value: 7, color: '#06b6d4' },
        { name: 'Network Latency', value: 5, color: '#8b5cf6' }
      ],
      pipelineExecutionData: [
        { name: 'Turbine Temp Monitor', count: 2840 },
        { name: 'Vibration Anomaly', count: 1950 },
        { name: 'Pressure Monitoring', count: 2410 },
        { name: 'Hydraulic Guard', count: 1220 }
      ]
    },
    '7d': {
      summary: {
        avgThroughput: '5,420 msgs/s',
        totalAlerts: '142',
        totalRuleExecutions: '58,940',
        avgTemp: '76.2 °C',
        peakTemp: '88.0 °C'
      },
      tempTrends: [
        { label: 'Mon', avgTemp: 74.2, maxTemp: 82.5 },
        { label: 'Tue', avgTemp: 76.8, maxTemp: 85.1 },
        { label: 'Wed', avgTemp: 78.4, maxTemp: 86.4 },
        { label: 'Thu', avgTemp: 75.1, maxTemp: 81.0 },
        { label: 'Fri', avgTemp: 79.2, maxTemp: 88.0 },
        { label: 'Sat', avgTemp: 73.5, maxTemp: 79.8 },
        { label: 'Sun', avgTemp: 72.9, maxTemp: 78.4 }
      ],
      throughputData: [
        { time: 'Mon', msgs: 4800 },
        { time: 'Tue', msgs: 5300 },
        { time: 'Wed', msgs: 6100 },
        { time: 'Thu', msgs: 5400 },
        { time: 'Fri', msgs: 6900 },
        { time: 'Sat', msgs: 4600 },
        { time: 'Sun', msgs: 4300 }
      ],
      alertDistribution: [
        { name: 'Temperature Exceeded', value: 58, color: '#f43f5e' },
        { name: 'Vibration Spike', value: 34, color: '#f59e0b' },
        { name: 'Pressure Drop', value: 30, color: '#06b6d4' },
        { name: 'Network Latency', value: 20, color: '#8b5cf6' }
      ],
      pipelineExecutionData: [
        { name: 'Turbine Temp Monitor', count: 18400 },
        { name: 'Vibration Anomaly', count: 12800 },
        { name: 'Pressure Monitoring', count: 16900 },
        { name: 'Hydraulic Guard', count: 10840 }
      ]
    },
    '30d': {
      summary: {
        avgThroughput: '5,680 msgs/s',
        totalAlerts: '485',
        totalRuleExecutions: '245,100',
        avgTemp: '75.4 °C',
        peakTemp: '91.5 °C'
      },
      tempTrends: [
        { label: 'Week 1', avgTemp: 73.8, maxTemp: 84.0 },
        { label: 'Week 2', avgTemp: 77.2, maxTemp: 89.4 },
        { label: 'Week 3', avgTemp: 76.5, maxTemp: 91.5 },
        { label: 'Week 4', avgTemp: 74.1, maxTemp: 82.8 }
      ],
      throughputData: [
        { time: 'Week 1', msgs: 5100 },
        { time: 'Week 2', msgs: 5800 },
        { time: 'Week 3', msgs: 6200 },
        { time: 'Week 4', msgs: 5600 }
      ],
      alertDistribution: [
        { name: 'Temperature Exceeded', value: 195, color: '#f43f5e' },
        { name: 'Vibration Spike', value: 120, color: '#f59e0b' },
        { name: 'Pressure Drop', value: 105, color: '#06b6d4' },
        { name: 'Network Latency', value: 65, color: '#8b5cf6' }
      ],
      pipelineExecutionData: [
        { name: 'Turbine Temp Monitor', count: 78500 },
        { name: 'Vibration Anomaly', count: 54200 },
        { name: 'Pressure Monitoring', count: 68900 },
        { name: 'Hydraulic Guard', count: 43500 }
      ]
    },
    '90d': {
      summary: {
        avgThroughput: '6,100 msgs/s',
        totalAlerts: '1,320',
        totalRuleExecutions: '780,500',
        avgTemp: '74.9 °C',
        peakTemp: '94.2 °C'
      },
      tempTrends: [
        { label: 'Month 1', avgTemp: 73.1, maxTemp: 86.4 },
        { label: 'Month 2', avgTemp: 75.9, maxTemp: 92.1 },
        { label: 'Month 3', avgTemp: 75.7, maxTemp: 94.2 }
      ],
      throughputData: [
        { time: 'Month 1', msgs: 5400 },
        { time: 'Month 2', msgs: 6300 },
        { time: 'Month 3', msgs: 6600 }
      ],
      alertDistribution: [
        { name: 'Temperature Exceeded', value: 520, color: '#f43f5e' },
        { name: 'Vibration Spike', value: 340, color: '#f59e0b' },
        { name: 'Pressure Drop', value: 290, color: '#06b6d4' },
        { name: 'Network Latency', value: 170, color: '#8b5cf6' }
      ],
      pipelineExecutionData: [
        { name: 'Turbine Temp Monitor', count: 248000 },
        { name: 'Vibration Anomaly', count: 172000 },
        { name: 'Pressure Monitoring', count: 218000 },
        { name: 'Hydraulic Guard', count: 142500 }
      ]
    }
  };

  const currentData = analyticsDatasets[dateRange] || analyticsDatasets['7d'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-cyan-400" /> Infrastructure Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical telemetry trends, system throughput, and rule execution efficiency.
          </p>
        </div>

        {/* Date range picker */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          {['24h', '7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                dateRange === r ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Throughput</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">{currentData.summary.avgThroughput}</div>
          <span className="text-[10px] text-slate-500">Live telemetry velocity</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Alerts</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">{currentData.summary.totalAlerts}</div>
          <span className="text-[10px] text-slate-500">Across operational nodes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rule Executions</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">{currentData.summary.totalRuleExecutions}</div>
          <span className="text-[10px] text-slate-500">Active rule evaluations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Temp</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">{currentData.summary.avgTemp}</div>
          <span className="text-[10px] text-slate-500">Mean thermal state</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Peak Temp</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-100">{currentData.summary.peakTemp}</div>
          <span className="text-[10px] text-slate-500">Maximum recorded breach</span>
        </div>
      </div>

      {/* Grid 1: Temperature Trends & Telemetry Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Temperature Trends (°C)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.tempTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="avgTemp" stroke="#06b6d4" strokeWidth={2} name="Avg Temp" />
                <Line type="monotone" dataKey="maxTemp" stroke="#f43f5e" strokeWidth={2} name="Max Peak" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Telemetry Throughput (Msgs / Sec)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="msgs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Alert Categories & Pipeline Executions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Alert Distribution by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentData.alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Total Rule Executions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.pipelineExecutionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

