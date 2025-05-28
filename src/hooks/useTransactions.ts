
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      console.log('=== COMPREHENSIVE TRANSACTION DATABASE DEBUG ===');
      
      // First, let's check what types of data we have in ecriture_num
      const { data: ecritureNumSample, error: sampleError } = await supabase
        .from('transactions')
        .select('ecriture_num, ecriture_lib, id')
        .limit(10);
      
      if (sampleError) {
        console.log('Error fetching sample ecriture_num data:', sampleError);
      } else {
        console.log('Sample ecriture_num values and types:', ecritureNumSample?.map(t => ({
          ecriture_num: t.ecriture_num,
          type: typeof t.ecriture_num,
          ecriture_lib: t.ecriture_lib,
          id: t.id
        })));
      }
      
      // Check if transaction with that specific ID exists at all
      const { data: specificTransaction, error: specificError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', '799b508f-4c82-4ad8-88fa-7dc61950d1d1')
        .maybeSingle();
      
      if (specificError) {
        console.log('Error fetching specific transaction by ID:', specificError);
      } else if (specificTransaction) {
        console.log('Transaction found by ID 799b508f-4c82-4ad8-88fa-7dc61950d1d1:', specificTransaction);
      } else {
        console.log('NO TRANSACTION FOUND with ID: 799b508f-4c82-4ad8-88fa-7dc61950d1d1');
      }
      
      // Try different approaches to find ecriture_num 292
      console.log('Trying different ways to find ecriture_num 292...');
      
      // Try as number (this should be the correct approach)
      const { data: byNumeric, error: numericError } = await supabase
        .from('transactions')
        .select('*')
        .eq('ecriture_num', 292);
      
      console.log('Search by numeric 292:', byNumeric?.length || 0, 'results');
      if (numericError) console.log('Numeric search error:', numericError);
      
      // Get total count of transactions
      const { count, error: countError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });
      
      console.log('Total transactions in database:', count);
      if (countError) console.log('Count error:', countError);
      
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
      
      console.log('Raw data from main query - total rows:', data?.length || 0);
      
      // Check for the specific ID in the full result set
      const transaction292ById = data?.find(t => t.id === '799b508f-4c82-4ad8-88fa-7dc61950d1d1');
      console.log('Transaction found by ID in main results:', transaction292ById ? 'YES' : 'NO');
      if (transaction292ById) {
        console.log('Transaction 292 details from main query:', transaction292ById);
      }
      
      // Check for ecriture_num 292 in different ways
      const transaction292ByNum = data?.find(t => t.ecriture_num === 292);
      
      console.log('Transaction found by ecriture_num 292 (numeric):', transaction292ByNum ? 'YES' : 'NO');
      if (transaction292ByNum) {
        console.log('Transaction 292 by ecriture_num:', transaction292ByNum);
      }
      
      // Show some sample ecriture_num values from the main query
      console.log('Sample ecriture_num values from main query:', data?.slice(0, 5).map(t => ({
        id: t.id,
        ecriture_num: t.ecriture_num,
        ecriture_num_type: typeof t.ecriture_num,
        ecriture_lib: t.ecriture_lib
      })));
      
      // Look for any transactions that might be related to 292
      const relatedTransactions = data?.filter(t => 
        t.ecriture_lib?.includes('292') || 
        t.ecriture_num === 292 ||
        t.id === '799b508f-4c82-4ad8-88fa-7dc61950d1d1'
      );
      
      console.log('Transactions related to "292" or with the specific ID:', relatedTransactions?.map(t => ({
        id: t.id,
        ecriture_num: t.ecriture_num,
        ecriture_lib: t.ecriture_lib,
        category_id: t.category_id
      })));
      
      console.log('=== END COMPREHENSIVE DEBUG ===');
      
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
