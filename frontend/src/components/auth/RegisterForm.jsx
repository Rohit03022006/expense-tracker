import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    currency: "INR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-primary-background grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side – Image & Text */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#efecf7] p-12 text-black">
        <img
          src="/register-illustration.png"
          alt="Create Account"
          className="max-w-md w-full mb-8"
        />

        <h1 className="text-4xl font-bold mb-4 text-center">
          Start Managing Your Money
        </h1>

        <p className="text-lg text-white/90 text-center max-w-md">
          Create your free account and take control of your expenses with smart
          insights and analytics.
        </p>
      </div>

      {/* Right Side – Register Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Heading */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-text">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-primary-textSecondary">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-accent-info hover:text-blue-500"
              >
                sign in to existing account
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-primary-border rounded-lg focus:ring-2 focus:ring-accent-info"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-primary-border rounded-lg focus:ring-2 focus:ring-accent-info"
                  placeholder="Enter your email"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">
                  Preferred Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-primary-border rounded-lg focus:ring-2 focus:ring-accent-info"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-primary-text mb-1">
                  Password
                </label>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-primary-border rounded-lg focus:ring-2 focus:ring-accent-info pr-10"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-accent-info"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>

                <p className="text-xs text-primary-textSecondary mt-1">
                  Must be at least 6 characters with letters and numbers
                </p>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-primary-text mb-1">
                  Confirm Password
                </label>

                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-primary-border rounded-lg focus:ring-2 focus:ring-accent-info pr-10"
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-accent-info"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
