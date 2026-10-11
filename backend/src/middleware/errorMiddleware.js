const logger = require('../utils/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred.';

  logger.error({
    err: {
      code,
      message,
      stack: err.stack,
      errors: err.errors
    },
    url: req.originalUrl,
    method: req.method
  }, `Error handling request: ${method} ${req.originalUrl}`);

  const errorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(err.errors && err.errors.length > 0 ? { details: err.errors } : {})
    }
  };

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };
