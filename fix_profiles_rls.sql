-- Fix RLS policies on profiles table to allow users to read their own profile

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Allow users to SELECT their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to UPDATE their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE 
USING (auth.uid() = id);

-- Allow public read access (for seller names, etc)
CREATE POLICY "Public profiles are viewable" 
ON public.profiles
FOR SELECT 
USING (true);

-- Now update the specific user to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'quakestartup@gmail.com';

-- Verify
SELECT id, email, role FROM profiles WHERE email = 'quakestartup@gmail.com';
