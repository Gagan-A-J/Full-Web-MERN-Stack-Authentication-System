const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // ✅ Get token from cookie OR Authorization header
  const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;