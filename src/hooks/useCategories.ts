
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/financial';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding category:', error);
        return null;
      }
      
      setCategories(prev => [...prev, data]);
      return data.id;
    } catch (error) {
      console.error('Error adding category:', error);
      return null;
    }
  };

  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategories,
    refetch: fetchCategories
  };
};
