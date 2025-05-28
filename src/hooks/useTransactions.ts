
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      console.log('=== FETCHING TRANSACTIONS FROM DATABASE ===');
      console.log('Looking specifically for transaction with ID: 799b508f-4c82-4ad8-88fa-7dc61950d1d1');
      
      // First, let's try to fetch transaction 292 specifically by ID
      const { data: specificTransaction, error: specificError } = await supabase
        .from('transactions')
        .select(`
          *,
          fiscal_year:fiscal_years(*)
        `)
        .eq('id', '799b508f-4c82-4ad8-88fa-7dc61950d1d1')
        .single();
      
      if (specificError) {
        console.log('Error fetching specific transaction 292:', specificError);
      } else {
        console.log('Transaction 292 found by ID:', specificTransaction);
      }
      
      // Now let's try to fetch transaction 292 by ecriture_num
      const { data: byEcritureNum, error: ecritureError } = await supabase
        .from('transactions')
        .select(`
          *,
          fiscal_year:fiscal_years(*)
        `)
        .eq('ecriture_num', 292);
      
      if (ecritureError) {
        console.log('Error fetching transaction by ecriture_num 292:', ecritureError);
      } else {
        console.log('Transactions with ecriture_num 292:', byEcritureNum);
      }
      
      // Now fetch all transactions as before
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
      
      // Check specifically for transaction 292 by ID in the full result set
      const transaction292ById = data?.find(t => t.id === '799b508f-4c82-4ad8-88fa-7dc61950d1d1');
      console.log('Transaction 292 found by ID in full results:', transaction292ById);
      
      // Check specifically for transaction 292 by ecriture_num in the full result set
      const transaction292ByNum = data?.find(t => t.ecriture_num === 292);
      console.log('Transaction 292 found by ecriture_num in full results:', transaction292ByNum);
      
      if (transaction292ByNum) {
        console.log('Transaction 292 details from database:', {
          id: transaction292ByNum.id,
          ecriture_num: transaction292ByNum.ecriture_num,
          ecriture_lib: transaction292ByNum.ecriture_lib,
          category_id: transaction292ByNum.category_id,
          credit: transaction292ByNum.credit,
          debit: transaction292ByNum.debit,
          ecriture_date: transaction292ByNum.ecriture_date,
          fiscal_year_id: transaction292ByNum.fiscal_year_id
        });
      } else {
        console.log('Transaction 292 NOT FOUND in database query results');
        
        // Check for transactions with similar numbers
        const similarTransactions = data?.filter(t => 
          t.ecriture_num && t.ecriture_num.toString().includes('292')
        );
        console.log('Transactions containing "292":', similarTransactions?.map(t => ({
          ecriture_num: t.ecriture_num,
          ecriture_lib: t.ecriture_lib,
          id: t.id
        })));
        
        // Check first 10 transactions for debugging
        console.log('First 10 transactions in results:', data?.slice(0, 10).map(t => ({
          id: t.id,
          ecriture_num: t.ecriture_num,
          ecriture_lib: t.ecriture_lib,
          ecriture_date: t.ecriture_date
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
