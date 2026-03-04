const express = require('express');
const cors = require('cors'); // HTTP cross-origin resource sharing

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Health Check
app.get('/', (req, res) => res.send('PlanIt Wise API is alive!'));

// Routes
app.use("/api/contributions", require("./modules/contributions/contribution.routes"));
app.use("/api/goals", require("./modules/goals/goal.routes"));
app.use("/api/savingsPlans", require("./modules/savingsPlans/savingPlans.routes"));
app.use("/api/milestones", require("./modules/milestones/milestone.routes"));
app.use("/api/users", require("./modules/users/user.routes"));
app.use("/api/auth", require("./modules/auth/auth.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;