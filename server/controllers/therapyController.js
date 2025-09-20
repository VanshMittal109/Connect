const { promisePool } = require('../config/database');

exports.getTherapies = async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT id, name FROM therapies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch therapies' });
  }
};

exports.getTherapyDuration = async (req, res) => {
  try {
    const therapyId = req.params.id;
    const [rows] = await promisePool.execute('SELECT duration_days FROM therapies WHERE id = ?', [therapyId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Therapy not found' });
    }
    res.json({ duration_days: rows[0].duration_days });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch therapy duration' });
  }
};

exports.getUserListForDropdown = async (req, res) => {
    try {
        const [therapistRows] = await promisePool.execute(
            'SELECT patient_list FROM therapists WHERE id = ?', [req.query.therapistId || 23]
        );
        if (!therapistRows.length) return res.json([]);
        let userIds = [];
        // patient_list may be a string, not JSON, so parse safely
        const patientList = therapistRows[0].patient_list;
        if (typeof patientList === 'string') {
            try {
                userIds = JSON.parse(patientList);
            } catch (e) {
                // fallback: try to eval if MySQL returns as string
                try {
                    userIds = eval(patientList);
                } catch (e2) {
                    return res.status(500).json({ error: 'Invalid patient_list format' });
                }
            }
        } else if (Array.isArray(patientList)) {
            userIds = patientList;
        }
        if (!Array.isArray(userIds) || !userIds.length) return res.json([]);
        const [patientRows] = await promisePool.query(
            `SELECT id, name FROM patients WHERE id IN (${userIds.map(() => '?').join(',')})`, userIds
        );
        res.json(patientRows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user list' });
    }
};