
const express = require('express');
const cors = require('cors');
const path = require('path');
require('../Connect/node_modules/dotenv/lib/main').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, './public')));

// Import and use therapy routes
const therapyRoutes = require('./routes/therapyRoutes');
app.use('/api/therapies', therapyRoutes);

// Import and use patient routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Serve HTML page for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/createUser.html'));
});


// Endpoint to provide Supabase credentials to frontend
app.get('/api/supabase-credentials', (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: ['/api/health', '/api/therapies', '/api/supabase-credentials']
  });
});

// Catch-all route for frontend - MUST be last
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`💊 Therapies API: http://localhost:${PORT}/api/therapies`);
});