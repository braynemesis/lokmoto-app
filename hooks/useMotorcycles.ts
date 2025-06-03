import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  location: string;
  category: string;
  rating: number;
  owner: {
    id: string;
    name: string;
  };
}

export function useMotorcycles() {
  return useQuery({
    queryKey: ['motorcycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycles')
        .select(`
          *,
          owner:profiles(id, full_name)
        `)
        .eq('status', 'available');

      if (error) throw error;
      return data as Motorcycle[];
    }
  });
}

export function useMotorcycle(id: string) {
  return useQuery({
    queryKey: ['motorcycle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycles')
        .select(`
          *,
          owner:profiles(id, full_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Motorcycle;
    }
  });
}

export function useCreateMotorcycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (motorcycle: Partial<Motorcycle>) => {
      const { data, error } = await supabase
        .from('motorcycles')
        .insert(motorcycle)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
    }
  });
}