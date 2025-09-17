const supabase = require('../config/supabaseClient');

// Get all therapy processes for the dropdown
const getAllTherapies = async (req, res) => {
  try {
    console.log('Fetching therapies for dropdown...');
    
    const { data, error } = await supabase
      .from('therapy_processes')
      .select('name, type, duration, description');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch therapies',
        details: error.message 
      });
    }

    console.log(`Found ${data.length} therapies`);
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching therapies:', error);
    res.status(500).json({ 
      error: 'Server error fetching therapies'
    });
  }
};

module.exports = {
  getAllTherapies
};