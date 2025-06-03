import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Motorcycle, MotorcycleFilters } from '@/types/motorcycle';

export function useMotorcycles(filters?: MotorcycleFilters) {
  return useQuery({
    queryKey: ['motorcycles', filters],
    queryFn: async () => {
      let query = supabase
        .from('motorcycles')
        .select(`
          *,
          owner:profiles(id, full_name)
        `)
        .eq('status', 'available');

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters?.minPrice) {
        query = query.gte('daily_rate', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('daily_rate', filters.maxPrice);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

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
          owner:profiles(
            id, 
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Motorcycle;
    },
    enabled: !!id
  });
}

export function useNearbyMotorcycles(latitude: number, longitude: number, radius: number = 10) {
  return useQuery({
    queryKey: ['motorcycles', 'nearby', latitude, longitude, radius],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycles')
        .select(`
          *,
          owner:profiles(id, full_name)
        `)
        .eq('status', 'available')
        .limit(5);

      if (error) throw error;
      return data as Motorcycle[];
    },
    enabled: !!latitude && !!longitude
  });
}

export function useFeaturedMotorcycles() {
  return useQuery({
    queryKey: ['motorcycles', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycles')
        .select(`
          *,
          owner:profiles(id, full_name)
        `)
        .eq('status', 'available')
        .limit(5);

      if (error) throw error;
      return data as Motorcycle[];
    }
  });
}