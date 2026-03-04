const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const asyncHandler = require('../../utils/asyncHandler');
const controller = require('./auth.controller');

// @route   GET api/auth
router.get('/', auth, asyncHandler(controller.getLoggedInUser)
);

// @route   POST api/auth
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  asyncHandler(controller.login)
);

module.exports = router;