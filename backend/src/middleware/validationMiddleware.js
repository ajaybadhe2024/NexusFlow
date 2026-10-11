const { z } = require('zod');
const { ValidationError } = require('../utils/errors');

const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    req.validated = parsed;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formatted = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return next(new ValidationError('Input validation failed', formatted));
    }
    next(err);
  }
};

// Common Schemas
const telemetryPayloadSchema = z.object({
  body: z.object({
    deviceId: z.string({ required_error: 'deviceId is required' }),
    timestamp: z.string().optional().default(() => new Date().toISOString()),
    temperature: z.number({ required_error: 'temperature metric is required' }),
    pressure: z.number().optional().default(0),
    vibration: z.number().optional().default(0),
    rpm: z.number().optional().default(0)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    company: z.string().optional()
  })
});

module.exports = {
  validateRequest,
  telemetryPayloadSchema,
  loginSchema,
  registerSchema
};
