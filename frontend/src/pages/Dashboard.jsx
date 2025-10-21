import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCards from '../components/dashboard/StatsCards';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsResponse, expensesResponse] = await Promise.all([
        api.get('/expenses/stats'),
        api.get('/expenses?limit=5')
      ]);

      console.log('Stats Response:', statsResponse.data);
      console.log('Expenses Response:', expensesResponse.data);

      setStats({
        ...statsResponse.data.data,
        totalTransactions: expensesResponse.data.total || 0
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 bg-accent-expense text-white px-4 py-2 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Here's your financial overview for this month.
        </p>
      </div>

     
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      
        <ExpenseChart monthlyStats={stats?.monthlyStats} />
        
     
        <CategoryChart categoryStats={stats?.categoryStats} />
      </div>

      <RecentTransactions />
    </div>
  );
};

export default Dashboard;