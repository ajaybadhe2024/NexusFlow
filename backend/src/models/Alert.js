const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  pipelineId: { type: String, default: null, index: true },
  deviceId: { type: String, required: true, index: true },
  device: { type: String, default: 'Turbine Sensor' },
  severity: { type: String, enum: ['critical', 'warning', 'info', 'Critical', 'Warning', 'Info'], default: 'warning' },
  title: { type: String, default: 'TELEMETRY THRESHOLD EXCEEDED' },
  message: { type: String, required: true },
  telemetry: { type: Object, default: {} },
  status: { type: String, enum: ['active', 'resolved', 'Active', 'Resolved'], default: 'active', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  resolvedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Alert', alertSchema);
