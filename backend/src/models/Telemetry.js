const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    metadata: {
      deviceId: { type: String, required: true, index: true },
      deviceType: { type: String, default: 'temperature' },
      location: { type: String, default: 'Factory Floor A' }
    },
    temperature: { type: Number, required: true },
    pressure: { type: Number, default: 0 },
    vibration: { type: Number, default: 0 },
    rpm: { type: Number, default: 0 }
  },
  {
    timestamps: false
  }
);

// Compound index for high-throughput time-range queries per device
telemetrySchema.index({ 'metadata.deviceId': 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
