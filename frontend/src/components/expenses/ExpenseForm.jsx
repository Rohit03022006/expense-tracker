import React, { useState, useEffect } from 'react';
import { formatDateForInput } from '../../utils/formatters';
import api from '../../services/api';
import Button from '../common/Button';
import { 
  API_ENDPOINTS, 
  TRANSACTION_TYPES, 
  VALIDATION_RULES
} from '../../utils/constants';

const ExpenseForm = ({ expense, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: TRANSACTION_TYPES.EXPENSE
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        category: expense.category._id,
        date: formatDateForInput(expense.date),
        type: expense.type
      });
    }
  }, [expense]);

  const fetchCategories = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount || amount < VALIDATION_RULES.AMOUNT.MIN || amount > VALIDATION_RULES.AMOUNT.MAX) {
      newErrors.amount = `Amount must be between ${VALIDATION_RULES.AMOUNT.MIN} and ${VALIDATION_RULES.AMOUNT.MAX.toLocaleString()}`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      newErrors.description = `Description must be less than ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    onSave(submitData);
  };

  const expenseCategories = categories.filter(cat => cat.type === TRANSACTION_TYPES.EXPENSE);
  const incomeCategories = categories.filter(cat => cat.type === TRANSACTION_TYPES.INCOME);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-primary-text mb-1">
            Amount <span className='text-red-500'>*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min={VALIDATION_RULES.AMOUNT.MIN}
            max={VALIDATION_RULES.AMOUNT.MAX}
            value={formData.amount}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.amount ? 'border-red-300' : 'border-primary-border'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-primary-text mb-1">
            Date <span className='text-red-500'>*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.date ? 'border-red-300' : 'border-primary-border'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-primary-text mb-1">
          Description <span className='text-red-500'>*</span>
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
            errors.description ? 'border-red-300' : 'border-primary-border'
          }`}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-primary-text mb-1">
            Type <span className='text-red-500'>*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-primary-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200"
          >
            <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
            <option value={TRANSACTION_TYPES.INCOME}>Income</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-primary-text mb-1">
            Category <span className='text-red-500'>*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.category ? 'border-red-300' : 'border-primary-border'
            }`}
          >
            <option value="">Select a category</option>
            {formData.type === TRANSACTION_TYPES.EXPENSE
              ? expenseCategories.length > 0 
                ? expenseCategories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                : <option disabled>No expense categories available</option>
              : incomeCategories.length > 0
                ? incomeCategories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                : <option disabled>No income categories available</option>
            }
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
          {((formData.type === TRANSACTION_TYPES.EXPENSE && expenseCategories.length === 0) ||
            (formData.type === TRANSACTION_TYPES.INCOME && incomeCategories.length === 0)) && (
            <p className="mt-1 text-sm text-yellow-600">
              No categories available. Please create a category first in the Categories section.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {expense ? 'Update' : 'Create'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;