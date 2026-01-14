-- Fix RLS policies for seller_applications table
-- This allows users to INSERT their own applications

-- Enable RLS
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own application
DROP POLICY IF EXISTS "Users can submit seller applications" ON public.seller_applications;
CREATE POLICY "Users can submit seller applications" 
ON public.seller_applications
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.seller_applications;
CREATE POLICY "Users can view own applications" 
ON public.seller_applications
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all applications
DROP POLICY IF EXISTS "Admins can view all applications" ON public.seller_applications;
CREATE POLICY "Admins can view all applications" 
ON public.seller_applications
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Admins can update applications (approve/reject)
DROP POLICY IF EXISTS "Admins can update applications" ON public.seller_applications;
CREATE POLICY "Admins can update applications" 
ON public.seller_applications
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);
