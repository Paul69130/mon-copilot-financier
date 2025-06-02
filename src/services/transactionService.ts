
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export const transactionService = {
  async fetchAll(): Promise<Transaction[]> {
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
      
      // SPECIFIC CHECK FOR TRANSACTION 10260
      console.log('=== ANALYZING TRANSACTION 10260 ===');
      const { data: transaction10260, error: transaction10260Error } = await supabase
        .from('transactions')
        .select('*')
        .eq('ecriture_num', '10260');
      
      if (transaction10260Error) {
        console.log('Error fetching transaction 10260:', transaction10260Error);
      } else {
        console.log('Transaction(s) with ecriture_num 10260:', transaction10260);
        
        if (transaction10260 && transaction10260.length > 0) {
          for (const trans of transaction10260) {
            console.log(`Transaction 10260 - ID: ${trans.id}`);
            console.log(`Transaction 10260 - category_id: ${trans.category_id}`);
            console.log(`Transaction 10260 - ecriture_lib: ${trans.ecriture_lib}`);
            console.log(`Transaction 10260 - journal_type: ${trans.journal_type}`);
            console.log(`Transaction 10260 - credit: ${trans.credit}`);
            console.log(`Transaction 10260 - debit: ${trans.debit}`);
            console.log(`Transaction 10260 - fiscal_year_id: ${trans.fiscal_year_id}`);
            
            // Check if this transaction has a category
            if (trans.category_id) {
              const { data: category, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .eq('id', trans.category_id)
                .single();
                
              if (categoryError) {
                console.log(`Error fetching category for transaction 10260:`, categoryError);
              } else {
                console.log(`Transaction 10260 - Category found:`, category);
                console.log(`Transaction 10260 - Category name: ${category.name}`);
                console.log(`Transaction 10260 - Category type: ${category.type}`);
                console.log(`Transaction 10260 - Is this an income category? ${category.type === 'income' ? 'YES' : 'NO'}`);
              }
            } else {
              console.log(`Transaction 10260 - NO CATEGORY ASSIGNED (category_id is null)`);
            }
            
            // Check if this transaction is in income_transaction_logs
            const { data: logEntry, error: logError } = await supabase
              .from('income_transaction_logs')
              .select('*')
              .eq('transaction_id', trans.id);
              
            if (logError) {
              console.log(`Error checking logs for transaction 10260:`, logError);
            } else {
              console.log(`Transaction 10260 - Found in income_transaction_logs: ${logEntry && logEntry.length > 0 ? 'YES' : 'NO'}`);
              if (logEntry && logEntry.length > 0) {
                console.log(`Transaction 10260 - Log entries:`, logEntry);
              }
            }
            
            console.log('--- End of transaction 10260 analysis ---');
          }
        } else {
          console.log('NO TRANSACTION FOUND with ecriture_num 10260');
        }
      }
      console.log('=== END TRANSACTION 10260 ANALYSIS ===');
      
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
      
      // Try different approaches to find ecriture_num "292"
      console.log('Trying different ways to find ecriture_num "292"...');
      
      // Try as string (this should be the correct approach now)
      const { data: byString, error: stringError } = await supabase
        .from('transactions')
        .select('*')
        .eq('ecriture_num', '292');
      
      console.log('Search by string "292":', byString?.length || 0, 'results');
      if (stringError) console.log('String search error:', stringError);
      
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
        throw error;
      }
      
      console.log('Raw data from main query - total rows:', data?.length || 0);
      
      // Check for the specific ID in the full result set
      const transaction292ById = data?.find(t => t.id === '799b508f-4c82-4ad8-88fa-7dc61950d1d1');
      console.log('Transaction found by ID in main results:', transaction292ById ? 'YES' : 'NO');
      if (transaction292ById) {
        console.log('Transaction 292 details from main query:', transaction292ById);
      }
      
      // Check for ecriture_num "292" as string
      const transaction292ByNum = data?.find(t => t.ecriture_num === '292');
      
      console.log('Transaction found by ecriture_num "292" (string):', transaction292ByNum ? 'YES' : 'NO');
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
        t.ecriture_num === '292' ||
        t.id === '799b508f-4c82-4ad8-88fa-7dc61950d1d1'
      );
      
      console.log('Transactions related to "292" or with the specific ID:', relatedTransactions?.map(t => ({
        id: t.id,
        ecriture_num: t.ecriture_num,
        ecriture_lib: t.ecriture_lib,
        category_id: t.category_id
      })));
      
      console.log('=== END COMPREHENSIVE DEBUG ===');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
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
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
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
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }
};
