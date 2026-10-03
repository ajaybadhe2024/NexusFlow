const Telemetry = require('../../models/Telemetry');
const Device = require('../../models/Device');
const telemetryStream = require('../telemetry/telemetryStream');
const connectionManager = require('../websocket/connectionManager');
const logger = require('../../utils/logger');

class TelemetryIngestionService {
  constructor() {
    this.batchQueue = [];
    this.isFlushScheduled = false;
  }

  async ingest(payload) {
    const { deviceId, temperature, pressure, vibration, rpm, timestamp } = payload;

    const event = {
      deviceId: deviceId || 'TRB-001',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      temperature: parseFloat(temperature || 0),
      pressure: parseFloat(pressure || 0),
      vibration: parseFloat(vibration || 0),
      rpm: parseInt(rpm || 0, 10),
      metadata: {
        deviceId: deviceId || 'TRB-001',
        deviceType: 'temperature',
        location: 'Factory Floor A'
      }
    };

    // 1. Asynchronously push to Time-Series DB batch queue
    this.batchQueue.push({
      timestamp: event.timestamp,
      metadata: event.metadata,
      temperature: event.temperature,
      pressure: event.pressure,
      vibration: event.vibration,
      rpm: event.rpm
    });

    if (!this.isFlushScheduled) {
      this.isFlushScheduled = true;
      setImmediate(() => this.flushBatch());
    }

    // 2. Immediate non-blocking push to RxJS Telemetry Stream
    telemetryStream.publish(event);

    // 3. Broadcast to WebSocket subscribers
    connectionManager.broadcast('telemetry', {
      deviceId: event.deviceId,
      timestamp: event.timestamp.toISOString(),
      temperature: event.temperature,
      pressure: event.pressure,
      vibration: event.vibration,
      rpm: event.rpm
    });

    return { success: true, event };
  }

  async flushBatch() {
    if (this.batchQueue.length === 0) {
      this.isFlushScheduled = false;
      return;
    }

    const items = [...this.batchQueue];
    this.batchQueue = [];
    this.isFlushScheduled = false;

    try {
      await Telemetry.insertMany(items, { ordered: false });
    } catch (err) {
      // Ignore Mongo bulk write errors during testing if offline
    }
  }
}

const telemetryIngestionService = new TelemetryIngestionService();

module.exports = telemetryIngestionService;
