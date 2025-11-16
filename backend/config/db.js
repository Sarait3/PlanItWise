// This file handles connection to MongoDB database.

const mongoose = require('mongoose');
// The 'dotenv' loads connection string from .env file.
require('dotenv').config();

// The async function connects to database.
const connectDB = async () => {
  try {
    // Try to connect to database using MONGO_URI from .env file.
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected Successfully.');
  } catch (err) {
    // If connection fails, log error and exit app.
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;