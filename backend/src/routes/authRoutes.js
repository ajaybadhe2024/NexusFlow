const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest, loginSchema, registerSchema } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.get('/me', protect, authController.getMe);

module.exports = router;
