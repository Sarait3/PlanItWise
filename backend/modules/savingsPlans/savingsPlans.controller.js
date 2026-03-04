const savingsPlansService = require('./savingsPlans.service');


//  Create savings plan
exports.createSavingsPlan = async (req, res) => {
  const savedPlan = await savingsPlansService.create(req.user.id, req.body);
  res.status(201).json(savedPlan);
};


//  Get payment dates for the next 12 periods
exports.getPaymentDates = async (req, res) => {
  const schedule = await savingsPlansService.getPaymentDates(
    req.user.id,
    req.params.goalId
  );

  res.json(schedule);
};


//   Update savings plan
exports.updateSavingsPlan = async (req, res) => {
  const updated = await savingsPlansService.update(
    req.user.id,
    req.params.id,
    req.body
  );

  res.json(updated);
};


//  Delete savings plan
exports.deleteSavingsPlan = async (req, res) => {
  await savingsPlansService.remove(req.user.id, req.params.id);
  res.json({ msg: 'Savings plan deleted' });
};


//  Pause savings plan
exports.pauseSavingsPlan = async (req, res) => {
  const plan = await savingsPlansService.setPaused(req.user.id, req.params.id, true);
  res.json({ msg: 'Saving plan paused', plan });
};


//  Resume savings plan
exports.resumeSavingsPlan = async (req, res) => {
  const plan = await savingsPlansService.setPaused(req.user.id, req.params.id, false);
  res.json({ msg: 'Saving plan resumed', plan });
};