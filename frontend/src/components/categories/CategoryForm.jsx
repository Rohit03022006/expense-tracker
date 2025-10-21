import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const CategoryForm = ({ category, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#6B7280'
  });
  const [errors, setErrors] = useState({});

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#6B7280', '#84CC16', '#06B6D4', '#F97316'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color
      });
    }
  }, [category]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length > 30) {
      newErrors.name = 'Category name cannot exceed 30 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">
            Category Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info transition-colors duration-200 ${
              errors.name ? 'border-red-300' : 'border-primary-border'
            }`}
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

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
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-text mb-3">
          Color <span className='text-red-500'>*</span>
        </label>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange({ target: { name: 'color', value: color } })}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                formData.color === color 
                  ? 'border-primary-text scale-110' 
                  : 'border-primary-border hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center space-x-3 mt-3">
          <div 
            className="w-6 h-6 rounded border border-primary-border"
            style={{ backgroundColor: formData.color }}
          ></div>
          <span className="text-sm text-primary-textSecondary font-mono">
            {formData.color}
          </span>
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
          {category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;