const goalService = require('./goal.service');

exports.getMyGoalWithContributions = async (req, res) => {
  const data = await goalService.getMyGoalWithContributions(req.user.id);
  res.json(data);
};

exports.createGoalWithSavingsPlan = async (req, res) => {
  const result = await goalService.createGoalWithSavingsPlan(req.user.id, req.body);
  res.status(201).json(result);
};

exports.getProgress = async (req, res) => {
  const progress = await goalService.getProgress(req.user.id, req.params.id);
  res.json(progress);
};

exports.getSavingPlan = async (req, res) => {
  const plan = await goalService.getSavingPlan(req.user.id, req.params.goalId);
  res.json(plan);
};

exports.editGoal = async (req, res) => {
  const goal = await goalService.editGoal(req.user.id, req.params.id, req.body);
  res.json(goal);
};

exports.deleteGoalAndRelated = async (req, res) => {
  await goalService.deleteGoalAndRelated(req.user.id, req.params.id);
  res.json({ msg: 'Goal and related data deleted' });
};