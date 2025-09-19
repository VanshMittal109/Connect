const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// Middleware to authenticate and attach user info
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.authToken || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user and role from DB
    const [users] = await promisePool.execute(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check role and redirect or allow access
const roleAccess = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access denied for role: ${role}` });
    }
    next();
  };
};

// Example usage in routes:
// router.get('/therapist-dashboard', authenticate, roleAccess('therapist'), (req, res) => { ... });
// router.get('/patient-dashboard', authenticate, roleAccess('patient'), (req, res) => { ... });

module.exports = { authenticate, roleAccess };