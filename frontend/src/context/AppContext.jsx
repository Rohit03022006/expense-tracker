import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  SET_STATS: 'SET_STATS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_BUDGETS: 'SET_BUDGETS',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS'
};

const initialState = {
  loading: false,
  error: null,
  success: null,
  stats: null,
  categories: [],
  budgets: [],
  expenses: [],
  recentTransactions: []
};

const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case APP_ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
        loading: false
      };

    case APP_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
        loading: false
      };

    case APP_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false
      };

    case APP_ACTIONS.SET_BUDGETS:
      return {
        ...state,
        budgets: action.payload,
        loading: false
      };

    case APP_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        recentTransactions: [action.payload, ...state.recentTransactions.slice(0, 4)]
      };

    case APP_ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        recentTransactions: state.recentTransactions.map(transaction =>
          transaction._id === action.payload._id ? action.payload : transaction
        )
      };

    case APP_ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        recentTransactions: state.recentTransactions.filter(transaction => transaction._id !== action.payload)
      };

    case APP_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };

    case APP_ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        )
      };

    case APP_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload)
      };

    case APP_ACTIONS.ADD_BUDGET:
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };

    case APP_ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget._id === action.payload._id ? action.payload : budget
        )
      };

    case APP_ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload)
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case APP_ACTIONS.CLEAR_SUCCESS:
      return {
        ...state,
        success: null
      };

    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        if (state.error) {
          dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
        }
        if (state.success) {
          dispatch({ type: APP_ACTIONS.CLEAR_SUCCESS });
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.error, state.success]);

  useEffect(() => {
    if (user) {
      fetchInitialData();
    } else {
      dispatch({ type: APP_ACTIONS.SET_STATS, payload: null });
      dispatch({ type: APP_ACTIONS.SET_CATEGORIES, payload: [] });
      dispatch({ type: APP_ACTIONS.SET_BUDGETS, payload: [] });
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: true });

      const [statsResponse, categoriesResponse, budgetsResponse, expensesResponse] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/categories'),
        api.get('/budgets/current'),
        api.get('/expenses?limit=5')
      ]);

      dispatch({ type: APP_ACTIONS.SET_STATS, payload: statsResponse.data.data });
      dispatch({ type: APP_ACTIONS.SET_CATEGORIES, payload: categoriesResponse.data.data });
      dispatch({ type: APP_ACTIONS.SET_BUDGETS, payload: budgetsResponse.data.data });
      dispatch({ type: APP_ACTIONS.SET_EXPENSES, payload: expensesResponse.data.data });
    } catch (error) {
      dispatch({ 
        type: APP_ACTIONS.SET_ERROR, 
        payload: 'Failed to load initial data' 
      });
    }
  };

  const actions = {
    setLoading: (loading) => 
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading }),

    setError: (error) => 
      dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error }),

    setSuccess: (success) => 
      dispatch({ type: APP_ACTIONS.SET_SUCCESS, payload: success }),

    clearError: () => 
      dispatch({ type: APP_ACTIONS.CLEAR_ERROR }),

    clearSuccess: () => 
      dispatch({ type: APP_ACTIONS.CLEAR_SUCCESS }),

    addExpense: (expense) => 
      dispatch({ type: APP_ACTIONS.ADD_EXPENSE, payload: expense }),

    updateExpense: (expense) => 
      dispatch({ type: APP_ACTIONS.UPDATE_EXPENSE, payload: expense }),

    deleteExpense: (expenseId) => 
      dispatch({ type: APP_ACTIONS.DELETE_EXPENSE, payload: expenseId }),

    addCategory: (category) => 
      dispatch({ type: APP_ACTIONS.ADD_CATEGORY, payload: category }),

    updateCategory: (category) => 
      dispatch({ type: APP_ACTIONS.UPDATE_CATEGORY, payload: category }),

    deleteCategory: (categoryId) => 
      dispatch({ type: APP_ACTIONS.DELETE_CATEGORY, payload: categoryId }),

    addBudget: (budget) => 
      dispatch({ type: APP_ACTIONS.ADD_BUDGET, payload: budget }),

    updateBudget: (budget) => 
      dispatch({ type: APP_ACTIONS.UPDATE_BUDGET, payload: budget }),

    deleteBudget: (budgetId) => 
      dispatch({ type: APP_ACTIONS.DELETE_BUDGET, payload: budgetId }),

    refreshStats: async () => {
      try {
        const response = await api.get('/expenses/stats');
        dispatch({ type: APP_ACTIONS.SET_STATS, payload: response.data.data });
        return response.data.data;
      } catch (error) {
        dispatch({ 
          type: APP_ACTIONS.SET_ERROR, 
          payload: 'Failed to refresh statistics' 
        });
        throw error;
      }
    },

    refreshCategories: async () => {
      try {
        const response = await api.get('/categories');
        dispatch({ type: APP_ACTIONS.SET_CATEGORIES, payload: response.data.data });
        return response.data.data;
      } catch (error) {
        dispatch({ 
          type: APP_ACTIONS.SET_ERROR, 
          payload: 'Failed to refresh categories' 
        });
        throw error;
      }
    },

    refreshBudgets: async () => {
      try {
        const response = await api.get('/budgets/current');
        dispatch({ type: APP_ACTIONS.SET_BUDGETS, payload: response.data.data });
        return response.data.data;
      } catch (error) {
        dispatch({ 
          type: APP_ACTIONS.SET_ERROR, 
          payload: 'Failed to refresh budgets' 
        });
        throw error;
      }
    },

    refreshRecentTransactions: async () => {
      try {
        const response = await api.get('/expenses?limit=5');
        return response.data.data;
      } catch (error) {
        dispatch({ 
          type: APP_ACTIONS.SET_ERROR, 
          payload: 'Failed to refresh transactions' 
        });
        throw error;
      }
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;