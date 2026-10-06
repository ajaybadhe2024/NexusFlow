import { mockTelemetryService } from './mockTelemetryService';

export const telemetryService = {
  subscribeLiveTelemetry: (callback) => {
    return mockTelemetryService.subscribe(callback);
  },

  getTelemetryHistory: (deviceId, timeRange) => {
    return mockTelemetryService.getHistoricalData(deviceId, timeRange);
  }
};
