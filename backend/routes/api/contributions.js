const express = require('express');
const router = express.Router();
const Contribution = require('../../models/Contribution');

// -----------------------------------------------------------
// 1. CREATE a Contribution
// POST /contributions
// -----------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const contribution = new Contribution(req.body);
    const saved = await contribution.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -----------------------------------------------------------
// 2. GET all contributions for a specific goal
// GET /contributions/goal/:goalId
// -----------------------------------------------------------
router.get('/goal/:goalId', async (req, res) => {
  try {
    const contributions = await Contribution.find({
      goal: req.params.goalId
    }).sort({ date: 1 });

    res.json(contributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------
// 3. DELETE a contribution
// DELETE /contributions/:id
// -----------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contribution.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }

    res.json({ msg: 'Contribution deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
