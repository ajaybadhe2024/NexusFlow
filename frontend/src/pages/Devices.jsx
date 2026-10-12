import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Search, Grid, List, Filter, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { deviceService } from '../services/deviceService';
import { DeviceCard } from '../components/devices/DeviceCard';
import { DeviceTable } from '../components/devices/DeviceTable';
import { AddDeviceModal } from '../components/devices/AddDeviceModal';
import { EditDeviceModal } from '../components/devices/EditDeviceModal';
import { DeviceDetailsModal } from '../components/devices/DeviceDetailsModal';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';

export const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeviceForView, setSelectedDeviceForView] = useState(null);
  const [selectedDeviceForEdit, setSelectedDeviceForEdit] = useState(null);

  const [toastMessage, setToastMessage] = useState('');

  const loadDevices = () => {
    setDevices(deviceService.getDevices());
  };

  useEffect(() => {
    loadDevices();

    // Support URL search parameter ?action=add or ?modal=add from Quick Action buttons
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add' || params.get('modal') === 'add') {
      setIsAddModalOpen(true);
    }
  }, [window.location.search]);

  // Actions Handlers
  const handleAddDevice = (deviceData) => {
    const created = deviceService.addDevice(deviceData);
    loadDevices();
    setToastMessage(`Device "${created.name}" (${created.id}) registered successfully.`);
  };

  const handleUpdateDevice = (id, updates) => {
    deviceService.updateDevice(id, updates);
    loadDevices();
    setToastMessage(`Device ${id} updated successfully.`);
  };

  const handleToggleDeviceStatus = (id) => {
    const updated = deviceService.toggleDeviceStatus(id);
    loadDevices();
    if (updated) {
      setToastMessage(`Device ${id} status set to ${updated.status}.`);
    }
  };

  const handleDeleteDevice = (id) => {
    deviceService.deleteDevice(id);
    loadDevices();
    setToastMessage(`Device ${id} removed from platform.`);
  };

  // KPI calculations
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const warningCount = devices.filter(d => d.status === 'Warning').length;
  const offlineCount = devices.filter(d => d.status === 'Offline').length;

  // Filtered devices calculation
  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || d.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesType =
      filterType === 'all' || d.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Requirement 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-8 h-8 text-cyan-400" /> Device Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Monitor connected IoT devices, configure telemetry endpoints, and manage factory sensors.
          </p>
        </div>

        {/* Requirement 5: Add Device Button */}
        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Device
        </Button>
      </div>

      {/* Requirement 2: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Devices"
          value={totalCount}
          change={`${totalCount} registered`}
          isPositive={true}
          icon={Cpu}
          color="cyan"
        />
        <StatCard
          title="Online"
          value={onlineCount}
          change={`${((onlineCount / (totalCount || 1)) * 100).toFixed(0)}% online`}
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Offline"
          value={offlineCount}
          change={offlineCount > 0 ? 'Requires check' : 'All connected'}
          isPositive={offlineCount === 0}
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Warning"
          value={warningCount}
          change={warningCount > 0 ? 'Threshold warnings' : 'Nominal'}
          isPositive={warningCount === 0}
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Requirement 4: Search & Dual Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search device by ID, Name, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Device Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Device Types</option>
              <option value="temperature sensor">Temperature Sensor</option>
              <option value="vibration sensor">Vibration Sensor</option>
              <option value="pressure sensor">Pressure Sensor</option>
              <option value="rpm sensor">RPM Sensor</option>
              <option value="multi-metric unit">Multi-Metric Unit</option>
            </select>
          </div>

          {/* View Mode Toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Requirement 3: Main Content (Table or Grid View) */}
      {viewMode === 'table' ? (
        <DeviceTable
          devices={filteredDevices}
          onView={(dev) => setSelectedDeviceForView(dev)}
          onEdit={(dev) => setSelectedDeviceForEdit(dev)}
          onToggleStatus={handleToggleDeviceStatus}
          onDelete={handleDeleteDevice}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDevices.map((d) => (
            <DeviceCard
              key={d.id}
              device={d}
              onView={(dev) => setSelectedDeviceForView(dev)}
              onEdit={(dev) => setSelectedDeviceForEdit(dev)}
              onToggleStatus={handleToggleDeviceStatus}
              onDelete={handleDeleteDevice}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDevice}
      />

      <EditDeviceModal
        isOpen={!!selectedDeviceForEdit}
        onClose={() => setSelectedDeviceForEdit(null)}
        device={selectedDeviceForEdit}
        onSave={handleUpdateDevice}
      />

      <DeviceDetailsModal
        isOpen={!!selectedDeviceForView}
        onClose={() => setSelectedDeviceForView(null)}
        device={selectedDeviceForView}
      />
    </div>
  );
};
