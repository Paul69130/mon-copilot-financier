
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BudgetItem } from '@/types/financial';

export const useBudget = () => {
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .select('*');
      
      if (error) {
        console.error('Error fetching budget:', error);
        return;
      }
      
      setBudget(data || []);
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (newBudget: BudgetItem[]) => {
    try {
      // Delete existing budget items and insert new ones
      await supabase.from('budget_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error } = await supabase
        .from('budget_items')
        .insert(newBudget.map(item => ({
          category_id: item.category_id,
          budget_amount: item.budget_amount,
          period: item.period
        })));
      
      if (error) {
        console.error('Error updating budget:', error);
        return;
      }
      
      setBudget(newBudget);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return {
    budget,
    loading,
    updateBudget,
    refetch: fetchBudget
  };
};
