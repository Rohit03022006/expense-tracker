import React from 'react';
import { FiEdit2, FiTrash2, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import Button from '../common/Button';

const CategoryList = ({ 
  categories, 
  onEdit, 
  onDelete, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6">
        <div className="flex justify-center py-8">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6 text-center">
        <p className="text-primary-textSecondary">No categories found</p>
      </div>
    );
  }

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const CategorySection = ({ title, categories, type }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center">
        {type === 'expense' ? (
          <FiCreditCard className="w-5 h-5 mr-2 text-accent-expense" />
        ) : (
          <FiDollarSign className="w-5 h-5 mr-2 text-accent-income" />
        )}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white border border-primary-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full border border-primary-border"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div>
                  <h4 className="font-medium text-primary-text">
                    {category.name}
                  </h4>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="text-accent-info hover:text-blue-600 transition-colors duration-200 p-1"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category._id)}
                  className="text-accent-expense hover:text-red-600 transition-colors duration-200 p-1"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {expenseCategories.length > 0 && (
        <CategorySection 
          title="Expense Categories" 
          categories={expenseCategories}
          type="expense"
        />
      )}
      
      {incomeCategories.length > 0 && (
        <CategorySection 
          title="Income Categories" 
          categories={incomeCategories}
          type="income"
        />
      )}
    </div>
  );
};

export default CategoryList;