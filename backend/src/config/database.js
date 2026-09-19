const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async (retryCount = 2) => {
  let attempt = 0;
  while (attempt < retryCount) {
    try {
      attempt++;
      logger.info(`Connecting to MongoDB... (Attempt ${attempt}/${retryCount})`);
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 1500,
      });

      logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      
      // Setup Native Time-Series Collection if supported
      await setupTimeSeriesCollection(conn.connection.db);
      return conn;
    } catch (err) {
      logger.warn(`MongoDB connection attempt ${attempt} not available on local machine. Enabling in-memory fallback mode.`);
      if (attempt >= retryCount) {
        logger.info('Operating NexusFlow Backend in high-performance memory fallback mode.');
        return null;
      }
      await new Promise(res => setTimeout(res, 500));
    }
  }
};

const setupTimeSeriesCollection = async (db) => {
  if (!db) return;
  try {
    const collections = await db.listCollections({ name: 'telemetries' }).toArray();
    if (collections.length === 0) {
      logger.info('Creating native MongoDB Time-Series collection "telemetries"...');
      await db.createCollection('telemetries', {
        timeseries: {
          timeField: 'timestamp',
          metaField: 'metadata',
          granularity: 'seconds'
        }
      });
      logger.info('Native MongoDB Time-Series collection "telemetries" created successfully.');
    } else {
      logger.info('MongoDB Time-Series collection "telemetries" exists.');
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Note on Time-Series collection initialization (will fall back to standard collection if Time-Series not supported by current Mongo server version).');
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully.');
  } catch (err) {
    logger.error({ err: err.message }, 'Error disconnecting MongoDB.');
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
