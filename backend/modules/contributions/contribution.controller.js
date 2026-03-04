const contributionService = require('./contribution.service');

exports.createContribution = async (req, res) => {
  const result = await contributionService.createContribution(req.user.id, req.body);
  res.status(201).json(result);
};

exports.getByGoal = async (req, res) => {
  const contributions = await contributionService.getByGoal(req.user.id, req.params.goalId);
  res.json(contributions);
};

exports.deleteContribution = async (req, res) => {
  const result = await contributionService.deleteContribution(req.user.id, req.params.id);
  res.json(result);
};

// Optional
exports.updateContribution = async (req, res) => {
  const result = await contributionService.updateContribution(req.user.id, req.params.id, req.body);
  res.json(result);
};