const Budget = require('../models/Budget');
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const getBudgets = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;
    
    let filter = { user: req.user.id, year: parseInt(year) };
    if (month) filter.month = parseInt(month);

    const budgets = await Budget.find(filter)
      .populate('category', 'name color type')
      .sort({ month: 1 });

    res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching budgets',
      error: error.message
    });
  }
};

const getCurrentBudgets = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const budgets = await Budget.find({
      user: req.user.id,
      year: currentYear,
      month: currentMonth
    }).populate('category', 'name color type');

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const expenses = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          actualSpending: { $sum: '$amount' }
        }
      }
    ]);

    const budgetsWithSpending = budgets.map(budget => {
      const expense = expenses.find(exp => exp._id.toString() === budget.category._id.toString());
      return {
        ...budget.toObject(),
        actualSpending: expense ? expense.actualSpending : 0,
        remaining: budget.amount - (expense ? expense.actualSpending : 0),
        overspent: expense ? expense.actualSpending > budget.amount : false
      };
    });

    res.json({
      success: true,
      data: budgetsWithSpending
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching current budgets',
      error: error.message
    });
  }
};

const createBudget = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.body.category,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const budget = await Budget.create({
      ...req.body,
      user: req.user.id
    });

    const populatedBudget = await Budget.findById(budget._id)
      .populate('category', 'name color type');

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: populatedBudget
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget for this category and period already exists'
      });
    }
    
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating budget',
      error: error.message
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name color type');

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget for this category and period already exists'
      });
    }
    
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating budget',
      error: error.message
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Budget deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting budget',
      error: error.message
    });
  }
};

module.exports = {
  getBudgets,
  getCurrentBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};