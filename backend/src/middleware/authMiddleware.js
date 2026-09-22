const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Not authorized, no bearer token provided.'));
    }

    // Support demo mock tokens if passed by frontend mock state
    if (token.startsWith('mock-jwt-token')) {
      req.user = {
        _id: 'usr_admin_01',
        name: 'Factory Manager Admin',
        email: 'admin@nexusflow.com',
        role: 'Administrator'
      };
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        req.user = { _id: decoded.id, email: decoded.email || 'admin@nexusflow.com' };
      }
      next();
    } catch (err) {
      return next(new UnauthorizedError('Token verification failed or expired.'));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
