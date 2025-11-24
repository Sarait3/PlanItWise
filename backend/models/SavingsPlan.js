const mongoose = require('mongoose');

const SavingsPlanSchema = new mongoose.Schema({
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'goal',
    required: true,
    unique: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly'],
    required: true
  },
  amountPerPeriod: {
    type: Number,
    required: true
  },
  nextContributionDate: {
    type: Date
  }
});

module.exports = mongoose.model('savingsPlan', SavingsPlanSchema);
