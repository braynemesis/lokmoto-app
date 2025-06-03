/*
  # Add Clerk Integration

  1. Changes
    - Add clerk_id to profiles table
    - Add phone_number to profiles table
    - Update RLS policies for Clerk authentication

  2. Security
    - Update RLS policies to work with Clerk JWT claims
    - Add policies for profile management
*/

-- Add clerk_id to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS clerk_id text UNIQUE,
ADD COLUMN IF NOT EXISTS phone_number text;

-- Update RLS policies for Clerk authentication
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (
  auth.jwt() ->> 'sub' = clerk_id
);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (
  auth.jwt() ->> 'sub' = clerk_id
)
WITH CHECK (
  auth.jwt() ->> 'sub' = clerk_id
);

-- Function to handle profile creation/update from Clerk webhook
CREATE OR REPLACE FUNCTION handle_clerk_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, clerk_id, full_name)
  VALUES (
    gen_random_uuid(),
    NEW.email,
    NEW.clerk_id,
    NEW.full_name
  )
  ON CONFLICT (clerk_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;