import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        data: config.data,
        headers: { ...config.headers, Authorization: 'Bearer ***' } // Hide token in logs
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API Response [${response.status}]: ${response.config.url}`, {
      });
    }
    return response;
  },
  (error) => {
    if (error.code === 'ERR_CANCELED' || error.message?.includes('aborted')) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;
    const requestUrl = error.config?.url;
    
    const isAuthCheck = requestUrl?.includes('/auth/me');
    
    if (!isAuthCheck || status !== 401) {
      console.error(`API Error [${status}]:`, errorMessage);
    }
    
    if (status === 401) {
      if (!isAuthCheck) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        toast.error('Your session has expired. Please log in again.');
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection and try again.');
    } else if (!window.navigator.onLine) {
      toast.error('You are offline. Please check your internet connection.');
      console.error('Offline error:', { message: error.message, code: error.code });
    } else {
      const errorDetails = {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method
        },
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : undefined
      };
      
      console.error('API Error Details:', errorDetails);

      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            toast.error(data.message || 'Invalid request. Please check your input.');
            break;
            
          case 401:
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            break;
            
          case 403:
            toast.error('You do not have permission to perform this action.');
            break;
            
          case 404:
            toast.error('The requested resource was not found.');
            break;
            
          case 500:
            toast.error('A server error occurred. Please try again later.');
            break;
            
          default:
            toast.error(data.message || 'An unexpected error occurred.');
        }
      } else if (error.request) {
        if (error.message.includes('Network Error') || error.code === 'NETWORK_ERROR') {
          toast.error('Unable to connect to the server. Please check your internet connection.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. The server is taking too long to respond.');
        } else {
          toast.error('Network error. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('Backend connection test:', response.data);
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    return {
      connected: false,
      error: error.message,
      details: error.response?.data
    };
  }
};

export const testCORS = async () => {
  try {
    const response = await api.get('/test');
    return {
      corsWorking: true,
      data: response.data
    };
  } catch (error) {
    return {
      corsWorking: false,
      error: error.message
    };
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not responding: ' + error.message);
  }
};

export const testLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};
 
export const testRegister = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

export default api;