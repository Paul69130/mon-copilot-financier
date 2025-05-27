
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FiscalYear } from '@/types/financial';

export const useFiscalYears = () => {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFiscalYear, setCurrentFiscalYear] = useState<FiscalYear | null>(null);

  const fetchFiscalYears = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscal_years')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching fiscal years:', error);
        return;
      }
      
      setFiscalYears(data || []);
      
      // Determine current fiscal year based on today's date
      const today = new Date().toISOString().split('T')[0];
      const current = data?.find(fy => 
        today >= fy.start_date && today <= fy.end_date
      );
      setCurrentFiscalYear(current || null);
      
    } catch (error) {
      console.error('Error fetching fiscal years:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiscalYears();
  }, []);

  return {
    fiscalYears,
    currentFiscalYear,
    loading,
    refetch: fetchFiscalYears
  };
};
