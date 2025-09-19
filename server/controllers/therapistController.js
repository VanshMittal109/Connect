const bcrypt = require('bcrypt');
const { promisePool } = require('../config/database');


// Register a new therapist (MySQL)
exports.registerTherapist = async (req, res) => {
    try {
        const { email, password, name, contact, specialization, working_hours_start, working_hours_end } = req.body;
        if (!email || !password || !name || !contact || !specialization || !working_hours_start || !working_hours_end ) {
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
                [email, passwordHash, "therapist"]
            );

            // 2. Create therapist record
            await connection.execute(
                `INSERT INTO therapists (id, email, name, contact, specialization, working_hours_start, working_hours_end) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userResult.insertId, email, name, contact, specialization, working_hours_start, working_hours_end]
            );

            await connection.commit();
            res.status(201).json({ message: 'Therapist registered successfully', user_id: userResult.insertId });

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

// Create a new therapist (MySQL)
exports.createTherapist = async (req, res) => {
    try {
        const { email, password, name, contact, specialization, working_hours_start, working_hours_end } = req.body;
        if (!email || !password || !name || !contact || !specialization || !working_hours_start || !working_hours_end) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert into users table
        const [userResult] = await promisePool.execute(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, 'therapist']
        );

        // Insert into therapists table
        await promisePool.execute(
            'INSERT INTO therapists (user_id, name, contact, specialization, working_hours_start, working_hours_end) VALUES (?, ?, ?, ?, ?, ?)',
            [userResult.insertId, name, contact, specialization, working_hours_start, working_hours_end]
        );

        res.status(201).json({ message: 'Therapist created successfully', user_id: userResult.insertId });
    } catch (error) {
        console.error('MySQL insert error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Therapist dashboard controller
exports.therapistDashboard = async (req, res) => {
    // You can fetch therapist-specific data here using req.user.id
    res.json({
        message: 'Welcome to the therapist dashboard!',
        user: req.user
    });
};
