const express = require('express');
const router = express.Router();

const { signIn, signOut } = require('../controllers/authController');
const { therapistDashboard, createTherapist, registerTherapist } = require('../controllers/therapistController');
const { patientDashboard, createPatient, registerPatient } = require('../controllers/patientController');
// Registration routes
router.post('/register-patient', registerPatient);
router.post('/register-therapist', registerTherapist);
const { authenticate, roleAccess } = require('../middleware/middleware');

// Therapist dashboard (protected, role-based)
router.get('/therapist-dashboard', authenticate, roleAccess('therapist'), therapistDashboard);
router.get('/patient-dashboard', authenticate, roleAccess('patient'), patientDashboard);

// POST /api/auth/patients (MySQL patient creation)
router.post('/patients', createPatient);

// POST /api/auth/therapists (MySQL therapist creation)
router.post('/therapists', createTherapist);

router.post('/signin', signIn);

const { getTherapies, getTherapyDuration } = require('../controllers/therapyController');
// GET /api/auth/therapies (fetch therapies for dropdown)
router.get('/therapies', getTherapies);

router.get('/therapy-duration/:id', getTherapyDuration);

module.exports = router;