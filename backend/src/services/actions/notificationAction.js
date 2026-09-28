const logger = require('../../utils/logger');

const executeNotificationAction = async (nodeData, event, alertService) => {
  const channel = nodeData?.config?.channel || 'In-App';
  const message = `System notification for device ${event.deviceId} - Threshold matched!`;

  logger.info({ channel, message }, `[SYSTEM NOTIFICATION] Channel: ${channel} | ${message}`);

  if (alertService) {
    await alertService.createAlert({
      pipelineId: event.pipelineId || null,
      deviceId: event.deviceId || 'TRB-001',
      severity: 'info',
      title: 'SYSTEM NOTIFICATION',
      message: message,
      telemetry: event,
      status: 'active'
    });
  }
};

module.exports = executeNotificationAction;
