const telemetryIngestionService = require('../services/ingestion/telemetryIngestionService');
const Telemetry = require('../models/Telemetry');

const ingestTelemetry = async (req, res, next) => {
  try {
    const result = await telemetryIngestionService.ingest(req.body);
    res.status(202).json({
      success: true,
      message: 'Telemetry ingested into stream and database.',
      data: result.event
    });
  } catch (err) {
    next(err);
  }
};

const getTelemetryHistory = async (req, res, next) => {
  try {
    const { deviceId, from, to, limit = 100 } = req.query;
    const query = {};

    if (deviceId) {
      query['metadata.deviceId'] = deviceId;
    }

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    let results = [];
    try {
      results = await Telemetry.find(query)
        .sort({ timestamp: -1 })
        .limit(Math.min(parseInt(limit, 10), 1000));
    } catch (err) {
      // Fallback empty list if MongoDB offline
    }

    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  ingestTelemetry,
  getTelemetryHistory
};
