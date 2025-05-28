
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      console.log('=== FETCHING TRANSACTIONS FROM DATABASE ===');
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          fiscal_year:fiscal_years(*)
        `)
        .order('ecriture_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      console.log('Raw data from database - total rows:', data?.length || 0);
      
      // Check specifically for transaction 292
      const transaction292 = data?.find(t => t.ecriture_num === 292);
      console.log('Transaction 292 found in database query:', transaction292);
      
      if (transaction292) {
        console.log('Transaction 292 details from database:', {
          id: transaction292.id,
          ecriture_num: transaction292.ecriture_num,
          ecriture_lib: transaction292.ecriture_lib,
          category_id: transaction292.category_id,
          credit: transaction292.credit,
          debit: transaction292.debit,
          ecriture_date: transaction292.ecriture_date
        });
      } else {
        console.log('Transaction 292 NOT FOUND in database query results');
        
        // Check for transactions with similar numbers
        const similarTransactions = data?.filter(t => 
          t.ecriture_num && t.ecriture_num.toString().includes('292')
        );
        console.log('Transactions containing "292":', similarTransactions?.map(t => ({
          ecriture_num: t.ecriture_num,
          ecriture_lib: t.ecriture_lib
        })));
      }
      
      console.log('=== END TRANSACTION FETCH DEBUG ===');
      
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
        .select(`
          *,
          fiscal_year:fiscal_years(*)
        `)
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
        .select(`
          *,
          fiscal_year:fiscal_years(*)
        `)
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
