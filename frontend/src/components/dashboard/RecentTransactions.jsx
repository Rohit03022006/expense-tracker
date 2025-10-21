import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatDate, getColorForType, getBgColorForType } from '../../utils/formatters';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get('/expenses?limit=5');
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-primary-text mb-6">
          Recent Transactions
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-primary-card rounded-xl border border-primary-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-primary-text mb-6">
          Recent Transactions
        </h3>
        <div className="text-center py-8">
          <p className="text-primary-textSecondary">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-card rounded-xl border border-primary-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary-text">
          Recent Transactions
        </h3>
        <button 
          onClick={fetchRecentTransactions}
          className="text-sm text-accent-info hover:text-blue-600 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-4 border border-primary-border rounded-lg hover:bg-primary-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${getBgColorForType(transaction.type)}`}>
                {transaction.type === 'income' ? (
                  <FiTrendingUp className={`w-4 h-4 ${getColorForType(transaction.type)}`} />
                ) : (
                  <FiTrendingDown className={`w-4 h-4 ${getColorForType(transaction.type)}`} />
                )}
              </div>
              
              <div>
                <p className="font-medium text-primary-text">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-sm text-primary-textSecondary">
                  <span>{transaction.category.name}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-semibold ${getColorForType(transaction.type)}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-primary-textSecondary capitalize">
                {transaction.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;