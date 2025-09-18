const express = require('express');
const router = express.Router();
const { createPatient } = require('../controllers/patientController');
const { getAllTherapies } = require('../controllers/therapyController');
const { registerPatient } = require('../controllers/authController');

// Patients routes (protected)
router.post('/patients', createPatient);

// Patient registration (creates Supabase Auth user and DB entry)
router.post('/register-patient', registerPatient);

// Therapies routes (protected)
router.get('/therapies', getAllTherapies);

// Dashboard route (protected)
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

module.exports = router;
