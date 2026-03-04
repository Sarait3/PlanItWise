const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const controller = require('./goal.controller');
const asyncHandler = require('../../utils/asyncHandler');

// GET /goals/my-goal
router.get('/my-goal', auth, asyncHandler(controller.getMyGoalWithContributions));

// POST /goals
router.post('/', auth, asyncHandler(controller.createGoalWithSavingsPlan));

// GET /goals/progress/:id
router.get('/progress/:id', auth, asyncHandler(controller.getProgress));

// GET /goals/savingPlan/:goalId
router.get('/savingPlan/:goalId', auth, asyncHandler(controller.getSavingPlan));

// PUT /goals/:id
router.put('/:id', auth, asyncHandler(controller.editGoal));

// DELETE /goals/:id
router.delete('/:id', auth, asyncHandler(controller.deleteGoalAndRelated));

module.exports = router;