/*
  # Initial Schema Setup for Motorcycle Rental App

  1. New Tables
    - `profiles` - User profiles with user type (renter, owner, admin)
    - `renter_profiles` - Detailed information for renters
    - `owner_profiles` - Detailed information for owners (shops)
    - `motorcycles` - Motorcycle listings
    - `rentals` - Rental records
    - `payments` - Payment records
    - `contracts` - Contract records
    - `notifications` - User notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for owners to manage their motorcycles
    - Add policies for admins to access all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  user_type text CHECK (user_type IN ('renter', 'owner', 'admin')),
  profile_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create renter profiles table
CREATE TABLE IF NOT EXISTS renter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  profession text,
  marital_status text,
  address text,
  zip_code text,
  gate_type text,
  rental_purpose text,
  driver_license_path text,
  proof_of_residence_path text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create owner profiles table
CREATE TABLE IF NOT EXISTS owner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  company_name text NOT NULL,
  cnpj text,
  address text,
  zip_code text,
  phone_number text,
  business_description text,
  business_license_path text,
  company_document_path text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create motorcycles table
CREATE TABLE IF NOT EXISTS motorcycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text NOT NULL,
  year integer,
  color text,
  license_plate text,
  chassis_number text,
  renavam text,
  daily_rate numeric NOT NULL,
  description text,
  category text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'unavailable')),
  image_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motorcycle_id uuid REFERENCES motorcycles(id) ON DELETE CASCADE,
  renter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rental_id uuid REFERENCES rentals(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'cancelled')),
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create wallet table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text CHECK (type IN ('deposit', 'withdrawal', 'payment')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE renter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for renter profiles
CREATE POLICY "Renters can read own profile"
  ON renter_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Renters can create own profile"
  ON renter_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Renters can update own profile"
  ON renter_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for owner profiles
CREATE POLICY "Owners can read own profile"
  ON owner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can create own profile"
  ON owner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own profile"
  ON owner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for motorcycles
CREATE POLICY "Anyone can view available motorcycles"
  ON motorcycles
  FOR SELECT
  USING (status = 'available' OR owner_id = auth.uid());

CREATE POLICY "Owners can manage own motorcycles"
  ON motorcycles
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Create policies for rentals
CREATE POLICY "Users can view own rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (renter_id = auth.uid() OR motorcycle_id IN (
    SELECT id FROM motorcycles WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Renters can create rentals"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Users can update own rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (renter_id = auth.uid() OR motorcycle_id IN (
    SELECT id FROM motorcycles WHERE owner_id = auth.uid()
  ));

-- Create policies for payments
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR rental_id IN (
    SELECT id FROM rentals WHERE motorcycle_id IN (
      SELECT id FROM motorcycles WHERE owner_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for contracts
CREATE POLICY "Users can view own contracts"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR rental_id IN (
    SELECT id FROM rentals WHERE motorcycle_id IN (
      SELECT id FROM motorcycles WHERE owner_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create own contracts"
  ON contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own contracts"
  ON contracts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for wallets
CREATE POLICY "Users can view own wallet"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own wallet"
  ON wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for wallet transactions
CREATE POLICY "Users can view own wallet transactions"
  ON wallet_transactions
  FOR SELECT
  TO authenticated
  USING (wallet_id IN (
    SELECT id FROM wallets WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own wallet transactions"
  ON wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (wallet_id IN (
    SELECT id FROM wallets WHERE user_id = auth.uid()
  ));

-- Create function to create wallet when user is created
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create wallet when user is created
CREATE TRIGGER on_user_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE create_wallet_for_new_user();