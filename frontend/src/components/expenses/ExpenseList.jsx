import React from 'react';
import { FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatDate, getColorForType, getBgColorForType } from '../../utils/formatters';
import Button from '../common/Button';

const ExpenseList = ({ 
  expenses, 
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

  if (expenses.length === 0) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6 text-center">
        <p className="text-primary-textSecondary">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-card rounded-xl border border-primary-border overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-border bg-primary-background">
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-border">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-primary-background transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${getBgColorForType(expense.type)}`}>
                      {expense.type === 'income' ? (
                        <FiTrendingUp className={`w-4 h-4 ${getColorForType(expense.type)}`} />
                      ) : (
                        <FiTrendingDown className={`w-4 h-4 ${getColorForType(expense.type)}`} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary-text">
                        {expense.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: expense.category.color }}
                    ></div>
                    <span className="text-sm text-primary-text">
                      {expense.category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    expense.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {expense.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getColorForType(expense.type)}`}>
                    {expense.type === 'income' ? '+' : '-'}
                    {formatCurrency(expense.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-accent-info hover:text-blue-600 transition-colors duration-200"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
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

      <div className="md:hidden space-y-4 p-4">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white border border-primary-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getBgColorForType(expense.type)}`}>
                  {expense.type === 'income' ? (
                    <FiTrendingUp className={`w-4 h-4 ${getColorForType(expense.type)}`} />
                  ) : (
                    <FiTrendingDown className={`w-4 h-4 ${getColorForType(expense.type)}`} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-primary-text">
                    {expense.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-primary-textSecondary">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    ></div>
                    <span>{expense.category.name}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getColorForType(expense.type)}`}>
                  {expense.type === 'income' ? '+' : '-'}
                  {formatCurrency(expense.amount)}
                </p>
                <p className="text-xs text-primary-textSecondary">
                  {formatDate(expense.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-primary-border">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                expense.type === 'income' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {expense.type}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-accent-info hover:text-blue-600 transition-colors duration-200"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(expense._id)}
                  className="text-accent-expense hover:text-red-600 transition-colors duration-200"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-primary-border bg-primary-background">
          <div className="flex items-center justify-between">
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
        </div>
      )}
    </div>
  );
};

export default ExpenseList;