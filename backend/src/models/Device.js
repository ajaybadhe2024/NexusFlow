const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  deviceId: { type: String, required: true, unique: true, trim: true, index: true },
  type: { type: String, required: true, default: 'Temperature Sensor' },
  location: { type: String, required: true, default: 'Factory Floor A' },
  status: { type: String, enum: ['online', 'offline', 'warning', 'Online', 'Offline', 'Warning'], default: 'online' },
  description: { type: String, default: '' },
  lastSeen: { type: Date, default: Date.now },
  temperature: { type: Number, default: 75.0 },
  pressure: { type: Number, default: 40.0 },
  vibration: { type: Number, default: 2.0 },
  rpm: { type: Number, default: 3200 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
