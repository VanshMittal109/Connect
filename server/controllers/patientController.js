const supabase = require('../config/supabaseClient');

// Create a new patient
exports.createPatient = async (req, res) => {
    const { name, contact, email, joining_date, age, gender } = req.body;
    const { data, error } = await supabase
        .from('patients')
        .insert([{ name, contact, email, joining_date, age, gender }]);
    if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message, details: error.details });
    }
    res.status(201).json({ message: 'Patient created', patient: data && data[0] });
};
