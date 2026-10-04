const { Subject } = require('rxjs');
const logger = require('../../utils/logger');

class TelemetryStream {
  constructor() {
    this.subject$ = new Subject();
  }

  // Push incoming telemetry payload into the central RxJS stream
  publish(telemetryEvent) {
    this.subject$.next(telemetryEvent);
  }

  // Get the central observable for active pipelines to subscribe to
  getObservable() {
    return this.subject$.asObservable();
  }
}

const telemetryStream = new TelemetryStream();

module.exports = telemetryStream;
