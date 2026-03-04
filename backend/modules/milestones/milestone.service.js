const Milestone = require('./milestone.model');
const Goal = require('../goals/goal.model');

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

async function assertMilestoneOwner(milestoneId, userId) {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    const err = new Error('Milestone not found');
    err.statusCode = 404;
    throw err;
  }
  await assertGoalOwner(milestone.goal, userId);
  return milestone;
}

exports.createMilestone = async (userId, body) => {
  const { goal, title, percentage, auto, targetDate } = body;

  if (!goal || !title || percentage === undefined) {
    const err = new Error('goal, title, and percentage are required');
    err.statusCode = 400;
    throw err;
  }

  await assertGoalOwner(goal, userId);

  const pct = Number(percentage);
  if (!Number.isFinite(pct) || pct < 1 || pct > 100) {
    const err = new Error('percentage must be between 1 and 100');
    err.statusCode = 400;
    throw err;
  }

  const milestone = new Milestone({
    goal,
    title,
    percentage: pct,
    auto: !!auto,
    targetDate: targetDate ? new Date(targetDate) : null,
    achieved: false
  });

  return milestone.save();
};

exports.achieveMilestone = async (userId, milestoneId) => {
  const milestone = await assertMilestoneOwner(milestoneId, userId);
  milestone.achieved = true;
  await milestone.save();
  return milestone;
};

exports.getDaysRemaining = async (userId, milestoneId) => {
  const milestone = await assertMilestoneOwner(milestoneId, userId);

  if (!milestone.targetDate) {
    return { daysRemaining: null, msg: 'No target date set', targetDate: null };
  }

  const ms = new Date(milestone.targetDate).getTime() - Date.now();
  const days = Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 0);

  return { daysRemaining: days, targetDate: milestone.targetDate };
};

exports.getByGoal = async (userId, goalId) => {
  await assertGoalOwner(goalId, userId);
  return Milestone.find({ goal: goalId }).sort({ percentage: 1 });
};

exports.deleteMilestone = async (userId, milestoneId) => {
  const milestone = await assertMilestoneOwner(milestoneId, userId);
  await Milestone.findByIdAndDelete(milestone._id);
};