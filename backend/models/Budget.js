const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Please add a budget amount'],
      min: [0, 'Budget amount cannot be negative']
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2030
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

budgetSchema.index({ category: 1, month: 1, year: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);