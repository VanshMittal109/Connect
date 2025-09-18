const express = require('express');
const router = express.Router();
const { signIn, checkAuth, signOut, registerTherapist } = require('../controllers/authController');
// POST /api/auth/register-therapist
router.post('/register-therapist', registerTherapist);

// Add this route
router.post('/signout', signOut);

// POST /api/auth/signin
router.post('/signin', signIn);

// GET /api/auth/check - Add this route
router.get('/check', checkAuth);
;

module.exports = router;