const User = require('../users/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// GET logged in user
exports.getLoggedInUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// POST login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

  const payload = { user: { id: user.id } };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 36000 }
  );

  const userData = await User.findById(user.id).select('-password');

  res.json({
    token,
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email
    }
  });
};