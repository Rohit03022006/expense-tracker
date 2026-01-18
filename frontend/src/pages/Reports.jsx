import React, { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import api from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      let url, filename;

      switch (format) {
        case 'csv':
          url = '/export/expenses/csv';
          filename = 'expenses.csv';
          break;
        case 'excel':
          url = '/export/expenses/excel';
          filename = 'expenses.xlsx';
          break;
        case 'pdf':
          url = '/export/expenses/pdf';
          filename = 'expenses.pdf';
          break;
        default:
          return;
      }

      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      alert(`${format.toUpperCase()} file downloaded successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export ${format.toUpperCase()} file. The export feature may not be implemented in the backend yet.`);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Reports</h1>
          <p className="text-primary-textSecondary mt-1">
            Analyze your financial data and export reports
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleExport('csv')}
            loading={exportLoading}
            className="flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>CSV</span>
          </Button>
          
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleExport('excel')}
            loading={exportLoading}
            className="flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Excel</span>
          </Button>
          
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleExport('pdf')}
            loading={exportLoading}
            className="flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-card rounded-xl border border-primary-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-textSecondary mb-1">
                Total Income
              </p>
              <p className="text-2xl font-bold text-accent-income">
                {formatCurrency(stats?.currentMonth?.income || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-accent-income" />
            </div>
          </div>
        </div>

        <div className="bg-primary-card rounded-xl border border-primary-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-textSecondary mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-accent-expense">
                {formatCurrency(stats?.currentMonth?.expense || 0)}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-accent-expense" />
            </div>
          </div>
        </div>

        <div className="bg-primary-card rounded-xl border border-primary-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-textSecondary mb-1">
                Net Savings
              </p>
              <p className={`text-2xl font-bold ${
                (stats?.currentMonth?.savings || 0) >= 0 
                  ? 'text-accent-info' 
                  : 'text-accent-warning'
              }`}>
                {formatCurrency(stats?.currentMonth?.savings || 0)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              (stats?.currentMonth?.savings || 0) >= 0 
                ? 'bg-blue-50' 
                : 'bg-orange-50'
            }`}>
              <FiBarChart2 className={`w-6 h-6 ${
                (stats?.currentMonth?.savings || 0) >= 0 
                  ? 'text-accent-info' 
                  : 'text-accent-warning'
              }`} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-card rounded-xl border border-primary-border p-6">
        <h2 className="text-lg font-semibold text-primary-text mb-6 flex items-center">
          <FiPieChart className="w-5 h-5 mr-2 text-accent-info" />
          Category Breakdown
        </h2>
        
        <div className="space-y-4">
          {stats?.categoryStats?.filter(stat => stat.type === 'expense').map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-primary-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stat.color }}
                ></div>
                <span className="font-medium text-primary-text">
                  {stat.category}
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-text">
                  {formatCurrency(stat.total)}
                </p>
                <p className="text-sm text-primary-textSecondary">
                  {stat.count} transactions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary-card rounded-xl border border-primary-border p-6">
        <h2 className="text-lg font-semibold text-primary-text mb-6">
          Monthly Trends
        </h2>
        
        <div className="space-y-3">
          {stats?.monthlyStats?.slice().reverse().map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-primary-border rounded-lg">
              <span className="font-medium text-primary-text">
                {stat._id.month}/{stat._id.year}
              </span>
              <div className="flex space-x-4">
                <span className="text-sm text-accent-income">
                  Income: {formatCurrency(stat.income)}
                </span>
                <span className="text-sm text-accent-expense">
                  Expenses: {formatCurrency(stat.expense)}
                </span>
                <span className={`text-sm font-medium ${
                  (stat.income - stat.expense) >= 0 ? 'text-accent-info' : 'text-accent-warning'
                }`}>
                  Net: {formatCurrency(stat.income - stat.expense)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;