/**
 * StaffSync - Database Connection Config (Mongoose)
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/staffsync', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // In production/deployment without active Mongo, log warning rather than halting server
    if (process.env.NODE_ENV === 'production') {
      console.warn('Continuing server execution; database connection will retry on request.');
    } else {
      console.warn('Ensure MongoDB daemon is running locally (mongod) or configure MONGO_URI in .env');
    }
    return null;
  }
};

module.exports = connectDB;
