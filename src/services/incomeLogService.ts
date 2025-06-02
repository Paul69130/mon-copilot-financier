
import { supabase } from '@/integrations/supabase/client';

export interface IncomeTransactionLog {
  id?: string;
  transaction_id?: string;
  action: string;
  details?: any;
  component?: string;
  user_session?: string;
  created_at?: string;
}

export const incomeLogService = {
  async log(logData: Omit<IncomeTransactionLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('income_transaction_logs')
        .insert([{
          ...logData,
          component: logData.component || 'income_transactions',
          user_session: this.getSessionId()
        }]);
      
      if (error) {
        console.error('Error logging income transaction:', error);
      }
    } catch (error) {
      console.error('Error in incomeLogService.log:', error);
    }
  },

  async fetchAll(): Promise<IncomeTransactionLog[]> {
    try {
      const { data, error } = await supabase
        .from('income_transaction_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching income logs:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in incomeLogService.fetchAll:', error);
      return [];
    }
  },

  getSessionId(): string {
    // Générer ou récupérer un ID de session
    let sessionId = sessionStorage.getItem('income_log_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('income_log_session', sessionId);
    }
    return sessionId;
  }
};
