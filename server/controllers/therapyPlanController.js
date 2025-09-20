const { promisePool } = require('../config/database');

// Create therapy plan(s) for a patient and therapist
exports.createTherapyPlans = async (req, res) => {
    try {
        const { patient_id, therapist_id, therapies } = req.body;
        if (!patient_id || !therapist_id || !Array.isArray(therapies) || therapies.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Get joining_date from patient table
        const [patientRows] = await promisePool.execute(
            'SELECT joining_date FROM patients WHERE id = ?', [patient_id]
        );
        if (!patientRows.length) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        // Start date for first therapy: joining_date + 1 day
        let startDate = new Date(patientRows[0].joining_date);
        startDate.setDate(startDate.getDate() + 2);
        for (const t of therapies) {
            // Calculate end date
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + t.duration_days);
            // Insert row with start and end date
            await promisePool.execute(
                'INSERT INTO therapy_plans (patient_id, therapist_id, therapy_id, duration_days, gap_days, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [patient_id, therapist_id, t.therapy_id, t.duration_days, t.gap_days || 0,
                 startDate.toISOString().slice(0,10), endDate.toISOString().slice(0,10)]
            );
            // Next start date: previous end date + 1 day
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() + 1);
        }
        res.status(201).json({ message: 'Therapy plans created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to create therapy plans' });
    }
};
