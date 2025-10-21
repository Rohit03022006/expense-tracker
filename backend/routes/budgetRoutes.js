const express = require('express');
const {
  getBudgets,
  getCurrentBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/current')
  .get(getCurrentBudgets);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;