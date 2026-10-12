// Device management service using localStorage with demo pre-loaded industrial IoT devices

const STORAGE_KEY = 'nexusflow_devices';

const INITIAL_DEVICES = [
  {
    id: 'TRB-001',
    name: 'Turbine Sensor #01',
    type: 'Temperature Sensor',
    location: 'Factory Floor A',
    status: 'Online',
    temperature: 78.4,
    pressure: 45.2,
    vibration: 2.1,
    rpm: 3450,
    lastSeen: '2 sec ago',
    description: 'High-frequency thermocouple monitoring main exhaust line on Turbine Alpha.'
  },
  {
    id: 'TRB-002',
    name: 'Turbine Sensor #02',
    type: 'Temperature Sensor',
    location: 'Factory Floor B',
    status: 'Warning',
    temperature: 84.1,
    pressure: 48.0,
    vibration: 6.8,
    rpm: 3620,
    lastSeen: '5 sec ago',
    description: 'Temperature sensor showing elevated thermal profile above 80°C threshold limit.'
  },
  {
    id: 'TRB-003',
    name: 'Turbine Sensor #03',
    type: 'Vibration Sensor',
    location: 'Turbine Room 1',
    status: 'Online',
    temperature: 72.8,
    pressure: 41.5,
    vibration: 4.2,
    rpm: 3390,
    lastSeen: '1 sec ago',
    description: 'Piezoelectric tri-axial accelerometer monitoring bearing housing.'
  },
  {
    id: 'PRS-001',
    name: 'Pressure Sensor #01',
    type: 'Pressure Sensor',
    location: 'Hydraulic Unit',
    status: 'Online',
    temperature: 68.0,
    pressure: 42.5,
    vibration: 1.2,
    rpm: 2900,
    lastSeen: '3 sec ago',
    description: 'Piezoresistive pressure transmitter monitoring primary hydraulic fluid lines.'
  },
  {
    id: 'PRS-002',
    name: 'Pneumatic Pressure Guard',
    type: 'Pressure Sensor',
    location: 'Compressor Line 4',
    status: 'Warning',
    temperature: 79.5,
    pressure: 64.8,
    vibration: 3.5,
    rpm: 3150,
    lastSeen: '12 sec ago',
    description: 'Line pressure monitoring valve showing high backpressure spikes.'
  },
  {
    id: 'VIB-001',
    name: 'Vibration Sensor #01',
    type: 'Vibration Sensor',
    location: 'Gearbox Alpha',
    status: 'Online',
    temperature: 75.1,
    pressure: 39.8,
    vibration: 1.8,
    rpm: 3100,
    lastSeen: '4 sec ago',
    description: 'High-frequency spectrum analyzer for gear tooth mesh frequency.'
  },
  {
    id: 'RPM-001',
    name: 'Main Shaft Tachometer',
    type: 'RPM Sensor',
    location: 'Power Generation Hub',
    status: 'Online',
    temperature: 71.2,
    pressure: 40.1,
    vibration: 2.0,
    rpm: 3580,
    lastSeen: '1 sec ago',
    description: 'Optical laser tachometer measuring rotational shaft velocity.'
  },
  {
    id: 'MMU-001',
    name: 'Integrated Multi-Unit #01',
    type: 'Multi-Metric Unit',
    location: 'Substation Control Room',
    status: 'Offline',
    temperature: 0.0,
    pressure: 0.0,
    vibration: 0.0,
    rpm: 0,
    lastSeen: '25 min ago',
    description: 'Multi-metric telemetry hub disconnected during scheduled power maintenance.'
  }
];

export const deviceService = {
  getDevices: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEVICES));
      return INITIAL_DEVICES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DEVICES;
    }
  },

  getDeviceById: (id) => {
    const devices = deviceService.getDevices();
    return devices.find(d => d.id === id);
  },

  addDevice: (deviceData) => {
    const devices = deviceService.getDevices();
    const newDevice = {
      ...deviceData,
      id: deviceData.id || `DEV-${Math.floor(100 + Math.random() * 900)}`,
      status: deviceData.status || 'Online',
      temperature: deviceData.temperature || 72.0,
      pressure: deviceData.pressure || 40.0,
      vibration: deviceData.vibration || 1.5,
      rpm: deviceData.rpm || 3000,
      lastSeen: 'Just now',
      description: deviceData.description || 'Industrial IoT telemetry node.'
    };
    const updated = [newDevice, ...devices];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newDevice;
  },

  updateDevice: (id, updates) => {
    const devices = deviceService.getDevices();
    const updated = devices.map(d => d.id === id ? { ...d, ...updates } : d);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find(d => d.id === id);
  },

  toggleDeviceStatus: (id) => {
    const devices = deviceService.getDevices();
    const target = devices.find(d => d.id === id);
    if (!target) return null;
    const newStatus = target.status === 'Offline' ? 'Online' : 'Offline';
    return deviceService.updateDevice(id, { status: newStatus });
  },

  deleteDevice: (id) => {
    const devices = deviceService.getDevices();
    const updated = devices.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
