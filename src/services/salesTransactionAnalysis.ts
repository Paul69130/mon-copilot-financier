
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/financial';

export interface UnloggedSalesTransaction {
  id: string;
  ecriture_num?: string;
  ecriture_date: string;
  ecriture_lib: string;
  journal_type?: string;
  credit?: number;
  debit?: number;
  category_id?: string;
}

export const salesTransactionAnalysis = {
  async findUnloggedSalesTransactions(): Promise<UnloggedSalesTransaction[]> {
    try {
      console.log('=== ANALYZING UNLOGGED SALES TRANSACTIONS ===');
      
      // First, get all transactions with journal_type = 'Ventes'
      const { data: salesTransactions, error: salesError } = await supabase
        .from('transactions')
        .select('*')
        .eq('journal_type', 'Ventes')
        .order('ecriture_date', { ascending: false });
      
      if (salesError) {
        console.error('Error fetching sales transactions:', salesError);
        return [];
      }
      
      console.log(`Found ${salesTransactions?.length || 0} transactions with journal_type 'Ventes'`);
      
      // Get all transaction IDs that are already logged
      const { data: loggedTransactionIds, error: logError } = await supabase
        .from('income_transaction_logs')
        .select('transaction_id')
        .not('transaction_id', 'is', null);
      
      if (logError) {
        console.error('Error fetching logged transaction IDs:', logError);
        return [];
      }
      
      const loggedIds = new Set(loggedTransactionIds?.map(log => log.transaction_id) || []);
      console.log(`Found ${loggedIds.size} unique transaction IDs in logs`);
      
      // Filter sales transactions that are not in the logs
      const unloggedTransactions = salesTransactions?.filter(transaction => 
        !loggedIds.has(transaction.id)
      ) || [];
      
      console.log(`Found ${unloggedTransactions.length} unlogged sales transactions`);
      
      // Log details for debugging
      unloggedTransactions.forEach(transaction => {
        console.log(`Unlogged sales transaction: ${transaction.ecriture_num} - ${transaction.ecriture_lib} - ${transaction.credit || transaction.debit}`);
      });
      
      console.log('=== END SALES TRANSACTION ANALYSIS ===');
      
      return unloggedTransactions.map(t => ({
        id: t.id,
        ecriture_num: t.ecriture_num,
        ecriture_date: t.ecriture_date,
        ecriture_lib: t.ecriture_lib,
        journal_type: t.journal_type,
        credit: t.credit,
        debit: t.debit,
        category_id: t.category_id
      }));
      
    } catch (error) {
      console.error('Error in findUnloggedSalesTransactions:', error);
      return [];
    }
  }
};
