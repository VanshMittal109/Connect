const express = require('express');
const router = express.Router();
const { getAllTherapies } = require('../controllers/therapyController');

// GET /api/therapies - Get all therapies for dropdown
router.get('/', getAllTherapies);

module.exports = router;