import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { 
  FiPieChart, 
  FiDollarSign, 
  FiList, 
  FiBarChart2,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';

const CategoryChart = ({ categoryStats, period = 'monthly' }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Process and sort data
  const { data, totalExpenses } = useMemo(() => {
    if (!categoryStats || categoryStats.length === 0) {
      return { data: [], totalExpenses: 0 };
    }

    const expenseData = categoryStats
      .filter(stat => stat.type === 'expense' && stat.total > 0)
      .map(stat => ({
        name: stat.category,
        value: stat.total,
        color: stat.color || getDefaultColor(stat.category),
        count: stat.count || 0
      }));

    const total = expenseData.reduce((sum, item) => sum + item.value, 0);
    
    // Calculate percentages and sort by value (descending)
    const processedData = expenseData
      .map(item => ({
        ...item,
        percentage: (item.value / total) * 100
      }))
      .sort((a, b) => b.value - a.value);

    return { data: processedData, totalExpenses: total };
  }, [categoryStats]);

  // Default color generator
  function getDefaultColor(category) {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    const index = category.charCodeAt(0) % colors.length;
    return colors[index];
  }

  // Active shape for hover effects
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ 
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
            transition: 'all 0.3s ease'
          }}
        />
        <text 
          x={cx} 
          y={cy} 
          dy={-10} 
          textAnchor="middle" 
          fill={fill}
          className="font-bold text-sm"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        >
          {payload.name}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={10} 
          textAnchor="middle" 
          fill="#6B7280"
          className="font-semibold text-xs"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl min-w-48 backdrop-blur-sm bg-white/95">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-4 h-4 rounded-full shadow-sm" 
              style={{ backgroundColor: dataItem.color }}
            />
            <p className="font-bold text-gray-900">{dataItem.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(dataItem.value)}
            </p>
            <p className="text-sm text-gray-600">
              {dataItem.percentage.toFixed(1)}% of total
            </p>
            {dataItem.count && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FiList className="w-3 h-3" />
                {dataItem.count} transaction{dataItem.count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Fixed Custom Legend Component
  const CustomLegend = ({ payload }) => {
    if (!payload || !payload.length) return null;

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-6 px-2">
        {payload.map((entry, index) => {
          // Get the corresponding data item for this legend entry
          const dataItem = data.find(item => item.name === entry.value) || {};
          
          return (
            <button
              key={`legend-${index}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                activeIndex === index
                  ? 'border-gray-300 bg-gray-50 scale-105 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ 
                opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
            >
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">{entry.value}</span>
              <span className="text-xs text-gray-500 font-medium">
                ({dataItem.percentage ? dataItem.percentage.toFixed(1) : '0.0'}%)
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom render legend to ensure proper data mapping
  const renderCustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-2 mt-6 px-2">
      {data.map((item, index) => (
        <button
          key={`legend-${index}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
            activeIndex === index
              ? 'border-gray-300 bg-gray-50 scale-105 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          style={{ 
            opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 
          }}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
        >
          <div 
            className="w-3 h-3 rounded-full shadow-sm" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
          <span className="text-xs text-gray-500 font-medium">
            ({item.percentage.toFixed(1)}%)
          </span>
        </button>
      ))}
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiPieChart className="w-5 h-5 text-blue-500" />
              Expense Categories
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <FiBarChart2 className="w-3 h-3" />
              {period === 'daily' ? 'Today' : 'This month'} • No expenses recorded
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <FiPieChart className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FiDollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No expense data</p>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Start adding expenses to see your spending breakdown by category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiPieChart className="w-5 h-5 text-blue-500" />
            Expense Categories
          </h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <FiBarChart2 className="w-3 h-3" />
            {period === 'daily' ? 'Today' : 'This month'} • {formatCurrency(totalExpenses)} total
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showDetails ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
            <span className="text-gray-600 font-medium">Top Categories</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={1}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={3}
                  style={{
                    filter: activeIndex === index ? 'drop-shadow(0px 6px 16px rgba(0,0,0,0.2))' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {/* Remove the default Legend component and use our custom one */}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend - Use this instead of the built-in Legend */}
      {renderCustomLegend()}

      {/* Top Categories Summary */}
      {showDetails && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiList className="w-4 h-4 text-gray-600" />
            Top Spending Categories
          </h4>
          <div className="space-y-3">
            {data.slice(0, 3).map((category, index) => (
              <div 
                key={category.name} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.color }}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiList className="w-3 h-3" />
                      {category.count || 0} transaction{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatCurrency(category.value)}
                  </p>
                  <p className="text-xs font-medium text-gray-600">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
            
            {/* Show remaining categories count */}
            {data.length > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  + {data.length - 3} more categor{data.length - 3 !== 1 ? 'ies' : 'y'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;