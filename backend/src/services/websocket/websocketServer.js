const WebSocket = require('ws');
const connectionManager = require('./connectionManager');
const alertService = require('../alerts/alertService');
const logger = require('../../utils/logger');

const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  // Inject wsManager into alertService
  alertService.setWsManager(connectionManager);
  connectionManager.startHeartbeat();

  wss.on('connection', (ws, req) => {
    connectionManager.addClient(ws, req);

    // Send initial welcome message
    ws.send(JSON.stringify({
      type: 'system_status',
      data: {
        status: 'connected',
        serverTime: new Date().toISOString(),
        message: 'Connected to NexusFlow Live Telemetry WebSocket Server'
      }
    }));

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message);
        logger.info({ parsed }, 'Received client WebSocket message.');
      } catch (err) {
        // Ignore non-JSON client messages
      }
    });
  });

  logger.info('WebSocket Server initialized on endpoint /ws.');
  return wss;
};

module.exports = { setupWebSocketServer };
