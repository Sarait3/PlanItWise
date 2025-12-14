// Main server file.
const express = require('express');
const connectDB = require('./config/db'); // Database connection
const cors = require('cors'); // HTTP cross-origin resource sharing
require('dotenv').config(); // Loads .env file contents into process.env

const app = express();

const goalsRoute = require("./routes/api/goals");
const savingPlansRoute = require("./routes/api/savingPlans");
const milestoneRoute = require("./routes/api/milestones");
const contributionRoute = require("./routes/api/contributions"); 


// Connect Database
connectDB();

app.use(cors()); 
app.use(express.json({ extended: false })); 

// Test Route
// GET route, confirm API
app.get('/', (req, res) => res.send('PlanIt Wise API is alive!'));

// Define API routes
// Connect our route files
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// Added  by Monofy for goal, savingplan and milestone
app.use("/api/goals", goalsRoute);
app.use("/api/saving-plans", savingPlansRoute);


app.use("/api/milestones", milestoneRoute);
app.use("/api/contributions", contributionRoute);


// Start Server
// Get port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

// Listen/log message to console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));