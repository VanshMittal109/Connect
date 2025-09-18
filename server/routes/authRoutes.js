const express = require('express');
const router = express.Router();
const { signIn, registerPatient } = require('../controllers/authController');
const { createPatient } = require('../controllers/patientController');
const { createTherapist } = require('../controllers/therapistController');

// POST /api/auth/patients (MySQL patient creation)
router.post('/patients', createPatient);

// POST /api/auth/therapists (MySQL therapist creation)
router.post('/therapists', createTherapist);

// Existing routes
router.post('/register-patient', registerPatient);
router.post('/signin', signIn);

module.exports = router;