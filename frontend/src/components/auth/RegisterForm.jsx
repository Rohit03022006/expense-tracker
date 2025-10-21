import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';


const RegisterForm = () => {
const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    currency: 'INR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
     navigate('/login');
  };

  return (
    <div className="min-h-screen bg-primary-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-text">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-primary-textSecondary">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-accent-info hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-primary-border placeholder-primary-textSecondary text-primary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info focus:border-transparent transition-colors duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-primary-border placeholder-primary-textSecondary text-primary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-primary-text mb-1">
                Preferred Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-primary-border placeholder-primary-textSecondary text-primary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info focus:border-transparent transition-colors duration-200"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-text mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-primary-border placeholder-primary-textSecondary text-primary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info focus:border-transparent transition-colors duration-200"
                placeholder="Enter your password"
              />
              <p className="text-xs text-primary-textSecondary mt-1">
                Must be at least 6 characters with letters and numbers
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-text mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-primary-border placeholder-primary-textSecondary text-primary-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-info focus:border-transparent transition-colors duration-200"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;