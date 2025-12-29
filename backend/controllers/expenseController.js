const Expense = require('../models/Expense');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search
    } = req.query;

    let filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    const expenses = await Expense.find(filter)
      .populate('category', 'name color type')
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: expenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('category', 'name color type');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message
    });
  }
};

const createExpense = async (req, res) => {
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

    const expense = await Expense.create({
      ...req.body,
      user: req.user.id
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('category', 'name color type');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: populatedExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (req.body.category) {
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
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name color type');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;

    const dateFilter = {
      user: new mongoose.Types.ObjectId(req.user.id),
      date: {
        $gte: new Date(year, month ? month - 1 : 0, 1),
        $lte: new Date(year, month ? month : 12, 0)
      }
    };

    const categoryStats = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          category: '$category.name',
          color: '$category.color',
          type: '$category.type',
          total: 1,
          count: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    const monthlyStats = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const currentDate = new Date();
    const currentMonthFilter = {
      user: new mongoose.Types.ObjectId(req.user.id),
      date: {
        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        $lte: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      }
    };

    const currentMonthStats = await Expense.aggregate([
      { $match: currentMonthFilter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = currentMonthStats.find(stat => stat._id === 'income')?.total || 0;
    const expense = currentMonthStats.find(stat => stat._id === 'expense')?.total || 0;

    res.json({
      success: true,
      data: {
        categoryStats,
        monthlyStats,
        currentMonth: {
          income,
          expense,
          savings: income - expense
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};