const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
module.exports = function (req, res, next) {
  let token;
  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // Check cookies
  if (!token && req.cookies && req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  }
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
