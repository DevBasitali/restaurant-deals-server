const jwt = require('jsonwebtoken');

// General auth middleware (for users and admins after login)
exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based authorization (for user roles)
exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next(); // User is authorized
    } else {
      return res.status(403).json({ message: `Access denied: Requires ${role} role` });
    }
  };
};

// Admin-specific middleware
exports.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};

// Middleware for restaurant owners to check approval status
exports.approvedRestaurantMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant_owner') {
    if (req.user.approvalstatus === 'approved') {
      next(); // User is approved, allow the request
    } else {
      return res.status(403).json({ message: 'Your restaurant is pending approval or has been rejected' });
    }
  } else {
    return res.status(403).json({ message: 'Access denied, restaurant owners only' });
  }
};
