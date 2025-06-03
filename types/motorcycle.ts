export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  chassis_number: string;
  renavam: string;
  daily_rate: number;
  description: string;
  category: string;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  image_urls: string[];
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner?: {
    id: string;
    full_name: string;
    company_name?: string;
    verified?: boolean;
  };
}

export interface MotorcycleFilters {
  city?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}