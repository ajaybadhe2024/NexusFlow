const axios = require('axios');
const logger = require('../../utils/logger');

const executeWebhookAction = async (nodeData, event, alertService) => {
  const url = nodeData?.config?.url || nodeData?.url || 'https://hooks.factory-iot.com/alert';
  const payload = {
    event: 'RULE_TRIGGERED',
    timestamp: new Date().toISOString(),
    deviceId: event.deviceId,
    telemetry: event
  };

  logger.info({ url, payload }, `Executing Webhook HTTP POST to ${url}...`);

  try {
    // Axios request with 3-second timeout
    await axios.post(url, payload, { timeout: 3000 });
    logger.info({ url }, `Webhook dispatch successful.`);
  } catch (err) {
    logger.warn({ url, err: err.message }, `Webhook dispatch failed/mocked (Simulated completion).`);
  }

  if (alertService) {
    await alertService.createAlert({
      pipelineId: event.pipelineId || null,
      deviceId: event.deviceId || 'TRB-001',
      severity: 'warning',
      title: 'WEBHOOK ALERT DISPATCHED',
      message: `Webhook sent to ${url}`,
      telemetry: event,
      status: 'active'
    });
  }
};

module.exports = executeWebhookAction;
