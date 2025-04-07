const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken'

// General auth middleware (for users and admins after login)
exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if the token starts with 'Bearer'
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  // Remove 'Bearer ' from token string
  const tokenWithoutBearer = token.split(' ')[1];

  try {
    // Decode the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging line

    // Attach user info to the request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token validation error:', err); // Log error details
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// // Role-based authorization (for user roles)
// exports.authorizeRole = (role) => {
//   return (req, res, next) => {
//     if (req.user && req.user.role === role) {
//       next(); // User is authorized
//     } else {
//       return res.status(403).json({ message: `Access denied: Requires ${role} role` });
//     }
//   };
// };

// Admin-specific middleware
exports.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};

exports.approvedRestaurantMiddleware = (req, res, next) => {
  // Check if the user is logged in and their role is restaurant_owner
  if (req.user && req.user.role === 'restaurant_owner') {
    // Check if the restaurant owner is approved by the admin
    if (req.user.approvalstatus === 'approved') {
      next(); // User is approved, allow the request
    } else {
      return res.status(403).json({
        message: 'Your restaurant is pending approval or has been rejected',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access denied: Only approved restaurant owners can perform this action',
    });
  }
};

