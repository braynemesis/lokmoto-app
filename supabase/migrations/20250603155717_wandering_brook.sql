/*
  # Add User Type and Profile Status

  1. Changes
    - Add user_type column to profiles table
    - Add profile_status column to profiles table
    - Update handle_clerk_user function to handle user type
    - Add policies for user type management

  2. Security
    - Update existing policies to include new columns
    - Add policies for profile status updates
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('renter', 'owner')),
ADD COLUMN IF NOT EXISTS profile_status text DEFAULT 'pending' CHECK (profile_status IN ('pending', 'complete', 'verified'));

-- Update handle_clerk_user function to include user type
CREATE OR REPLACE FUNCTION handle_clerk_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, clerk_id, full_name, user_type, profile_status)
  VALUES (
    gen_random_uuid(),
    NEW.email,
    NEW.clerk_id,
    NEW.full_name,
    COALESCE(NEW.metadata->>'userType', 'renter'),
    'pending'
  )
  ON CONFLICT (clerk_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    user_type = COALESCE(NEW.metadata->>'userType', profiles.user_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies for user type and profile status
CREATE POLICY "Users can update own user type"
ON profiles FOR UPDATE
USING (
  auth.jwt() ->> 'sub' = clerk_id
)
WITH CHECK (
  auth.jwt() ->> 'sub' = clerk_id AND
  profile_status = 'pending'
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON profiles(user_type);
CREATE INDEX IF NOT EXISTS profiles_profile_status_idx ON profiles(profile_status);