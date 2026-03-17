const { validationResult } = require('express-validator');
const userService = require('./user.service');

// Register a new user
exports.register = async (req, res) => {
  // Read validation results from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const result = await userService.register(req.body);
  res.json(result);
};

// Get logged-in user profile
exports.getMe = async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json(user);
};

// Update user finances
exports.updateFinances = async (req, res) => {
  const updated = await userService.updateFinances(req.user.id, req.body);
  res.json(updated);
};