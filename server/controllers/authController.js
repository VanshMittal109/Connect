// Get therapist credentials by therapist_id (for admin/testing)
const getTherapistCredentials = async (req, res) => {
  try {
    const { therapist_id } = req.body;
    if (!therapist_id) {
      return res.status(400).json({ error: 'therapist_id is required' });
    }
    const { data, error } = await supabase
      .from('therapists')
      .select('email, password')
      .eq('therapist_id', therapist_id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json({ email: data.email, password: data.password });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Register a new therapist
const registerTherapist = async (req, res) => {
  try {
    const { email, password, name, contact} = req.body;
    if (!email || !password || !name || !contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'therapist'
        }
      }
    });
    if (authError) throw authError;

    // 2. Create therapist profile in therapists table (do NOT store password)
    const { error: dbError } = await supabase
      .from('therapists')
      .insert([{
        therapist_id: authData.user.id,
        email,
        name,
        contact
      }]);
    if (dbError) throw dbError;

    res.status(201).json({
      message: 'Therapist registered successfully',
      userId: authData.user.id,
      email,
      name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Step 3: Add role detection from your tables
let supabase;

try {
  supabase = require('../config/supabaseClient');
  console.log('Supabase client loaded successfully');
} catch (error) {
  console.error('Failed to load Supabase client:', error);
}

// Simple auth check endpoint
const checkAuth = async (req, res) => {
  try {
    console.log('Auth check requested');
    
    // For now, just return not authenticated
    res.json({
      authenticated: false,
      message: 'Not authenticated'
    });

  } catch (error) {
    console.error('Auth check error:', error);
    res.json({
      authenticated: false,
      message: 'Auth check failed'
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    const userId = authData.user.id;

    // 2. Check user role from your tables
    let userRole = 'patient';
    let dashboardUrl = '/user-dashboard.html';

    try {
      // Check therapists table
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select('therapist_id')
        .eq('therapist_id', userId)
        .maybeSingle();

      if (therapistError) {
        console.log('Therapist query error (non-fatal):', therapistError.message);
      } else if (therapistData) {
        userRole = 'therapist';
        dashboardUrl = '/dashboard.html';
      } else {
        // Check patients table
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('patient_id')
          .eq('patient_id', userId)
          .maybeSingle();

        if (patientError) {
          console.log('Patient query error (non-fatal):', patientError.message);
        } else if (patientData) {
          userRole = 'patient';
          dashboardUrl = '/user-dashboard.html';
        }
      }
    } catch (dbError) {
      console.log('Database role check failed (non-fatal):', dbError.message);
      // Continue with default patient role
    }

    // 3. Return success with role information
    res.json({
      success: true,
      message: 'Sign-in successful',
      user: {
        id: userId,
        email: authData.user.email,
        role: userRole
      },
      redirectUrl: dashboardUrl
    });

  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error: ' + error.message 
    });
  }
};

// Logout controller
const signOut = async (req, res) => {
  try {
    // Clear auth cookies
    res.clearCookie('authToken');
    res.clearCookie('userRole');
    
    // Also sign out from Supabase auth
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('Supabase sign-out error:', error);
    }

    res.json({ 
      success: true,
      message: 'Signed out successfully' 
    });

  } catch (error) {
    console.error('Sign-out error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Logout failed' 
    });
  }
};



// Register a new patient (Supabase Auth + patients table)
const registerPatient = async (req, res) => {
  try {
    const { email, password, name, contact, gender } = req.body;
    if (!email || !password || !name || !contact || !gender) {
      return res.status(400).json({ error: 'Missing required fields (email, password, name, contact, gender)' });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'patient',
          gender
        }
      }
    });
    if (authError) throw authError;

    // 2. Create patient profile in patients table (do NOT store password)
    const { error: dbError } = await supabase
      .from('patients')
      .insert([{
        patient_id: authData.user.id,
        email,
        name,
        contact,
        gender
      }]);
    if (dbError) throw dbError;

    res.status(201).json({
      message: 'Patient registered successfully',
      userId: authData.user.id,
      email,
      name,
      gender
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signIn,
  checkAuth,
  signOut,
  registerTherapist,
  getTherapistCredentials,
  registerPatient
};
