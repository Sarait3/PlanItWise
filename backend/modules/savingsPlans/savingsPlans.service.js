const moment = require('moment');

const SavingsPlan = require('./savingsPlan.model');
const Goal = require('../goals/goal.model');


// Helper: Ensure the goal belongs to authenticated user
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


// Create savings plan 
exports.create = async (userId, body) => {
  if (!body.goal) {
    const err = new Error('goal is required');
    err.statusCode = 400;
    throw err;
  }

  await assertGoalOwner(body.goal, userId);

  const plan = new SavingsPlan(body);
  return plan.save();
};


//  Generate payment schedule for next 12 periods
exports.getPaymentDates = async (userId, goalId) => {
  await assertGoalOwner(goalId, userId);

  const plan = await SavingsPlan.findOne({ goal: goalId });
  if (!plan) {
    const err = new Error('No saving plan found');
    err.statusCode = 404;
    throw err;
  }

  const dates = [];
  let current = moment(plan.nextContributionDate || new Date());

  for (let i = 0; i < 12; i++) {
    dates.push(current.format('YYYY-MM-DD'));

    if (plan.frequency === 'weekly') current = current.add(7, 'days');
    else if (plan.frequency === 'bi-weekly') current = current.add(14, 'days');
    else current = current.add(1, 'month'); // default monthly
  }

  return { paymentSchedule: dates };
};


//  Update savings plan (checks ownership via goal)
exports.update = async (userId, planId, updates) => {
  const plan = await SavingsPlan.findById(planId);
  if (!plan) {
    const err = new Error('Plan not found');
    err.statusCode = 404;
    throw err;
  }

  await assertGoalOwner(plan.goal, userId);

  const updated = await SavingsPlan.findByIdAndUpdate(
    planId,
    { $set: updates },
    { new: true }
  );

  return updated;
};


//  Delete savings plan (checks ownership via goal)
exports.remove = async (userId, planId) => {
  const plan = await SavingsPlan.findById(planId);
  if (!plan) {
    const err = new Error('Plan not found');
    err.statusCode = 404;
    throw err;
  }

  await assertGoalOwner(plan.goal, userId);

  await SavingsPlan.findByIdAndDelete(planId);
};


//  Pause/Resume savings plan (checks ownership via goal)
exports.setPaused = async (userId, planId, paused) => {
  const plan = await SavingsPlan.findById(planId);
  if (!plan) {
    const err = new Error('Plan not found');
    err.statusCode = 404;
    throw err;
  }

  await assertGoalOwner(plan.goal, userId);

  plan.paused = paused;
  await plan.save();

  return plan;
};