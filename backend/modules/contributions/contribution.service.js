const Contribution = require('./contribution.model');
const Goal = require('../goals/goal.model');
const goalService = require('../goals/goal.service');

/** Helper: Ensure goal belongs to authenticated user */
async function assertGoalOwner(goalId, userId) {
  const goal = await Goal.findById(goalId);
  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  if (goal.user.toString() !== userId) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  return goal;
}

/** Helper: Ensure contribution belongs to authenticated user (via its goal) */
async function assertContributionOwner(contributionId, userId) {
  const contribution = await Contribution.findById(contributionId);
  if (!contribution) {
    const err = new Error('Contribution not found');
    err.statusCode = 404;
    throw err;
  }

  await assertGoalOwner(contribution.goal, userId);
  return contribution;
}

/**
 * Create a contribution and recalc goal totals
 * Returns: { contribution, goal, savingsPlan }
 */
exports.createContribution = async (userId, body) => {
  const { goal, amount, date, note } = body;

  if (!goal || amount === undefined) {
    const err = new Error('goal and amount are required');
    err.statusCode = 400;
    throw err;
  }

  await assertGoalOwner(goal, userId);

  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) {
    const err = new Error('amount must be a positive number');
    err.statusCode = 400;
    throw err;
  }

  const saved = await Contribution.create({
    goal,
    amount: num,
    date: date ? new Date(date) : new Date(),
    note: note || ''
  });

  const updatedGoal = await goalService.recalcCurrentAmount(userId, goal);
  const updatedPlan = await goalService.refreshSavingsPlan(userId, goal);

  return {
    contribution: saved,
    goal: updatedGoal,
    savingsPlan: updatedPlan
  };
};

/**
 * Get contributions for a goal (owner only)
 */
exports.getByGoal = async (userId, goalId) => {
  await assertGoalOwner(goalId, userId);
  return Contribution.find({ goal: goalId }).sort({ date: 1 });
};

/**
 * Delete a contribution and recalc totals
 * Returns: { msg, goal, savingsPlan }
 */
exports.deleteContribution = async (userId, contributionId) => {
  const contribution = await assertContributionOwner(contributionId, userId);

  const goalId = contribution.goal;
  await Contribution.findByIdAndDelete(contributionId);

  const updatedGoal = await goalService.recalcCurrentAmount(userId, goalId);
  const updatedPlan = await goalService.refreshSavingsPlan(userId, goalId);

  return {
    msg: 'Contribution deleted',
    goal: updatedGoal,
    savingsPlan: updatedPlan
  };
};

/**
 * Update a contribution and recalc totals
 * Returns: { contribution, goal, savingsPlan }
 */
exports.updateContribution = async (userId, contributionId, body) => {
  const contribution = await assertContributionOwner(contributionId, userId);

  if (body.amount !== undefined) {
    const num = Number(body.amount);
    if (!Number.isFinite(num) || num <= 0) {
      const err = new Error('amount must be a positive number');
      err.statusCode = 400;
      throw err;
    }
    contribution.amount = num;
  }

  if (body.date !== undefined) {
    contribution.date = body.date ? new Date(body.date) : contribution.date;
  }

  if (body.note !== undefined) {
    contribution.note = body.note ?? contribution.note;
  }

  const saved = await contribution.save();

  const updatedGoal = await goalService.recalcCurrentAmount(userId, contribution.goal);
  const updatedPlan = await goalService.refreshSavingsPlan(userId, contribution.goal);

  return {
    contribution: saved,
    goal: updatedGoal,
    savingsPlan: updatedPlan
  };
};