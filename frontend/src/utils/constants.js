export const APP_CONFIG = {
  NAME: 'ExpenseTracker',
  VERSION: '1.0.0',
  DESCRIPTION: 'Personal Expense Tracking Application',
  DEFAULT_CURRENCY: 'INR',
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CNY']
};
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
    UPDATE_PROFILE: '/auth/profile'
  },
  EXPENSES: {
    BASE: '/expenses',
    STATS: '/expenses/stats'
  },
  CATEGORIES: {
    BASE: '/categories'
  },
  BUDGETS: {
    BASE: '/budgets',
    CURRENT: '/budgets/current'
  },
  EXPORT: {
    CSV: '/export/expenses/csv',
    JSON: '/export/expenses/json',
    PDF: '/export/expenses/pdf',
    BACKUP: '/export/backup',
    FINANCIAL_REPORT: '/export/financial-report'
  }
};
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CATEGORY_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#6B7280', '#84CC16', '#06B6D4', '#F97316',
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#EAB308'
];

export const DEFAULT_CATEGORIES = [
  // Expense Categories
  { name: 'Food & Dining', type: 'expense', color: '#EF4444' },
  { name: 'Shopping', type: 'expense', color: '#8B5CF6' },
  { name: 'Transportation', type: 'expense', color: '#3B82F6' },
  { name: 'Entertainment', type: 'expense', color: '#EC4899' },
  { name: 'Bills & Utilities', type: 'expense', color: '#10B981' },
  { name: 'Healthcare', type: 'expense', color: '#06B6D4' },
  { name: 'Education', type: 'expense', color: '#F59E0B' },
  { name: 'Travel', type: 'expense', color: '#6366F1' },
  
  // Income Categories
  { name: 'Salary', type: 'income', color: '#10B981' },
  { name: 'Freelance', type: 'income', color: '#3B82F6' },
  { name: 'Investment', type: 'income', color: '#8B5CF6' },
  { name: 'Bonus', type: 'income', color: '#F59E0B' },
  { name: 'Gifts', type: 'income', color: '#EC4899' },
  { name: 'Other Income', type: 'income', color: '#6B7280' }
];

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/
  },
  DESCRIPTION: {
    MAX_LENGTH: 100
  },
  CATEGORY_NAME: {
    MAX_LENGTH: 30
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 1000000000 // 1 billion
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const CHART_COLORS = {
  INCOME: '#16A34A',
  EXPENSE: '#DC2626',
  SAVINGS: '#0EA5E9',
  WARNING: '#F59E0B',
  NEUTRAL: '#6B7280'
};

export const BUDGET_STATUS = {
  UNDER_BUDGET: 'under_budget',
  NEAR_LIMIT: 'near_limit',
  OVER_BUDGET: 'over_budget'
};

export const BUDGET_THRESHOLDS = {
  WARNING: 80, // 80% of budget used
  DANGER: 100  // 100% of budget used
};

export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
  BACKUP: 'backup'
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMMM yyyy',
  SHORT_MONTH: 'MMM yyyy'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50]
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  EXPENSE_CREATED: 'Transaction created successfully!',
  EXPENSE_UPDATED: 'Transaction updated successfully!',
  EXPENSE_DELETED: 'Transaction deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  BUDGET_UPDATED: 'Budget updated successfully!',
  BUDGET_DELETED: 'Budget deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Navigation Items
export const NAVIGATION_ITEMS = [
  { path: '/dashboard', icon: 'FiHome', label: 'Dashboard', exact: true },
  { path: '/expenses', icon: 'FiDollarSign', label: 'Transactions', exact: false },
  { path: '/categories', icon: 'FiTag', label: 'Categories', exact: false },
  { path: '/budgets', icon: 'FiTarget', label: 'Budgets', exact: false },
  { path: '/reports', icon: 'FiBarChart2', label: 'Reports', exact: false },
  { path: '/profile', icon: 'FiUser', label: 'Profile', exact: false }
];

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  TRANSACTION_TYPES,
  MONTHS,
  CATEGORY_COLORS,
  DEFAULT_CATEGORIES,
  VALIDATION_RULES,
  STORAGE_KEYS,
  CHART_COLORS,
  BUDGET_STATUS,
  BUDGET_THRESHOLDS,
  EXPORT_FORMATS,
  DATE_FORMATS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NAVIGATION_ITEMS
};