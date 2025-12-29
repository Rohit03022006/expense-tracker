import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';
import BudgetProgress from './BudgetProgress';
import Button from '../common/Button';

const BudgetList = ({ 
  budgets, 
  onEdit, 
  onDelete, 
  loading,
  currentPage,
  totalPages,
  onPageChange
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

  if (budgets.length === 0) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6 text-center">
        <p className="text-primary-textSecondary">No budgets found</p>
      </div>
    );
  }

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-primary-card rounded-xl border border-primary-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-border bg-primary-background">
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Budget Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-border">
            {budgets.map((budget) => (
              <tr key={budget._id} className="hover:bg-primary-background transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: budget.category.color }}
                    ></div>
                    <span className="text-sm font-medium text-primary-text">
                      {budget.category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">
                  {getMonthName(budget.month)} {budget.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-text">
                  {formatCurrency(budget.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BudgetProgress 
                    budget={budget.amount}
                    spent={budget.actualSpending || 0}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(budget)}
                      className="text-accent-info hover:text-blue-600 transition-colors duration-200"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(budget._id)}
                      className="text-accent-expense hover:text-red-600 transition-colors duration-200"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {budgets.map((budget) => (
          <div
            key={budget._id}
            className="bg-primary-card border border-primary-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: budget.category.color }}
                ></div>
                <div>
                  <h4 className="font-medium text-primary-text">
                    {budget.category.name}
                  </h4>
                  <p className="text-sm text-primary-textSecondary">
                    {getMonthName(budget.month)} {budget.year}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-text">
                  {formatCurrency(budget.amount)}
                </p>
              </div>
            </div>

            <BudgetProgress 
              budget={budget.amount}
              spent={budget.actualSpending || 0}
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-primary-border">
              <button
                onClick={() => onEdit(budget)}
                className="text-accent-info hover:text-blue-600 transition-colors duration-200 p-1"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(budget._id)}
                className="text-accent-expense hover:text-red-600 transition-colors duration-200 p-1"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-primary-textSecondary">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetList;