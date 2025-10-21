import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiEye, FiEyeOff } from 'react-icons/fi';

const ExpenseChart = ({ monthlyStats }) => {
  const { user } = useAuth();
  const [visibleLines, setVisibleLines] = useState({
    Income: true,
    Expenses: true,
    Savings: true
  });

  const formatData = useMemo(() => {
    if (!monthlyStats || !Array.isArray(monthlyStats)) return [];
    
    return monthlyStats.map(stat => ({
      name: `${stat._id.month}/${stat._id.year}`,
      month: stat._id.month,
      year: stat._id.year,
      Income: stat.income || 0,
      Expenses: stat.expense || 0,
      Savings: (stat.income || 0) - (stat.expense || 0)
    })).reverse();
  }, [monthlyStats]);

  const data = formatData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out hidden data series
      const visiblePayload = payload.filter(entry => visibleLines[entry.dataKey]);
      
      const totalIncome = visiblePayload.find(entry => entry.dataKey === 'Income')?.value || 0;
      const totalExpenses = visiblePayload.find(entry => entry.dataKey === 'Expenses')?.value || 0;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl min-w-56 backdrop-blur-sm bg-white/95">
          <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-blue-500" />
            {label}
          </p>
          <div className="space-y-2">
            {visiblePayload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{entry.dataKey}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
          {savingsRate !== 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Savings Rate</span>
                <span className={`text-xs font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {savingsRate >= 0 ? '+' : ''}{savingsRate.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value) => {
    const currency = user?.currency || 'INR';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatXAxis = (tickItem) => {
    return tickItem;
  };

  // Custom legend component with proper toggle functionality
  const renderCustomLegend = () => {
    const legendItems = [
      { key: 'Income', label: 'Income', color: '#16A34A' },
      { key: 'Expenses', label: 'Expenses', color: '#DC2626' },
      { key: 'Savings', label: 'Savings', color: '#0EA5E9' }
    ];

    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 px-4">
        {legendItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setVisibleLines(prev => ({
              ...prev,
              [item.key]: !prev[item.key]
            }))}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
              visibleLines[item.key] 
                ? 'bg-white border-gray-300 shadow-sm' 
                : 'bg-gray-100 border-gray-200 opacity-60'
            } hover:shadow-md`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            {visibleLines[item.key] ? (
              <FiEye className="w-3 h-3 text-gray-500" />
            ) : (
              <FiEyeOff className="w-3 h-3 text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const getChartSummary = () => {
    if (!data || data.length === 0) return null;

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;

    const incomeTrend = previous ? latest.Income - previous.Income : 0;
    const expenseTrend = previous ? latest.Expenses - previous.Expenses : 0;
    const savingsTrend = previous ? latest.Savings - previous.Savings : 0;

    return { incomeTrend, expenseTrend, savingsTrend, latest };
  };

  const chartSummary = getChartSummary();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-blue-500" />
              Monthly Financial Trend
            </h3>
            <p className="text-sm text-gray-600 mt-1">Income vs Expenses over time</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FiDollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No financial data</p>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Start tracking your income and expenses to see financial trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-blue-500" />
            Monthly Financial Trend
          </h3>
          <p className="text-sm text-gray-600 mt-1">Income vs Expenses over time</p>
        </div>
        
        {/* Summary Stats */}
        {chartSummary && (
          <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-xs text-gray-600">Latest Income</p>
              <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                {formatCurrency(chartSummary.latest.Income)}
                {chartSummary.incomeTrend > 0 ? (
                  <FiTrendingUp className="w-3 h-3" />
                ) : chartSummary.incomeTrend < 0 ? (
                  <FiTrendingDown className="w-3 h-3 text-red-500" />
                ) : null}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Latest Expenses</p>
              <p className="text-sm font-bold text-red-600 flex items-center gap-1">
                {formatCurrency(chartSummary.latest.Expenses)}
                {chartSummary.expenseTrend > 0 ? (
                  <FiTrendingUp className="w-3 h-3 text-red-500" />
                ) : chartSummary.expenseTrend < 0 ? (
                  <FiTrendingDown className="w-3 h-3 text-green-500" />
                ) : null}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E2E8F0" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#0c0e10"
              fontSize={11}
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#0c0e10"
              fontSize={11}
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Income Area */}
            {visibleLines.Income && (
              <Area 
                type="monotone" 
                dataKey="Income" 
                stroke="#16A34A" 
                fill="url(#colorIncome)"
                strokeWidth={2}
                fillOpacity={0.8}
                name="Income"
                connectNulls
              />
            )}
            
            {/* Expenses Area */}
            {visibleLines.Expenses && (
              <Area 
                type="monotone" 
                dataKey="Expenses" 
                stroke="#DC2626" 
                fill="url(#colorExpenses)"
                strokeWidth={2}
                fillOpacity={0.8}
                name="Expenses"
                connectNulls
              />
            )}
            
            {/* Savings Area */}
            {visibleLines.Savings && (
              <Area 
                type="monotone" 
                dataKey="Savings" 
                stroke="#0EA5E9" 
                fill="url(#colorSavings)"
                strokeWidth={2}
                fillOpacity={0.8}
                name="Savings"
                connectNulls
                strokeDasharray="4 2"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      {renderCustomLegend()}

      {/* Additional Insights */}
      {data.length > 1 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-gray-600 flex items-center justify-center gap-1">
              <FiTrendingUp className="w-3 h-3" />
              Avg. Income
            </p>
            <p className="font-bold text-green-700 text-lg">
              {formatCurrency(data.reduce((sum, item) => sum + item.Income, 0) / data.length)}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-gray-600 flex items-center justify-center gap-1">
              <FiTrendingDown className="w-3 h-3" />
              Avg. Expenses
            </p>
            <p className="font-bold text-red-700 text-lg">
              {formatCurrency(data.reduce((sum, item) => sum + item.Expenses, 0) / data.length)}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-600">Total Savings</p>
            <p className="font-bold text-blue-700 text-lg">
              {formatCurrency(data.reduce((sum, item) => sum + item.Savings, 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;