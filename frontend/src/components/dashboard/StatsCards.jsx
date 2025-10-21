import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiSave } from 'react-icons/fi';
import { useCurrency } from '../../hooks/useCurrency';

const StatsCards = ({ stats }) => {
  const { formatCurrency } = useCurrency();
  
  const cards = [
    {
      title: 'Total Income',
      value: stats?.currentMonth?.income || 0,
      icon: FiTrendingUp,
      color: 'text-income',
      bgColor: 'bg-income/10',
      borderColor: 'border-income/20'
    },
    {
      title: 'Total Expenses',
      value: stats?.currentMonth?.expense || 0,
      icon: FiTrendingDown,
      color: 'text-expense',
      bgColor: 'bg-expense/10',
      borderColor: 'border-expense/20'
    },
    {
      title: 'Monthly Savings',
      value: stats?.currentMonth?.savings || 0,
      icon: FiSave,
      color: stats?.currentMonth?.savings >= 0 ? 'text-info' : 'text-warning',
      bgColor: stats?.currentMonth?.savings >= 0 ? 'bg-info/10' : 'bg-warning/10',
      borderColor: stats?.currentMonth?.savings >= 0 ? 'border-info/20' : 'border-warning/20'
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: FiDollarSign,
      color: 'text-text-secondary',
      bgColor: 'bg-border',
      borderColor: 'border-border'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isCurrency = card.title !== 'Transactions';
        
        return (
          <div
            key={index}
            className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {isCurrency 
                    ? formatCurrency(card.value) 
                    : card.value.toLocaleString()
                  }
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;