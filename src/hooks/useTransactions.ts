
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/financial';
import { transactionService } from '@/services/transactionService';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.fetchAll();
      setTransactions(data);
    } catch (error) {
      console.error('Error in useTransactions hook:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionService.create(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error in addTransaction:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionService.update(id, updates);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
    } catch (error) {
      console.error('Error in updateTransaction:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    refetch: fetchTransactions
  };
};
