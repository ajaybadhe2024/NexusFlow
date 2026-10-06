// Real-time simulated IoT telemetry publisher

class MockTelemetryService {
  constructor() {
    this.subscribers = new Set();
    this.intervalId = null;
    this.currentData = {
      'TRB-001': { temp: 78.4, press: 45.2, vib: 2.1, rpm: 3450 },
      'TRB-002': { temp: 84.1, press: 48.0, vib: 6.8, rpm: 3620 },
      'TRB-003': { temp: 72.8, press: 41.5, vib: 4.2, rpm: 3390 },
      'PRS-001': { temp: 68.0, press: 42.5, vib: 1.2, rpm: 2900 },
      'VIB-001': { temp: 75.1, press: 39.8, vib: 1.8, rpm: 3100 }
    };
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.generateTick();
    }, 2500);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    if (!this.intervalId) {
      this.start();
    }
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  generateTick() {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Slight random drift for realism
    Object.keys(this.currentData).forEach(deviceId => {
      const d = this.currentData[deviceId];
      const tempDelta = (Math.random() - 0.48) * 1.5;
      const pressDelta = (Math.random() - 0.5) * 0.8;
      const vibDelta = (Math.random() - 0.5) * 0.3;
      const rpmDelta = (Math.random() - 0.5) * 20;

      d.temp = Math.min(100, Math.max(50, +(d.temp + tempDelta).toFixed(1)));
      d.press = Math.min(80, Math.max(20, +(d.press + pressDelta).toFixed(1)));
      d.vib = Math.min(15, Math.max(0.5, +(d.vib + vibDelta).toFixed(2)));
      d.rpm = Math.min(5000, Math.max(1000, Math.round(d.rpm + rpmDelta)));
    });

    const payload = {
      timestamp,
      devices: { ...this.currentData }
    };

    this.subscribers.forEach(cb => cb(payload));
  }

  // Pre-generate historical chart data for time windows
  getHistoricalData(deviceId = 'TRB-001', range = '15m') {
    const points = range === '5m' ? 10 : range === '15m' ? 15 : range === '1h' ? 24 : 30;
    const baseTemps = [72, 74, 73, 77, 79, 81, 80, 84, 82, 86, 85, 83, 87, 84, 86];
    
    const now = new Date();
    const result = [];

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const idx = (points - 1 - i) % baseTemps.length;
      const baseTemp = baseTemps[idx];

      result.push({
        time: timeStr,
        temperature: baseTemp + Math.round((Math.random() - 0.5) * 2),
        pressure: Math.round(40 + (baseTemp - 70) * 0.4 + (Math.random() - 0.5) * 3),
        vibration: +((baseTemp > 80 ? 5.5 : 2.2) + (Math.random() - 0.5) * 1.5).toFixed(1),
        rpm: 3200 + Math.round((baseTemp - 70) * 15 + (Math.random() - 0.5) * 100),
        threshold: 80
      });
    }

    return result;
  }
}

export const mockTelemetryService = new MockTelemetryService();
