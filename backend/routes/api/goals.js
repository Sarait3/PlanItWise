const express = require('express');
const router = express.Router();
const Goal = require('../../models/Goal');
const SavingsPlan = require('../../models/SavingsPlan');
const Milestone = require('../../models/Milestone');

// --------------------------------------
// 1. CREATE GOAL
// --------------------------------------
router.post('/', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 2. UPDATE GOAL PROGRESS (add to currentAmount)
// --------------------------------------
router.put('/updateProgress/:id', async (req, res) => {
  try {
    const { amount } = req.body;

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    goal.currentAmount += Number(amount);
    await goal.save();

    res.json({ msg: 'Progress updated', goal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 3. GET CURRENT PROGRESS (percentage)
// --------------------------------------
router.get('/progress/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    res.json({
      progress: progress.toFixed(2),
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------
// 4. GET SAVING PLAN FOR THIS GOAL
// --------------------------------------
router.get('/savingPlan/:goalId', async (req, res) => {
  try {
    const plan = await SavingsPlan.findOne({ goal: req.params.goalId });

    if (!plan) return res.status(404).json({ msg: 'No saving plan exists for this goal' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------
// 5. EDIT GOAL (generic update)
// --------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedGoal) return res.status(404).json({ msg: 'Goal not found' });

    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 6. DELETE GOAL + related milestones + saving plan
// --------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    await SavingsPlan.deleteOne({ goal: req.params.id });
    await Milestone.deleteMany({ goal: req.params.id });
    await Goal.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Goal and related data deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
