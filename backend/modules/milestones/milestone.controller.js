const milestoneService = require('./milestone.service');

exports.createMilestone = async (req, res) => {
  const saved = await milestoneService.createMilestone(req.user.id, req.body);
  res.status(201).json(saved);
};

exports.achieveMilestone = async (req, res) => {
  const milestone = await milestoneService.achieveMilestone(req.user.id, req.params.id);
  res.json({ msg: 'Milestone marked as achieved', milestone });
};

exports.getDaysRemaining = async (req, res) => {
  res.json(await milestoneService.getDaysRemaining(req.user.id, req.params.id));
};

exports.getByGoal = async (req, res) => {
  res.json(await milestoneService.getByGoal(req.user.id, req.params.goalId));
};

exports.deleteMilestone = async (req, res) => {
  await milestoneService.deleteMilestone(req.user.id, req.params.id);
  res.json({ msg: 'Milestone deleted' });
};
