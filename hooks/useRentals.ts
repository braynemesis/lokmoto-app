import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { RentalProposal } from '@/types/rental';
import { useAuth } from '@/context/AuthContext';

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

      query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data as RentalProposal[];
    },
    enabled: !!user
  });
}

export function useRentalProposal(id: string) {
  return useQuery({
    queryKey: ['rental-proposal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          motorcycle:motorcycles(*),
          renter:profiles!rentals_renter_id_fkey(id, full_name, email, phone),
          owner:profiles!rentals_owner_id_fkey(id, full_name, email, phone)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as RentalProposal;
    },
    enabled: !!id
  });
}

export function useCreateRentalProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposal: Partial<RentalProposal>) => {
      // First, check if there are any overlapping rentals
      const { data: existingRentals, error: checkError } = await supabase
        .from('rentals')
        .select('id')
        .eq('motorcycle_id', proposal.motorcycle_id)
        .eq('status', 'approved')
        .or(`start_date.lte.${proposal.end_date},end_date.gte.${proposal.start_date}`);

      if (checkError) throw checkError;

      if (existingRentals && existingRentals.length > 0) {
        throw new Error('Esta moto já está reservada para o período selecionado.');
      }

      // If no overlapping rentals, create the proposal
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rental-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['rental-proposal', data.id] });
    }
  });
}