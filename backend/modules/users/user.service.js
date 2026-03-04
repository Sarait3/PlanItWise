const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');


/* Register user:
   - Check duplicate email
   - Hash password
   - Save user
   - Return token + basic user info
 */
exports.register = async ({ name, email, password }) => {
  let user = await User.findOne({ email });

  if (user) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }

  user = new User({ name, email, password });

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  // Token payload stores user id
  const payload = { user: { id: user.id } };

  // Sign JWT (simple sync form)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};


// Get user profile (without password)
exports.getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
};


// Update monthly finances (income/expenses)
exports.updateFinances = async (userId, { monthlyIncome, monthlyExpenses }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { monthlyIncome, monthlyExpenses },
    { new: true }
  ).select('-password');

  if (!updatedUser) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return updatedUser;
};