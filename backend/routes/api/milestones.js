const express = require('express');
const router = express.Router();
const Milestone = require('../../models/Milestone');
const moment = require('moment');


// --------------------------------------
// 1. CREATE MILESTONE
// --------------------------------------
router.post('/', async (req, res) => {
  try {
    const { goal, title, percentage, auto, targetDate } = req.body;

    if (!goal || !title || percentage === undefined) {
      return res.status(400).json({ 
        error: "goal, title, and percentage are required" 
      });
    }

    const milestone = new Milestone({
      goal,
      title,
      percentage,
      auto: auto ?? false,
      targetDate: targetDate || null,
      achieved: false
    });

    const saved = await milestone.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --------------------------------------
// 2. MARK MILESTONE AS ACHIEVED
// --------------------------------------
router.put('/achieve/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ msg: 'Milestone not found' });
    }

    milestone.achieved = true;
    await milestone.save();

    res.json({
      msg: 'Milestone marked as achieved',
      milestone
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --------------------------------------
// 3. DAYS REMAINING (OPTIONAL FEATURE)
// --------------------------------------
router.get('/daysRemaining/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return res.status(404).json({ msg: 'Milestone not found' });

    if (!milestone.targetDate) {
      return res.json({ daysRemaining: null, msg: 'No target date set' });
    }

    const now = moment();
    const target = moment(milestone.targetDate);
    const diff = target.diff(now, 'days');

    res.json({
      daysRemaining: diff >= 0 ? diff : 0,
      targetDate: milestone.targetDate
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// --------------------------------------
// 4. GET ALL MILESTONES FOR A GOAL
// --------------------------------------
router.get('/goal/:goalId', async (req, res) => {
  try {
    const milestones = await Milestone.find({ goal: req.params.goalId })
      .sort({ percentage: 1 });   // Sorted logically

    res.json(milestones);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --------------------------------------
// 5. DELETE MILESTONE
// --------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Milestone.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: 'Milestone not found' });
    }

    res.json({ msg: 'Milestone deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
