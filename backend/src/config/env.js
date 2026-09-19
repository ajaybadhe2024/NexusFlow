const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusflow',
  JWT_SECRET: process.env.JWT_SECRET || 'nexusflow_secret_fallback_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  TELEMETRY_BATCH_SIZE: parseInt(process.env.TELEMETRY_BATCH_SIZE || '500', 10),
  MAX_PIPELINE_NODES: parseInt(process.env.MAX_PIPELINE_NODES || '100', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
