export const formatCurrency = (amount, currency = 'INR') => {
  // Use appropriate locale based on currency
  const localeMap = {
    'USD': 'en-US',
    'EUR': 'en-GB',
    'GBP': 'en-GB',
    'INR': 'en-IN',
    'JPY': 'ja-JP',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'CNY': 'zh-CN'
  };
  
  const locale = localeMap[currency] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getColorForType = (type) => {
  return type === 'income' ? 'text-accent-income' : 'text-accent-expense';
};

export const getBgColorForType = (type) => {
  return type === 'income' ? 'bg-green-50' : 'bg-red-50';
};

export const getBorderColorForType = (type) => {
  return type === 'income' ? 'border-green-200' : 'border-red-200';
};