
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Extracted Token:", token); // ✅ Add this line

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // ✅ Check if this logs expected values

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};


exports.adminMiddleware = (req, res, next) => {
  console.log("Decoded user in adminMiddleware:", req.user);

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};


// exports.adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({ message: 'Access denied, admin only' });
//   }
// };

exports.approvedRestaurantMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant_owner') {
    if (req.user.approvalstatus === 'approved') {
      next();
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

