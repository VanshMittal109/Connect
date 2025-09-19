const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// Sign-in controller for MySQL
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user in MySQL
    const [users] = await promisePool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 2. Verify password
  const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Check role in appropriate table
    let userRole = user.role;
    let dashboardUrl = '/html/patient-dashboard.html';

    if (user.role === 'therapist') {
      const [therapists] = await promisePool.execute(
        'SELECT * FROM therapists WHERE id = ?',
        [user.id]
      );
      if (therapists.length > 0) {
        dashboardUrl = '/html/therapist-dashboard.html';
      }
    } else if (user.role === 'patient') {
      const [patients] = await promisePool.execute(
        'SELECT * FROM patients WHERE id = ?',
        [user.id]
      );
      if (patients.length > 0) {
        dashboardUrl = '/html/therapist-dashboard.html';
      }
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Set cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('userRole', user.role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    // 6. Return success
    res.json({
      success: true,
      message: 'Sign-in successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      redirectUrl: dashboardUrl
    });

  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Sign-out controller
const signOut = (req, res) => {
  res.clearCookie('authToken');
  res.clearCookie('userRole');
  res.json({ success: true, message: 'Signed out successfully' });
};

module.exports = {
  signIn,
  signOut
};
