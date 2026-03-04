const Goal = require('./goal.model');
const SavingsPlan = require('../savingsPlans/savingsPlan.model');
const Milestone = require('../milestones/milestone.model');
const Contribution = require('../contributions/contribution.model');

// Helper: Ensure goal belongs to authenticated user
function assertOwner(goal, userId) {
  if (goal.user.toString() !== userId) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
}

// Helpers: months remaining + monthly required
function getMonthsRemaining(today, deadline) {
  let months =
    (deadline.getFullYear() - today.getFullYear()) * 12 +
    (deadline.getMonth() - today.getMonth());

  // Adjust for day-of-month so we don’t count a partial month as full
  if (deadline.getDate() < today.getDate()) {
    months -= 1;
  }

  return Math.max(months, 1);
}

function sumContributions(contributions) {
  return contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
}

function getMonthlyRequired(targetAmount, currentAmount, deadline) {
  const today = new Date();
  const monthsRemaining = getMonthsRemaining(today, new Date(deadline));
  const remaining = Math.max(Number(targetAmount) - Number(currentAmount), 0);
  return Math.ceil(remaining / monthsRemaining);
}

/**
 * currentAmount is derived from Contribution collection
 * This function also persists goal.currentAmount to keep it cached
 */
exports.recalcCurrentAmount = async (userId, goalId) => {
  const goal = await Goal.findById(goalId);
  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  assertOwner(goal, userId);

  const contributions = await Contribution.find({ goal: goalId }).select('amount');
  const sum = contributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  // Persist cached total
  goal.currentAmount = sum;
  await goal.save();

  return goal;
};

/**
 * Refresh savings plan amountPerPeriod based on remaining amount
 */
exports.refreshSavingsPlan = async (userId, goalId) => {
  const goal = await Goal.findById(goalId);
  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  assertOwner(goal, userId);

  const plan = await SavingsPlan.findOne({ goal: goalId });
  if (!plan) return null;

  plan.amountPerPeriod = getMonthlyRequired(goal.targetAmount, goal.currentAmount, goal.deadline);
  await plan.save();

  return plan;
};

// Get goal for logged-in user with contributions
exports.getMyGoalWithContributions = async (userId) => {
  const goal = await Goal.findOne({ user: userId });
  if (!goal) {
    const err = new Error('No goal found');
    err.statusCode = 404;
    throw err;
  }

  const contributions = await Contribution.find({ goal: goal._id }).sort({ date: 1 });

  // derive from contributions 
  const currentAmount = sumContributions(contributions);

  // keep cached field synced
  if (Number(goal.currentAmount || 0) !== Number(currentAmount)) {
    goal.currentAmount = currentAmount;
    await goal.save();
  }

  const targetAmount = Number(goal.targetAmount || 0);
  const progressPercent = targetAmount
    ? Number(((currentAmount / targetAmount) * 100).toFixed(2))
    : 0;

  const plan = await SavingsPlan.findOne({ goal: goal._id });
  const monthlyRequired = plan ? Number(plan.amountPerPeriod) : null;

  return {
    ...goal.toObject(),
    currentAmount,
    progressPercent,
    monthlyRequired,
    contributions
  };
};

// Create goal and automatically generate savings plan
exports.createGoalWithSavingsPlan = async (userId, body) => {
  const { title, description, targetAmount, deadline } = body;

  if (!title || targetAmount === undefined || !deadline) {
    const err = new Error('Missing required fields');
    err.statusCode = 400;
    throw err;
  }

  const goal = new Goal({
    user: userId,
    title,
    description: description || '',
    targetAmount: Number(targetAmount),
    deadline: new Date(deadline),
    currentAmount: 0,
    status: 'active'
  });

  const savedGoal = await goal.save();

  const monthlyAmountRequired = getMonthlyRequired(
    savedGoal.targetAmount,
    savedGoal.currentAmount,
    savedGoal.deadline
  );

  const savingsPlan = new SavingsPlan({
    goal: savedGoal._id,
    frequency: 'monthly',
    amountPerPeriod: monthlyAmountRequired,
    nextContributionDate: new Date(),
    paused: false
  });

  const savedPlan = await savingsPlan.save();

  return {
    goal: savedGoal,
    savingsPlan: savedPlan
  };
};

// Calculate and return progress percentage (always consistent)
exports.getProgress = async (userId, goalId) => {
  // ensure cached currentAmount is correct before returning
  const goal = await exports.recalcCurrentAmount(userId, goalId);

  const progress = goal.targetAmount ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return {
    progress: Number(progress.toFixed(2)),
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount
  };
};

// Get savings plan associated with goal
exports.getSavingPlan = async (userId, goalId) => {
  const goal = await Goal.findById(goalId);

  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  assertOwner(goal, userId);

  const plan = await SavingsPlan.findOne({ goal: goalId });

  if (!plan) {
    const err = new Error('No saving plan exists for this goal');
    err.statusCode = 404;
    throw err;
  }

  return plan;
};

// Edit goal details (and keep plan in sync)
exports.editGoal = async (userId, goalId, updates) => {
  const goal = await Goal.findById(goalId);

  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  assertOwner(goal, userId);

  const updatedGoal = await Goal.findByIdAndUpdate(goalId, { $set: updates }, { new: true });

  // ensure currentAmount cached field is correct after edits
  await exports.recalcCurrentAmount(userId, goalId);

  // Keep plan in sync with new target/deadline/currentAmount
  await exports.refreshSavingsPlan(userId, goalId);

  return updatedGoal;
};

// Delete goal and related entities
exports.deleteGoalAndRelated = async (userId, goalId) => {
  const goal = await Goal.findById(goalId);

  if (!goal) {
    const err = new Error('Goal not found');
    err.statusCode = 404;
    throw err;
  }

  assertOwner(goal, userId);

  await SavingsPlan.deleteOne({ goal: goalId });
  await Milestone.deleteMany({ goal: goalId });
  await Contribution.deleteMany({ goal: goalId });
  await Goal.findByIdAndDelete(goalId);
};