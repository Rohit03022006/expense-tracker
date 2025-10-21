import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../services/api';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetList from '../components/budgets/BudgetList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [currentBudgets, setCurrentBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBudgets();
    fetchCurrentBudgets();
  }, [currentPage]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      const response = await api.get(`/budgets?page=${currentPage}&limit=10&year=${currentYear}&month=${currentMonth}`);
      
      // Fetch spending data for current month budgets
      let budgetsWithSpending = response.data.data || [];
      
      // If budgets are for current month, fetch spending data
      const currentBudgetsResponse = await api.get('/budgets/current');
      const currentBudgetsData = currentBudgetsResponse.data.data || [];
      
      // Merge spending data into budgets
      budgetsWithSpending = budgetsWithSpending.map(budget => {
        const budgetWithSpending = currentBudgetsData.find(
          cb => cb._id === budget._id || 
          (cb.category._id === budget.category._id && cb.month === budget.month && cb.year === budget.year)
        );
        
        if (budgetWithSpending) {
          return {
            ...budget,
            actualSpending: budgetWithSpending.actualSpending || 0,
            remaining: budgetWithSpending.remaining || budget.amount,
            overspent: budgetWithSpending.overspent || false
          };
        }
        
        return budget;
      });
      
      setBudgets(budgetsWithSpending);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentBudgets = async () => {
    try {
      const response = await api.get('/budgets/current');
      setCurrentBudgets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching currentbudgets:', error);
      setCurrentBudgets([]);
    }
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      setActionLoading(true);
      await api.post('/budgets', budgetData);
      setShowModal(false);
      fetchBudgets();
      fetchCurrentBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      alert(error.response?.data?.message || 'Failed to create budget');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    try {
      setActionLoading(true);
      await api.put(`/budgets/${editingBudget._id}`, budgetData);
      setShowModal(false);
      setEditingBudget(null);
      fetchBudgets();
      fetchCurrentBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      alert(error.response?.data?.message || 'Failed to update budget');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await api.delete(`/budgets/${budgetId}`);
      fetchBudgets();
      fetchCurrentBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert(error.response?.data?.message || 'Failed to delete budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Budgets</h1>
          <p className="text-primary-textSecondary mt-1">
            Manage your monthly spending limits
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Budget</span>
        </Button>
      </div>
      <div className="bg-primary-card rounded-xl border border-primary-border p-6">
        <h2 className="text-lg font-semibold text-primary-text mb-4">
          Current Month Budgets
        </h2>
        <BudgetList
          budgets={currentBudgets}
          onEdit={handleEdit}
          onDelete={handleDeleteBudget}
          loading={loading}
        />
      </div>
      <div className="bg-primary-card rounded-xl border border-primary-border p-6">
        <h2 className="text-lg font-semibold text-primary-text mb-4">
          All Budgets
        </h2>
        <BudgetList
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDeleteBudget}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
        size="medium"
      >
        <BudgetForm
          budget={editingBudget}
          onSave={editingBudget ? handleUpdateBudget : handleCreateBudget}
          onCancel={handleCloseModal}
          loading={actionLoading}
        />
      </Modal>
    </div>
  );
};

export default Budgets;