import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw } from 'react-icons/fi';
import { healthCheck } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [checking, setChecking] = useState(false);

  const checkBackendStatus = async () => {
    setChecking(true);
    try {
      await healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();

    const handleOnline = () => {
      setIsOnline(true);
      checkBackendStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setBackendStatus('disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkBackendStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-600';
    if (backendStatus === 'connected') return 'text-green-600';
    if (backendStatus === 'disconnected') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (backendStatus === 'connected') return 'Connected';
    if (backendStatus === 'disconnected') return 'Backend Offline';
    return 'Checking...';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <FiWifiOff className="w-4 h-4" />;
    if (backendStatus === 'connected') return <FiWifi className="w-4 h-4" />;
    return <FiWifiOff className="w-4 h-4" />;
  };

  if (backendStatus === 'connected' && isOnline) {
    return null; 
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-48">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`${getStatusColor()}`}>
              {checking ? <LoadingSpinner size="small" /> : getStatusIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {getStatusText()}
              </p>
              <p className="text-xs text-gray-500">
                {!isOnline ? 'Check your internet connection' : 'Backend server issue'}
              </p>
            </div>
          </div>
          <button
            onClick={checkBackendStatus}
            disabled={checking}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;