/**
 * StaffSync - Modern Human Resource Management Solution
 * Backend Entry Point (Express.js + Mongoose)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const trainingRoutes = require('./routes/trainingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root API Information
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const readyStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  res.status(200).json({
    status: 'healthy',
    system: 'StaffSync HRM Backend API',
    database: {
      type: 'MongoDB',
      status: readyStateMap[mongoose.connection.readyState] || 'Unknown',
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'localhost',
      name: mongoose.connection.name || 'staffsync',
    },
    timezone: 'Asia/Kolkata (IST)',
    timestamp: new Date().toISOString(),
  });
});

// Database status & configuration endpoint
app.get('/api/database/status', (req, res) => {
  const mongoose = require('mongoose');
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const state = states[mongoose.connection.readyState] || 'Unknown';
  res.json({
    success: true,
    connected: mongoose.connection.readyState === 1,
    status: state,
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || 'staffsync',
    collections: ['users', 'employees', 'leaves', 'attendances', 'announcements', 'trainings'],
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/trainings', trainingRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on StaffSync API`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[StaffSync Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Express Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`StaffSync HRM Server operational on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
