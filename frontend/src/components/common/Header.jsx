import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiDollarSign } from "react-icons/fi";

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-border focus:outline-none"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-info">
                <div className="flex items-center text-info font-bold text-xl">
                  <FiDollarSign className="mr-2 text-2xl" /> ExpenseTracker
                </div>
                <span className="sm:hidden">ET</span>
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-text-primary">
                {user?.name}
              </p>
              <p className="text-xs text-text-secondary">{user?.email}</p>
            </div>

            <div className="flex items-center space-x-2 bg-border px-2 lg:px-3 py-1 rounded-lg">
              <span className="text-xs lg:text-sm text-text-secondary">
                Currency:
              </span>
              <span className="text-xs lg:text-sm font-semibold text-text-primary">
                {user?.currency}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-text-primary px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden lg:inline ">Logout</span>
            </button>
          </div>

          <div className="md:hidden relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-border"
            >
              <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.name}
                    </p>
                    <p className="text-xs text-text-secondary">{user?.email}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      Currency: {user?.currency}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-expense hover:bg-expense/10 flex items-center space-x-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
