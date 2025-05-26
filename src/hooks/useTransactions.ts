
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('ecriture_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding transaction:', error);
        return;
      }
      
      setTransactions(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating transaction:', error);
        return;
      }
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? data : t)
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
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
