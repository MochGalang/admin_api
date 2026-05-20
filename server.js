const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configurations
app.use(cors({
  origin: '*', // Allow all origins for compatibility (can be restricted in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import and register routes
const paketRouter = require('./routes/paket');
app.use('/api/paket', paketRouter);

// Base route for API health check
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Marco Travel Express JS API',
    status: 'Running'
  });
});

// Handling 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
  console.log(`📁 API paket travel: http://localhost:${PORT}/api/paket`);
  console.log(`=========================================`);
});
