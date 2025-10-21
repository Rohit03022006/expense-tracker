const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
      maxlength: [30, 'Category name cannot be more than 30 characters']
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense']
    },
    color: {
      type: String,
      default: '#6B7280'
    },
    icon: {
      type: String,
      default: 'receipt'
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

categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);