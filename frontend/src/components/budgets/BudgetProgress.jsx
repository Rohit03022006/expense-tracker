import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const BudgetProgress = ({ budget, spent }) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (isOverBudget) {
      return `Overspent by ${formatCurrency(Math.abs(remaining))}`;
    }
    return `${formatCurrency(remaining)} remaining`;
  };

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-primary-textSecondary">
          Spent: {formatCurrency(spent)}
        </span>
        <span className="text-primary-textSecondary">
          Budget: {formatCurrency(budget)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs">
        <span className={getStatusColor()}>
          {getStatusText()}
        </span>
        <span className="text-primary-textSecondary">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetProgress;