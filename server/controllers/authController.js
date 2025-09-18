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
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Check role in appropriate table
    let userRole = user.role;
    let dashboardUrl = '/html/user-dashboard.html';

    if (user.role === 'therapist') {
      const [therapists] = await promisePool.execute(
        'SELECT * FROM therapists WHERE user_id = ?',
        [user.id]
      );
      if (therapists.length > 0) {
        dashboardUrl = '/html/dashboard.html';
      }
    } else if (user.role === 'patient') {
      const [patients] = await promisePool.execute(
        'SELECT * FROM patients WHERE user_id = ?',
        [user.id]
      );
      if (patients.length > 0) {
        dashboardUrl = '/html/dashboard.html';
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

// Patient registration
const registerPatient = async (req, res) => {
  try {
    const { email, password, name, contact, dateOfBirth } = req.body;

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    const connection = await promisePool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Create user
      const [userResult] = await connection.execute(
        `INSERT INTO users (email, password_hash, role, name, contact, date_of_birth) 
         VALUES (?, ?, 'patient', ?, ?, ?)`,
        [email, passwordHash, name, contact, dateOfBirth]
      );

      // 2. Create patient record
      await connection.execute(
        `INSERT INTO patients (user_id, medical_history) 
         VALUES (?, ?)`,
        [userResult.insertId, '']
      );

      await connection.commit();
      res.status(201).json({ message: 'Patient registered successfully' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports = {
  signIn,
  registerPatient
};
