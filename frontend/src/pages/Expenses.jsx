import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../services/api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchExpenses();
  }, [filters, currentPage]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: '10',
        ...filters
      }).toString();

      const response = await api.get(`/expenses?${queryParams}`);
      setExpenses(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData) => {
    try {
      setActionLoading(true);
      await api.post('/expenses', expenseData);
      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
      alert(error.response?.data?.message || 'Failed to create expense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      setActionLoading(true);
      await api.put(`/expenses/${editingExpense._id}`, expenseData);
      setShowModal(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
      alert(error.response?.data?.message || 'Failed to update expense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${expenseId}`);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Transactions</h1>
          <p className="text-primary-textSecondary mt-1">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <ExpenseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDeleteExpense}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Transaction' : 'Add New Transaction'}
        size="medium"
      >
        <ExpenseForm
          expense={editingExpense}
          onSave={editingExpense ? handleUpdateExpense : handleCreateExpense}
          onCancel={handleCloseModal}
          loading={actionLoading}
        />
      </Modal>
    </div>
  );
};

export default Expenses;