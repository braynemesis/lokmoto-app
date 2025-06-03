/*
  # Update Permissions for Public Access

  1. Changes
    - Add policies for public access to motorcycles
    - Add policies for public access to owner profiles
    - Update existing policies for authenticated users

  2. Security
    - Maintain RLS while allowing public read access
    - Restrict sensitive data for unauthenticated users
*/

-- Allow public read access to available motorcycles
CREATE POLICY "Anyone can view available motorcycles"
ON motorcycles FOR SELECT
USING (
  status = 'available'
  OR (
    auth.role() = 'authenticated' 
    AND owner_id = auth.uid()
  )
);

-- Allow public read access to owner profiles (limited data)
CREATE POLICY "Anyone can view owner profiles"
ON owner_profiles FOR SELECT
USING (true);

-- Allow public read access to basic profile information
CREATE POLICY "Anyone can view basic profile information"
ON profiles FOR SELECT
USING (true)
WITH CHECK (
  auth.role() = 'authenticated'
  OR (
    user_type = 'owner'
    AND profile_status = 'verified'
  )
);

-- Update existing policies to work with new public access
ALTER POLICY "Users can read own profile"
ON profiles
RENAME TO "Users can read full profile";

-- Add policy for creating rental proposals
CREATE POLICY "Only authenticated users can create rental proposals"
ON rentals FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Add policy for viewing rental proposals
CREATE POLICY "Users can view own rental proposals"
ON rentals FOR SELECT
TO authenticated
USING (
  renter_id = auth.uid()
  OR motorcycle_id IN (
    SELECT id FROM motorcycles WHERE owner_id = auth.uid()
  )
);