const express = require('express');
const router = express.Router();

// GET /api/dashboard (protected route example)
router.get('/', (req, res) => {
  // You can add JWT auth middleware here if needed
  res.json({ message: 'Welcome to the dashboard!' });
});

module.exports = router;
