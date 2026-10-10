const Alert = require('../../models/Alert');
const logger = require('../../utils/logger');
let wsManager = null; // Injected to avoid circular dependency

const setWsManager = (manager) => {
  wsManager = manager;
};

const alertService = {
  setWsManager,

  createAlert: async (alertData) => {
    let alertDoc;
    try {
      alertDoc = await Alert.create(alertData);
    } catch (err) {
      // Memory fallback if MongoDB not connected
      alertDoc = {
        _id: `alt_${Date.now()}`,
        ...alertData,
        createdAt: new Date()
      };
    }

    logger.info({ alertId: alertDoc._id, deviceId: alertData.deviceId, severity: alertData.severity }, `Alert Generated: ${alertData.message}`);

    // Broadcast over WebSocket
    if (wsManager) {
      wsManager.broadcast('alert', alertDoc);
    }

    return alertDoc;
  },

  getAlerts: async (filters = {}) => {
    try {
      const query = {};
      if (filters.severity) query.severity = filters.severity;
      if (filters.status) query.status = filters.status;
      if (filters.deviceId) query.deviceId = filters.deviceId;
      if (filters.pipelineId) query.pipelineId = filters.pipelineId;

      return await Alert.find(query).sort({ createdAt: -1 }).limit(100);
    } catch (err) {
      return [];
    }
  },

  resolveAlert: async (id) => {
    try {
      const updated = await Alert.findByIdAndUpdate(
        id,
        { status: 'resolved', resolvedAt: new Date() },
        { new: true }
      );
      if (wsManager && updated) {
        wsManager.broadcast('alert_resolved', updated);
      }
      return updated;
    } catch (err) {
      return null;
    }
  }
};

module.exports = alertService;
