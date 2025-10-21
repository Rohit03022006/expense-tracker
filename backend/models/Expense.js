const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: [100, 'Description cannot be more than 100 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    tags: [String],
    receipt: String
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);