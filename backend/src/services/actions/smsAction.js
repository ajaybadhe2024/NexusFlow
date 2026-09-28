const logger = require('../../utils/logger');

const executeSmsAction = async (nodeData, event, alertService, wsManager) => {
  const phone = nodeData?.config?.phone || nodeData?.phone || '+91 98765 43210';
  const msgTemplate = nodeData?.config?.message || nodeData?.message || 'High turbine temperature threshold exceeded';

  const message = `${msgTemplate} (Device: ${event.deviceId}, Current: ${event.value || event.temperature || 'N/A'})`;

  // Log Mock SMS as required by Section 19
  logger.info({ phone, message }, `[MOCK SMS] To: ${phone} | Message: ${message}`);

  // Save Alert to DB and Broadcast via WebSocket
  if (alertService) {
    const alertData = {
      pipelineId: event.pipelineId || null,
      deviceId: event.deviceId || 'TRB-001',
      device: event.device || `Device ${event.deviceId}`,
      severity: 'critical',
      title: 'HIGH TEMPERATURE CRITICAL ALERT',
      message: message,
      telemetry: event,
      status: 'active'
    };
    await alertService.createAlert(alertData);
  }
};

module.exports = executeSmsAction;
