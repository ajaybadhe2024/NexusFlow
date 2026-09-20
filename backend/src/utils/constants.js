module.exports = {
  PIPELINE_STATUS: {
    DRAFT: 'draft',
    RUNNING: 'running',
    STOPPED: 'stopped',
    ERROR: 'error'
  },
  ALERT_SEVERITY: {
    CRITICAL: 'critical',
    WARNING: 'warning',
    INFO: 'info'
  },
  ALERT_STATUS: {
    ACTIVE: 'active',
    RESOLVED: 'resolved'
  },
  DEVICE_STATUS: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    WARNING: 'warning'
  },
  WS_EVENTS: {
    TELEMETRY: 'telemetry',
    ALERT: 'alert',
    PIPELINE_STATUS: 'pipeline_status',
    SYSTEM_STATUS: 'system_status',
    ERROR: 'error'
  }
};
