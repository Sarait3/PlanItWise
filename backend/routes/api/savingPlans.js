const express = require('express');
const router = express.Router();
const SavingsPlan = require('../../models/SavingsPlan');
const moment = require('moment');

// --------------------------------------
// 1. CREATE SAVINGS PLAN
// --------------------------------------
router.post('/', async (req, res) => {
  try {
    const plan = new SavingsPlan(req.body);
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 2. SHOW PAYMENT DATES FOR NEXT 12 MONTHS
// --------------------------------------
router.get('/paymentDates/:goalId', async (req, res) => {
  try {
    const plan = await SavingsPlan.findOne({ goal: req.params.goalId });
    if (!plan) return res.status(404).json({ msg: 'No saving plan found' });

    const dates = [];
    let current = moment(plan.nextContributionDate || moment());

    for (let i = 0; i < 12; i++) {
      dates.push(current.format('YYYY-MM-DD'));

      if (plan.frequency === 'weekly') current = current.add(7, 'days');
      if (plan.frequency === 'bi-weekly') current = current.add(14, 'days');
      if (plan.frequency === 'monthly') current = current.add(1, 'month');
    }

    res.json({ paymentSchedule: dates });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------
// 3. UPDATE SAVINGS PLAN
// --------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const updatedPlan = await SavingsPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPlan) return res.status(404).json({ msg: 'Plan not found' });

    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 4. DELETE SAVINGS PLAN
// --------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    await SavingsPlan.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Savings plan deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------------------
// 5. PAUSE SAVINGS PLAN
// --------------------------------------
router.put('/pause/:id', async (req, res) => {
  try {
    const plan = await SavingsPlan.findById(req.params.id);

    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    plan.paused = true;
    await plan.save();

    res.json({ msg: 'Saving plan paused', plan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------------------------------------
// 6. RESUME SAVINGS PLAN
// --------------------------------------
router.put('/resume/:id', async (req, res) => {
  try {
    const plan = await SavingsPlan.findById(req.params.id);

    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    plan.paused = false;
    await plan.save();

    res.json({ msg: 'Saving plan resumed', plan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
