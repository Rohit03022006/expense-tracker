import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiDollarSign, FiSave } from 'react-icons/fi';
import api from '../services/api';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'INR'
  });
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar (CA$)', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        await checkAuth();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>Full Name</span>
              </div>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center space-x-2">
                <FiDollarSign className="w-4 h-4" />
                <span>Preferred Currency</span>
              </div>
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              This will be used to display all monetary values throughout the application
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Account Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
          <p><strong>User ID:</strong> {user?._id}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
