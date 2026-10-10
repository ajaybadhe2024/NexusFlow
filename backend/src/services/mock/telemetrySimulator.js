const telemetryIngestionService = require('../ingestion/telemetryIngestionService');
const logger = require('../../utils/logger');

class TelemetrySimulator {
  constructor() {
    this.intervalId = null;
    this.devices = [
      { id: 'TRB-001', baseTemp: 76.0, basePress: 45.0, baseVib: 2.0, baseRpm: 3400 },
      { id: 'TRB-002', baseTemp: 83.0, basePress: 48.0, baseVib: 5.5, baseRpm: 3600 },
      { id: 'TRB-003', baseTemp: 72.0, basePress: 41.0, baseVib: 3.5, baseRpm: 3300 },
      { id: 'PRS-001', baseTemp: 68.0, basePress: 42.0, baseVib: 1.2, baseRpm: 2900 },
      { id: 'VIB-001', baseTemp: 74.0, basePress: 39.0, baseVib: 1.8, baseRpm: 3100 }
    ];
  }

  start(intervalMs = 300) {
    if (this.intervalId) return;
    logger.info({ intervalMs }, 'Starting Mock IoT Telemetry Simulator...');

    this.intervalId = setInterval(async () => {
      // Pick random device
      const dev = this.devices[Math.floor(Math.random() * this.devices.length)];

      // 10% chance to generate an anomaly spike
      const isAnomaly = Math.random() < 0.15;

      const tempDelta = (Math.random() - 0.45) * 3.0;
      const pressDelta = (Math.random() - 0.5) * 1.5;
      const vibDelta = (Math.random() - 0.5) * 0.8;
      const rpmDelta = (Math.random() - 0.5) * 50;

      let temp = dev.baseTemp + tempDelta;
      let press = dev.basePress + pressDelta;
      let vib = dev.baseVib + vibDelta;
      let rpm = dev.baseRpm + rpmDelta;

      if (isAnomaly && dev.id === 'TRB-001') {
        temp = 86.4; // Exceed 80°C threshold
        logger.info('Simulator injected TRB-001 Temperature Anomaly (86.4°C)!');
      }

      await telemetryIngestionService.ingest({
        deviceId: dev.id,
        timestamp: new Date().toISOString(),
        temperature: parseFloat(temp.toFixed(1)),
        pressure: parseFloat(press.toFixed(1)),
        vibration: parseFloat(vib.toFixed(2)),
        rpm: Math.round(rpm)
      });
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Mock IoT Telemetry Simulator stopped.');
    }
  }
}

const telemetrySimulator = new TelemetrySimulator();

// Allow running standalone via `npm run simulator`
if (require.main === module) {
  telemetrySimulator.start(500);
}

module.exports = telemetrySimulator;
