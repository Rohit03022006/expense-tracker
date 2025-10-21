import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import { VALIDATION_RULES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';

const LoginForm = () => {
  const { login } = useAuth();
  const { setError, setSuccess, clearError, clearSuccess } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    clearError();
    clearSuccess();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!VALIDATION_RULES.EMAIL.REGEX.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('Login failed. Please check your credentials and try again.');
  } finally {
    setLoading(false);
  }
};

 

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-info rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">ET</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-info hover:text-info-dark transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
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
                className={`appearance-none relative block w-full px-3 py-3 border placeholder-text-secondary text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent transition-colors duration-200 ${
                  formErrors.email ? 'border-expense' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-expense">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-3 border placeholder-text-secondary text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent transition-colors duration-200 ${
                  formErrors.password ? 'border-expense' : 'border-border'
                }`}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-expense">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full flex justify-center"
            >
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-info hover:text-info-dark transition-colors duration-200"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;