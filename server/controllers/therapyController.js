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