const { compileGraph } = require('./graphCompiler');
const telemetryStream = require('../telemetry/telemetryStream');
const alertService = require('../alerts/alertService');
const executeSmsAction = require('../actions/smsAction');
const executeWebhookAction = require('../actions/webhookAction');
const executeNotificationAction = require('../actions/notificationAction');
const logger = require('../../utils/logger');

class ActivePipelineManager {
  constructor() {
    this.activePipelines = new Map(); // pipelineId -> { subscription, pipelineDoc }
  }

  startPipeline(pipelineDoc, connectionManager = null) {
    const pipelineId = String(pipelineDoc._id || pipelineDoc.id);

    if (this.activePipelines.has(pipelineId)) {
      this.stopPipeline(pipelineId);
    }

    const actionHandlers = {
      SMS: (data, event) => executeSmsAction(data, { ...event, pipelineId }, alertService, connectionManager),
      Email: (data, event) => executeSmsAction(data, { ...event, pipelineId }, alertService, connectionManager),
      Webhook: (data, event) => executeWebhookAction(data, { ...event, pipelineId }, alertService),
      Notification: (data, event) => executeNotificationAction(data, { ...event, pipelineId }, alertService),
      Log: (data, event) => executeNotificationAction(data, { ...event, pipelineId }, alertService)
    };

    try {
      const pipelineFn = compileGraph(pipelineDoc, actionHandlers);
      const compiled$ = pipelineFn(telemetryStream.getObservable());

      const subscription = compiled$.subscribe({
        next: (processedEvent) => {
          logger.info({ pipelineId, event: processedEvent }, `Pipeline "${pipelineDoc.name}" processed telemetry event.`);
        },
        error: (err) => {
          logger.error({ pipelineId, err: err.message }, `Error in active pipeline execution "${pipelineDoc.name}".`);
        }
      });

      this.activePipelines.set(pipelineId, { subscription, pipelineDoc });
      logger.info({ pipelineId, name: pipelineDoc.name }, `Pipeline "${pipelineDoc.name}" is now RUNNING.`);

      if (connectionManager) {
        connectionManager.broadcast('pipeline_status', {
          pipelineId,
          status: 'running',
          name: pipelineDoc.name
        });
      }

      return true;
    } catch (err) {
      logger.error({ pipelineId, err: err.message }, `Failed to start pipeline "${pipelineDoc.name}".`);
      throw err;
    }
  }

  stopPipeline(pipelineId, connectionManager = null) {
    const idStr = String(pipelineId);
    const active = this.activePipelines.get(idStr);
    if (active) {
      active.subscription.unsubscribe();
      this.activePipelines.delete(idStr);
      logger.info({ pipelineId: idStr }, `Pipeline stopped & subscription disposed.`);

      if (connectionManager) {
        connectionManager.broadcast('pipeline_status', {
          pipelineId: idStr,
          status: 'stopped'
        });
      }
      return true;
    }
    return false;
  }

  restartPipeline(pipelineDoc, connectionManager = null) {
    const pipelineId = String(pipelineDoc._id || pipelineDoc.id);
    this.stopPipeline(pipelineId, connectionManager);
    return this.startPipeline(pipelineDoc, connectionManager);
  }

  stopAllPipelines() {
    logger.info(`Stopping all ${this.activePipelines.size} active RxJS pipelines...`);
    this.activePipelines.forEach(({ subscription }, id) => {
      subscription.unsubscribe();
    });
    this.activePipelines.clear();
    logger.info('All active pipelines stopped.');
  }

  isPipelineRunning(pipelineId) {
    return this.activePipelines.has(String(pipelineId));
  }

  getActiveCount() {
    return this.activePipelines.size;
  }
}

const pipelineExecutor = new ActivePipelineManager();

module.exports = pipelineExecutor;
