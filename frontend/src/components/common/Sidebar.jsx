import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiDollarSign,
  FiTag,
  FiTarget,
  FiBarChart2,
  FiUser,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/expenses', icon: FiDollarSign, label: 'Transactions' },
    { path: '/categories', icon: FiTag, label: 'Categories' },
    { path: '/budgets', icon: FiTarget, label: 'Budgets' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close sidebar on route change (mobile UX)
  useEffect(() => {
    if (isOpen) {
      onClose?.();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-text-primary">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-border transition"
            aria-label="Close sidebar"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-info text-white shadow-md'
                          : 'text-text-secondary hover:text-text-primary hover:bg-border'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
