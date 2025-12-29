const express = require('express');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { validateExpense } = require('../utils/validation');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(validateExpense, handleValidationErrors, createExpense);

router.route('/stats')
  .get(getExpenseStats);

router.route('/:id')
  .get(getExpense)
  .put(validateExpense, handleValidationErrors, updateExpense)
  .delete(deleteExpense);

module.exports = router;