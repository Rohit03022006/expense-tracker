import React from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const MessageToast = () => {
  const { error, success, clearError, clearSuccess } = useApp();

  if (!error && !success) return null;

  const message = error || success;
  const type = error ? 'error' : 'success';

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-expense/10 border-expense/20';
      case 'success':
        return 'bg-income/10 border-income/20';
      default:
        return 'bg-info/10 border-info/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-expense-dark';
      case 'success':
        return 'text-income-dark';
      default:
        return 'text-info-dark';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-expense';
      case 'success':
        return 'text-income';
      default:
        return 'text-info';
    }
  };

  const handleClose = () => {
    if (error) clearError();
    if (success) clearSuccess();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 animate-slide-up`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColor()}`}>
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`${getTextColor()} hover:opacity-70 transition-opacity duration-200`}
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageToast;