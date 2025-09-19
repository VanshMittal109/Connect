const bcrypt = require('bcrypt');
const { promisePool } = require('../config/database');

// Register a new patient (MySQL)
exports.registerPatient = async (req, res) => {
    try {
        const { email, password, name, contact, dateOfBirth, gender, joining_date } = req.body;
        if (!email || !password || !name || !contact || !dateOfBirth || !gender || !joining_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Start transaction
        const connection = await promisePool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Create user
            const [userResult] = await connection.execute(
                `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
                [email, passwordHash, 'patient']
            );

            // 2. Create patient record
            await connection.execute(
                `INSERT INTO patients (id, email, name, contact, date_of_birth, gender, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userResult.insertId, email, name, contact, dateOfBirth, gender, joining_date]
            );

            await connection.commit();
            res.status(201).json({ message: 'Patient registered successfully', user_id: userResult.insertId });

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


// Create a new patient (MySQL)
exports.createPatient = async (req, res) => {
    try {
        const { email, password, name, contact, dateOfBirth, gender, joining_date } = req.body;
        if (!email || !password || !name || !contact || !dateOfBirth || !gender || !joining_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert into users table
        const [userResult] = await promisePool.execute(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, passwordHash, 'patient']
        );

        // Insert into patients table
        await promisePool.execute(
            'INSERT INTO patients (id, email, name, contact, date_of_birth, gender, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userResult.insertId, email, name, contact, dateOfBirth, gender, joining_date]
        );

        res.status(201).json({ message: 'Patient created successfully', user_id: userResult.insertId });
    } catch (error) {
        console.error('MySQL insert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Patient dashboard controller
exports.patientDashboard = async (req, res) => {
    // You can fetch patient-specific data here using req.user.id
    res.json({
        message: 'Welcome to the patient dashboard!',
        user: req.user
    });
};
