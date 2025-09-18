const bcrypt = require('bcrypt');
const { promisePool } = require('../config/database');

// Create a new therapist (MySQL)
exports.createTherapist = async (req, res) => {
    try {
        const { email, password, name, specialization } = req.body;
        if (!email || !password || !name || !specialization) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert into users table
        const [userResult] = await promisePool.execute(
            'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
            [email, passwordHash, 'therapist', name]
        );

        // Insert into therapists table
        await promisePool.execute(
            'INSERT INTO therapists (user_id, specialization) VALUES (?, ?)',
            [userResult.insertId, specialization]
        );

        res.status(201).json({ message: 'Therapist created successfully', user_id: userResult.insertId });
    } catch (error) {
        console.error('MySQL insert error:', error);
        res.status(500).json({ error: error.message });
    }
};
