const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'goal',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetDate: {
    type: Date
  },
  achieved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('milestone', MilestoneSchema);