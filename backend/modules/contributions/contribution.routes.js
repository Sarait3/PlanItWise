const express = require('express');
const router = express.Router();

const controller = require('./contribution.controller');
const asyncHandler = require('../../utils/asyncHandler');
const auth = require('../../middleware/auth');

// POST /contributions (Protected)
router.post('/', auth, asyncHandler(controller.createContribution));

// GET /contributions/goal/:goalId (Protected)
router.get('/goal/:goalId', auth, asyncHandler(controller.getByGoal));

// DELETE /contributions/:id (Protected)
router.delete('/:id', auth, asyncHandler(controller.deleteContribution));

module.exports = router;