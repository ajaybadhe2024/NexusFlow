const WebSocket = require('ws');
const logger = require('../../utils/logger');

class ConnectionManager {
  constructor() {
    this.clients = new Set();
  }

  addClient(ws, req) {
    ws.isAlive = true;
    this.clients.add(ws);
    logger.info({ totalClients: this.clients.size }, 'New WebSocket client connected.');

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      this.removeClient(ws);
    });

    ws.on('error', (err) => {
      logger.warn({ err: err.message }, 'WebSocket client connection error handled.');
      this.removeClient(ws);
    });
  }

  removeClient(ws) {
    if (this.clients.has(ws)) {
      this.clients.delete(ws);
      logger.info({ totalClients: this.clients.size }, 'WebSocket client disconnected.');
    }
  }

  broadcast(type, data) {
    const payload = JSON.stringify({ type, data });
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          logger.warn({ err: err.message }, 'Failed to send message to client. Removing.');
          this.removeClient(client);
        }
      }
    });
  }

  // Heartbeat ping-pong every 30s to clean stale connections
  startHeartbeat() {
    this.intervalId = setInterval(() => {
      this.clients.forEach(ws => {
        if (ws.isAlive === false) {
          logger.info('Terminating inactive WebSocket client.');
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  stopHeartbeat() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

const connectionManager = new ConnectionManager();

module.exports = connectionManager;
