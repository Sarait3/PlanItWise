const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const asyncHandler = require('../../utils/asyncHandler');
const controller = require('./user.controller');


/* POST /users
   Registers a new user (returns token + basic user info)
*/
router.post(
  '/',
  [
    check('name', 'Name required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  asyncHandler(controller.register)
);


/* GET /users/me
   Returns authenticated user profile (without password)
 */
router.get(
  '/me',
  auth,
  asyncHandler(controller.getMe)
);


/* PUT /users/finances
   Updates user's monthly income/expenses
 */
router.put(
  '/finances',
  auth,
  asyncHandler(controller.updateFinances)
);

module.exports = router;