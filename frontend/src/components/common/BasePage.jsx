import React from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiBarChart2, FiCreditCard, FiTarget, FiArrowRight } from 'react-icons/fi';

const BasePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex items-center justify-center">
            <FiDollarSign className="text-5xl text-info mr-3" />
            <div className="text-left">
              <h2 className="text-3xl font-bold text-info">ExpenseTracker</h2>
              <p className="text-sm text-text-secondary">Smart Financial Management</p>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Take Control of Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-income to-info mt-2">
              Finances Easily
            </span>
          </h1>

          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Track your income, monitor expenses, and manage your budget all in one place.
            Get insights, visual reports, and stay on top of your financial goals effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-info rounded-lg shadow-lg hover:bg-info-dark transform hover:scale-105 transition-all duration-200"
            >
              Get Started Free
              <FiArrowRight className="ml-2" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary bg-card border-2 border-border rounded-lg shadow-lg hover:bg-border transform hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-border">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-info/10 rounded-full">
                  <FiBarChart2 className="text-4xl text-info" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Visual Reports</h3>
              <p className="text-text-secondary">Get detailed insights with beautiful charts and graphs</p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-border">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-income/10 rounded-full">
                  <FiCreditCard className="text-4xl text-income" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Budget Tracking</h3>
              <p className="text-text-secondary">Set budgets and monitor your spending in real-time</p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-border">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-warning/10 rounded-full">
                  <FiTarget className="text-4xl text-warning" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Financial Goals</h3>
              <p className="text-text-secondary">Achieve your savings goals with smart planning</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BasePage;
