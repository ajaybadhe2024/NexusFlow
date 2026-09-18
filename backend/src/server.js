const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/database');
const { setupWebSocketServer } = require('./services/websocket/websocketServer');
const connectionManager = require('./services/websocket/connectionManager');
const pipelineExecutor = require('./services/compiler/pipelineExecutor');
const pipelineService = require('./services/pipelines/pipelineService');
const telemetrySimulator = require('./services/mock/telemetrySimulator');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Setup WebSockets
setupWebSocketServer(server);

const startServer = async () => {
  // Connect MongoDB
  await connectDB();

  // Start HTTP Server
  server.listen(env.PORT, async () => {
    logger.info(`NexusFlow Backend Server running on port ${env.PORT} (${env.NODE_ENV})`);
    logger.info(`REST API: http://localhost:${env.PORT}/api`);
    logger.info(`WebSocket: ws://localhost:${env.PORT}/ws`);

    // Auto-start default demo pipeline into RxJS engine
    try {
      const seedPipe = await pipelineService.getPipelineById('65b8a5fe20f2491b9639e4b1');
      if (seedPipe) {
        pipelineExecutor.startPipeline(seedPipe, connectionManager);
      }
    } catch (err) {
      logger.warn({ err: err.message }, 'Seed pipeline initialization note.');
    }

    // Auto-start Mock Telemetry Simulator in development mode
    telemetrySimulator.start(500);
  });
};

// Graceful Shutdown Handler (Section 41)
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // 1. Stop Mock Simulator
  telemetrySimulator.stop();

  // 2. Stop Active RxJS Pipelines
  pipelineExecutor.stopAllPipelines();

  // 3. Stop WebSockets
  connectionManager.stopHeartbeat();

  // 4. Close HTTP Server
  server.close(async () => {
    logger.info('HTTP & WebSocket server closed.');

    // 5. Disconnect Database
    await disconnectDB();

    logger.info('NexusFlow Backend shutdown complete.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
