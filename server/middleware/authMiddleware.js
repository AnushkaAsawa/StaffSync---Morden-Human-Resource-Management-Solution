const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes by verifying Bearer JWT token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'staffsync_super_secret_jwt_key_2026_ist'
      );

      // Try finding user in database
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        // Fallback for mocked/demo tokens
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email,
          role: decoded.role,
          department: decoded.department || 'General',
        };
      }

      return next();
    } catch (error) {
      console.error('[Auth Error]: Token verification failed', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token supplied',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string|Array<string>} roles - Permitted user roles e.g. ['HR', 'Manager']
 */
const checkRole = (...roles) => {
  const flattenedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required',
      });
    }

    if (!flattenedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${flattenedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  checkRole,
};
