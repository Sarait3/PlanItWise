const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Goal = require('../../models/Goal');
const SavingsPlan = require('../../models/SavingsPlan');
const Milestone = require('../../models/Milestone');
const Contribution = require('../../models/Contribution');


// --------------------------------------
// 0. GET GOAL + CONTRIBUTIONS for LOGGED-IN USER
// --------------------------------------
router.get('/my-goal', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ user: req.user.id });

    if (!goal) {
      return res.status(404).json({ msg: "No goal found" });
    }

    // FETCH CONTRIBUTIONS linked to this goal
    const contributions = await Contribution.find({
      goal: goal._id
    }).sort({ date: 1 });

    // RETURN both goal and contributions together
    return res.json({
      ...goal.toObject(),
      contributions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// --------------------------------------
// 1. CREATE GOAL (Protected) + Auto Create Savings Plan
// --------------------------------------
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, targetAmount, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const goal = new Goal({
      user: req.user.id,
      title,
      description: description || "",
      targetAmount,
      deadline: new Date(deadline),
      currentAmount: 0,
      status: "active"
    });

    const savedGoal = await goal.save();

    // AUTO CREATE SAVINGS PLAN

    const today = new Date();
    const deadlineDate = new Date(deadline);

    const months =
      (deadlineDate.getFullYear() - today.getFullYear()) * 12 +
      (deadlineDate.getMonth() - today.getMonth());

    const safeMonths = Math.max(months, 1);

    const monthlyAmountRequired = Math.ceil(targetAmount / safeMonths);

    const savingsPlan = new SavingsPlan({
      goal: savedGoal._id,
      frequency: "monthly",
      amountPerPeriod: monthlyAmountRequired,
      nextContributionDate: today
    });

    const savedPlan = await savingsPlan.save();

    return res.status(201).json({
      goal: savedGoal,
      savingsPlan: savedPlan
    });

  } catch (err) {
    console.error("❌ Goal creation error:", err.message);
    return res.status(400).json({ error: err.message });
  }
});


// --------------------------------------
// 2. UPDATE GOAL PROGRESS
// --------------------------------------
router.put('/updateProgress/:id', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    goal.currentAmount += Number(amount);
    await goal.save();

    res.json({ msg: 'Progress updated', goal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 3. GET CURRENT PROGRESS
// --------------------------------------
router.get('/progress/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

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
router.get('/savingPlan/:goalId', auth, async (req, res) => {
  try {
    const plan = await SavingsPlan.findOne({ goal: req.params.goalId });
    if (!plan) return res.status(404).json({ msg: 'No saving plan exists for this goal' });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------
// 5. EDIT GOAL
// --------------------------------------
router.put('/:id', auth, async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 6. DELETE GOAL + related milestones + saving plan
// --------------------------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await SavingsPlan.deleteOne({ goal: req.params.id });
    await Milestone.deleteMany({ goal: req.params.id });
    await Goal.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Goal and related data deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
