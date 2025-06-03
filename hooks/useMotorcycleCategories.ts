import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useMotorcycleCategories() {
  return useQuery({
    queryKey: ['motorcycle-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycles')
        .select('category')
        .distinct();

      if (error) throw error;
      return data.map(item => item.category).filter(Boolean);
    }
  });
}