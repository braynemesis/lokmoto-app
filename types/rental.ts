export interface RentalProposal {
  id: string;
  motorcycle_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  additional_info?: string;
  rejection_reason?: string;
  created_at: string;
  motorcycle?: Motorcycle;
  renter?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
  owner?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface Contract {
  id: string;
  rental_id: string;
  status: 'pending' | 'signed' | 'cancelled';
  signed_at?: string;
  created_at: string;
  updated_at: string;
  rental?: RentalProposal;
}