// Main server file.
const express = require('express');
const connectDB = require('./config/db'); // Database connection
const cors = require('cors'); // HTTP cross-origin resource sharing
require('dotenv').config(); // Loads .env file contents into process.env

const app = express();

// 1. Connect Database
// Call function from /config/db.js
connectDB();

// 2. Middleware Setup
// Enable CORS for all routes, allows Angular app requests
app.use(cors()); 
// Initialize middleware
app.use(express.json({ extended: false })); 

// 3. Test Route
// GET route to confirm API
app.get('/', (req, res) => res.send('PlanIt Wise API is running!'));

// 4. Define API routes
// Connect our route files (uncommented)
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// 5. Start Server
// Get port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Listen and log message to console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));