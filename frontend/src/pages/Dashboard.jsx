import React, { useState, useEffect } from 'react';
import { Cpu, Workflow, Zap, Bell, ShieldCheck, Plus, ArrowRight, Radio, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePipeline } from '../context/PipelineContext';
import { deviceService } from '../services/deviceService';
import { alertService } from '../services/alertService';
import { StatCard } from '../components/dashboard/StatCard';
import { LiveSystemOverview } from '../components/dashboard/LiveSystemOverview';
import { LiveTelemetryChart } from '../components/dashboard/LiveTelemetryChart';
import { DeviceStatus } from '../components/dashboard/DeviceStatus';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';
import { PipelineStatus } from '../components/dashboard/PipelineStatus';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Dashboard = () => {
  const { user } = useAuth();
  const { pipelines } = usePipeline();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    setDevices(deviceService.getDevices());
    setAlerts(alertService.getAlerts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolveAlert = (id) => {
    alertService.resolveAlert(id);
    loadData();
    setToastMessage('Alert marked as resolved.');
  };

  const activePipelinesCount = pipelines.filter(p => p.status === 'Running').length;
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const onlineDevicesCount = devices.filter(d => d.status === 'Online').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Dashboard Top Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" /> Operational Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
            Welcome back, <span className="text-cyan-400">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Centralized monitoring, live telemetry stream evaluation, and pipeline rule management.
          </p>
        </div>

        {/* Requirement 6: Quick-Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/devices?action=add')}
          >
            Add Device
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Workflow}
            onClick={() => navigate('/pipelines/new')}
          >
            Create Pipeline
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Bell}
            onClick={() => navigate('/alerts')}
          >
            View Alerts
          </Button>

          <Link to="/telemetry" className="hidden sm:inline-block">
            <Button variant="outline" size="sm" icon={Radio}>
              Live Telemetry
            </Button>
          </Link>
        </div>
      </div>

      {/* Requirement 1: Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Devices"
          value={devices.length || 5}
          change={`${onlineDevicesCount} online`}
          isPositive={true}
          icon={Cpu}
          color="cyan"
        />
        <StatCard
          title="Active Devices"
          value={onlineDevicesCount || 4}
          change={`${devices.length - onlineDevicesCount} warning/offline`}
          isPositive={onlineDevicesCount === devices.length}
          icon={Cpu}
          color="emerald"
        />
        <StatCard
          title="Telemetry Throughput"
          value="5,240 msg/s"
          change="+12.4% network"
          isPositive={true}
          icon={Zap}
          color="blue"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlertsCount}
          change={activeAlertsCount > 0 ? 'Requires action' : 'All clear'}
          isPositive={activeAlertsCount === 0}
          icon={Bell}
          color="rose"
        />
        <StatCard
          title="Running Pipelines"
          value={activePipelinesCount}
          change={`${pipelines.length} configured`}
          isPositive={true}
          icon={Workflow}
          color="emerald"
        />
      </div>

      {/* Requirement 2: Live System Overview Section */}
      <LiveSystemOverview
        devices={devices}
        pipelines={pipelines}
        alerts={alerts}
        throughput="5,240"
      />

      {/* Requirement 5 & Device Health Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Requirement 5: Compact live telemetry chart section for Temp, Press, Vib, RPM */}
          <LiveTelemetryChart />
        </div>
        <div>
          <DeviceStatus devices={devices} />
        </div>
      </div>

      {/* Requirement 3 (Recent Alerts) & Requirement 4 (Pipeline Status) Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirement 3: Recent Alerts (top 4-5) */}
        <RecentAlerts alerts={alerts} onResolveAlert={handleResolveAlert} />

        {/* Requirement 4: Pipeline Status */}
        <PipelineStatus pipelines={pipelines} />
      </div>
    </div>
  );
};
