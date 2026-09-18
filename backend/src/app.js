const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorMiddleware');
const { NotFoundError } = require('./utils/errors');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Health Check Endpoint (Section 37)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'NexusFlow Backend',
    status: 'healthy',
    database: 'connected',
    uptime: Math.floor(process.uptime())
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/pipelines', pipelineRoutes);
app.use('/api/alerts', alertRoutes);

// 404 Route Handler
app.use('*', (req, res, next) => {
  next(new NotFoundError(`API Endpoint ${req.originalUrl} not found.`));
});

// Central Error Middleware
app.use(errorHandler);

module.exports = app;
