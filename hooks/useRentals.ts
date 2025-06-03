import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { RentalProposal } from '@/types/rental';

export function useRentalProposals(type: 'sent' | 'received') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rental-proposals', type],
    queryFn: async () => {
      const query = supabase
        .from('rentals')
        .select(`
          *,
          motorcycle:motorcycles(*),
          renter:profiles!rentals_renter_id_fkey(id, full_name, email, phone),
          owner:profiles!rentals_owner_id_fkey(id, full_name, email, phone)
        `);

      if (type === 'sent') {
        query.eq('renter_id', user?.id);
      } else {
        query.eq('owner_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as RentalProposal[];
    },
    enabled: !!user
  });
}

export function useCreateRentalProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposal: Partial<RentalProposal>) => {
      const { data, error } = await supabase
        .from('rentals')
        .insert(proposal)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-proposals'] });
    }
  });
}

export function useUpdateRentalProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...update }: Partial<RentalProposal> & { id: string }) => {
      const { data, error } = await supabase
        .from('rentals')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-proposals'] });
    }
  });
}