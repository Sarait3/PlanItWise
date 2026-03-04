const express = require('express');
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler');
const auth = require('../../middleware/auth'); 
const controller = require('./milestone.controller');


// POST /milestones
// Creates a milestone for a goal
router.post('/', auth, asyncHandler(controller.createMilestone));


// PUT /milestones/achieve/:id
// Marks a milestone as achieved
router.put('/achieve/:id', auth, asyncHandler(controller.achieveMilestone));


// GET /milestones/daysRemaining/:id
// Returns days remaining until target date (optional feature)
router.get('/daysRemaining/:id', auth, asyncHandler(controller.getDaysRemaining));


// GET /milestones/goal/:goalId
// Returns milestones for a given goal (sorted by percentage)
router.get('/goal/:goalId', auth, asyncHandler(controller.getByGoal));


// DELETE /milestones/:id
// Deletes a milestone
router.delete('/:id', auth, asyncHandler(controller.deleteMilestone));


module.exports = router;
