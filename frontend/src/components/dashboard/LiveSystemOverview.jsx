import React from 'react';
import { ShieldCheck, Zap, Cpu, Workflow, Bell, Activity } from 'lucide-react';

export const LiveSystemOverview = ({ devices = [], pipelines = [], alerts = [], throughput = '5,240' }) => {
  const onlineDevicesCount = devices.filter(d => d.status === 'Online').length;
  const activePipelines = pipelines.filter(p => p.status === 'Running');
  const activeAlerts = alerts.filter(a => a.status === 'Active');
  
  // Calculate total rule nodes across active pipelines
  const activeRulesCount = activePipelines.reduce((acc, p) => {
    const nodes = p.nodes || [];
    return acc + nodes.length;
  }, 0);

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Accent Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-600" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">Live System Overview</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time operational control & telemetry streaming engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SLA Operational Status:</span>
          <span className="text-emerald-400 font-bold">99.98% Uptime</span>
        </div>
      </div>

      {/* Grid of 5 Overview Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
        {/* Metric 1: System Status */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">System Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Operational
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">0 degraded services</span>
          </div>
        </div>

        {/* Metric 2: Messages / sec */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Messages / Sec</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-cyan-400">{throughput}</span>
            <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">+12.4% network band</span>
          </div>
        </div>

        {/* Metric 3: Connected Devices */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Connected Devices</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-slate-100">
              {onlineDevicesCount} <span className="text-xs font-normal text-slate-400">/ {devices.length || 5}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              {((onlineDevicesCount / (devices.length || 1)) * 100).toFixed(0)}% reach rate
            </span>
          </div>
        </div>

        {/* Metric 4: Active Rules */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Active Rules</span>
            <Workflow className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-emerald-400">{activeRulesCount || 12}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              Across {activePipelines.length || 2} running pipelines
            </span>
          </div>
        </div>

        {/* Metric 5: Current Alerts */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Current Alerts</span>
            <Bell className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className={`text-xl font-black font-mono ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeAlerts.length}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              {activeAlerts.filter(a => a.severity === 'Critical').length} critical issue(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
