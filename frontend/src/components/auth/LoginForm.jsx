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
   <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
  
  {/* Left Side – Image & Text */}
  <div className="hidden lg:flex flex-col items-center justify-center bg-[#f4e9f4] relative p-12 text-black">
    <img
      src="./auth-illustration.png" // put image in public folder
      alt="Expense Tracker"
      className="max-w-md w-full mb-8"
    />

    <h1 className="text-4xl font-bold mb-4">
      Track Your Expenses Smartly
    </h1>

    <p className="text-lg text-gray-900 text-center max-w-md">
      Manage your daily expenses, visualize spending, and stay in control of your finances — all in one place.
    </p>
  </div>

  {/* Right Side – Login Form */}
  <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">

      {/* Logo & Heading */}
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

      {/* Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-info ${
                formErrors.email ? 'border-expense' : 'border-border'
              }`}
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-expense">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-info ${
                formErrors.password ? 'border-expense' : 'border-border'
              }`}
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-expense">{formErrors.password}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full flex justify-center"
        >
          Sign in
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-secondary">
        Don’t have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-info hover:text-info-dark"
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