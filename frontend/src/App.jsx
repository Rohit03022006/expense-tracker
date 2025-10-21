import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes';
import MessageToast from './components/common/MessageToast';
import ConnectionStatus from './components/common/ConnectionStatus';
import LoadingSpinner from './components/common/LoadingSpinner';
import { testConnection } from './services/api';
function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const checkConnection = async () => {
      try {
        const result = await testConnection();
        if (!isActive) return;
        
        if (result.connected) {
          setBackendStatus('connected');
          setError(null);
          if (import.meta.env.DEV) {
            console.log('Backend connected:', result.data);
          }
        } else {
          setBackendStatus('disconnected');
          setError(result.error || 'Failed to connect to the server');
          console.error('Backend connection failed:', result.error);
        }
      } catch (error) {
        if (error.code === 'ERR_CANCELED' || error.message?.includes('aborted')) {
          return;
        }
        
        if (!isActive) return;
        
        console.error('Connection check error:', error);
        setBackendStatus('disconnected');
        setError(error.message || 'An error occurred while checking connection');
      }
    };

    checkConnection();

    const intervalId = setInterval(checkConnection, 60000);
  
    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, []);

  const retryConnection = async () => {
    setBackendStatus('checking');
    setError(null);
    try {
      const result = await testConnection();
      if (result.connected) {
        setBackendStatus('connected');
        setError(null);
      } else {
        setBackendStatus('disconnected');
        setError(result.error || 'Connection failed');
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.message?.includes('aborted')) {
        return;
      }
      setBackendStatus('disconnected');
      setError(error.message || 'Connection failed');
    }
  };

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <LoadingSpinner size="large" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Connecting to Server</h1>
          <p className="text-text-secondary mb-6">Please wait while we connect to the backend server...</p>
          
          <div className="bg-info/10 border-l-4 border-info p-4 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-info-dark">
                  Ensure the backend server is running on port 5000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="bg-expense p-4">
              <div className="flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="ml-2 text-xl font-semibold text-white">Connection Error</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-text-primary mb-6">
                We couldn't connect to the server. Please check the following:
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-expense mr-2">•</span>
                  <span>Backend server is running on port 5000</span>
                </li>
                <li className="flex items-start">
                  <span className="text-expense mr-2">•</span>
                  <span>MongoDB is running and accessible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-expense mr-2">•</span>
                  <span>No firewall is blocking the connection</span>
                </li>
              </ul>
              
              {error && (
                <div className="bg-border p-3 rounded-md mb-6 overflow-x-auto">
                  <code className="text-sm text-expense">{error}</code>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.reload();
                  }}
                  className="px-4 py-2 border border-border rounded-md text-text-primary hover:bg-border"
                >
                  Refresh Page
                </a>
                <button
                  onClick={retryConnection}
                  className="px-4 py-2 bg-info text-white rounded-md hover:bg-info-dark focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2 flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Check the browser console (F12) for detailed error information
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App min-h-screen bg-background">
            <AppRoutes />
            <MessageToast />
            <ConnectionStatus />
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;