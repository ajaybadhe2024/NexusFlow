const Device = require('../../models/Device');

const INITIAL_DEVICES = [
  { name: 'Turbine Sensor #01', deviceId: 'TRB-001', type: 'Temperature Sensor', location: 'Factory Floor A', status: 'Online', temperature: 78.4, pressure: 45.2, vibration: 2.1, rpm: 3450, lastSeen: new Date() },
  { name: 'Turbine Sensor #02', deviceId: 'TRB-002', type: 'Temperature Sensor', location: 'Factory Floor B', status: 'Warning', temperature: 84.1, pressure: 48.0, vibration: 6.8, rpm: 3620, lastSeen: new Date() },
  { name: 'Turbine Sensor #03', deviceId: 'TRB-003', type: 'Vibration Sensor', location: 'Turbine Room 1', status: 'Online', temperature: 72.8, pressure: 41.5, vibration: 4.2, rpm: 3390, lastSeen: new Date() },
  { name: 'Pressure Sensor #01', deviceId: 'PRS-001', type: 'Pressure Sensor', location: 'Hydraulic Unit', status: 'Online', temperature: 68.0, pressure: 42.5, vibration: 1.2, rpm: 2900, lastSeen: new Date() },
  { name: 'Vibration Sensor #01', deviceId: 'VIB-001', type: 'Vibration Sensor', location: 'Gearbox Alpha', status: 'Online', temperature: 75.1, pressure: 39.8, vibration: 1.8, rpm: 3100, lastSeen: new Date() }
];

let inMemoryDevices = [...INITIAL_DEVICES];

const deviceService = {
  getDevices: async () => {
    try {
      const dbDevices = await Device.find();
      if (dbDevices.length > 0) return dbDevices;
    } catch (err) {}
    return inMemoryDevices;
  },

  getDeviceById: async (id) => {
    try {
      const d = await Device.findOne({ $or: [{ _id: id }, { deviceId: id }] });
      if (d) return d;
    } catch (err) {}
    return inMemoryDevices.find(d => d.deviceId === id || d.id === id);
  },

  createDevice: async (deviceData) => {
    try {
      return await Device.create(deviceData);
    } catch (err) {
      const newDev = { ...deviceData, id: deviceData.deviceId || `DEV-${Date.now()}` };
      inMemoryDevices.push(newDev);
      return newDev;
    }
  },

  updateDevice: async (id, updates) => {
    try {
      return await Device.findOneAndUpdate(
        { $or: [{ _id: id }, { deviceId: id }] },
        updates,
        { new: true }
      );
    } catch (err) {
      const idx = inMemoryDevices.findIndex(d => d.deviceId === id || d.id === id);
      if (idx >= 0) {
        inMemoryDevices[idx] = { ...inMemoryDevices[idx], ...updates };
        return inMemoryDevices[idx];
      }
      return null;
    }
  },

  deleteDevice: async (id) => {
    try {
      await Device.deleteOne({ $or: [{ _id: id }, { deviceId: id }] });
    } catch (err) {
      inMemoryDevices = inMemoryDevices.filter(d => d.deviceId !== id && d.id !== id);
    }
    return true;
  }
};

module.exports = deviceService;
