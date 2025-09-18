const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const appRoutes = require('./routes/appRoutes');
app.use('/api', appRoutes);


// Serve main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Add this before the catch-all route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/test`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});