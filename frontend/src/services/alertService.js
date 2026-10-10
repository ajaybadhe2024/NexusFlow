// Alert management service with localStorage support and demo alerts

const STORAGE_KEY = 'nexusflow_alerts';

const INITIAL_ALERTS = [
  {
    id: 'alt_001',
    severity: 'Critical',
    title: 'HIGH TEMPERATURE',
    device: 'Turbine Sensor #01',
    deviceId: 'TRB-001',
    message: 'Temperature reached 86.4°C exceeding safety limit (80°C)',
    timestamp: '2 minutes ago',
    status: 'Active',
    createdIso: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_002',
    severity: 'Warning',
    title: 'VIBRATION ANOMALY',
    device: 'Turbine Sensor #03',
    deviceId: 'TRB-003',
    message: 'High vibration amplitude 6.8 mm/s detected on bearing #2',
    timestamp: '8 minutes ago',
    status: 'Active',
    createdIso: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_003',
    severity: 'Warning',
    title: 'PRESSURE DROP',
    device: 'Pressure Sensor #01',
    deviceId: 'PRS-001',
    message: 'Hydraulic pressure dropped below nominal threshold 30.0 PSI',
    timestamp: '25 minutes ago',
    status: 'Active',
    createdIso: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_004',
    severity: 'Info',
    title: 'NORMAL RECOVERY',
    device: 'Pressure Sensor #01',
    deviceId: 'PRS-001',
    message: 'Pressure returned to normal range (42.5 PSI)',
    timestamp: '1 hour ago',
    status: 'Resolved',
    resolvedAt: '1 hour ago',
    createdIso: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_005',
    severity: 'Critical',
    title: 'TURBINE OVERHEAT',
    device: 'Turbine Sensor #02',
    deviceId: 'TRB-002',
    message: 'Sustained temperature above 84°C for 5 minutes',
    timestamp: '2 hours ago',
    status: 'Resolved',
    resolvedAt: '2 hours ago',
    createdIso: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

export const alertService = {
  getAlerts: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ALERTS;
    }
  },

  resolveAlert: (alertId) => {
    const alerts = alertService.getAlerts();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = alerts.map(a => a.id === alertId ? { 
      ...a, 
      status: 'Resolved', 
      resolvedAt: `Today at ${nowStr}`,
      timestamp: `Resolved at ${nowStr}` 
    } : a);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  addAlert: (alertData) => {
    const alerts = alertService.getAlerts();
    const newAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      status: 'Active',
      timestamp: 'Just now',
      createdIso: new Date().toISOString()
    };
    const updated = [newAlert, ...alerts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newAlert;
  },

  clearAll: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
};
