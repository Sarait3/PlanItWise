const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'goal',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  percentage: {
    type: Number,
    required: true
  },

  auto: {
    type: Boolean,
    default: false
  },

  achieved: {
    type: Boolean,
    default: false
  },

  targetDate: {
    type: Date
  }
});

module.exports = mongoose.model('milestone', MilestoneSchema);
