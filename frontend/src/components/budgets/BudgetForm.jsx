import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../common/Button';

const BudgetForm = ({ budget, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category._id,
        amount: budget.amount.toString(),
        month: budget.month,
        year: budget.year
      });
    }
  }, [budget]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?type=expense');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      month: parseInt(formData.month),
      year: parseInt(formData.year)
    };

    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-primary-text mb-1">
            Budget Amount <span className='text-red-500'>*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-primary-text mb-1">
            Month <span className='text-red-500'>*</span>
          </label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.month ? 'border-red-300' : 'border-primary-border'
            }`}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="mt-1 text-sm text-red-600">{errors.month}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-primary-text mb-1">
            Year <span className='text-red-500'>*</span>
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.year ? 'border-red-300' : 'border-primary-border'
            }`}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
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
          {budget ? 'Update' : 'Create'} Budget
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;