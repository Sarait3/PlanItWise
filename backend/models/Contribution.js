const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'goal',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('contribution', ContributionSchema);