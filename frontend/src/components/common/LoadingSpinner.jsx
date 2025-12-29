import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`loading-spinner ${sizes[size]} border-2`}
        style={{
          border: '4px solid #E2E8F0',
          borderTop: '3px solid #0EA5E9',
          borderRadius: '50%',
          animation: 'spin 3s linear infinite'
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;