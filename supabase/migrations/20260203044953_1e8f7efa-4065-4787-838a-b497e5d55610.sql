-- Fix the INSERT policy to allow admins to insert for any user
DROP POLICY IF EXISTS "Authenticated users can apply as delivery partner" ON public.delivery_staff;

-- Create a new INSERT policy that allows:
-- 1. Users to insert their own record (self-registration)
-- 2. Admins to insert for any user
CREATE POLICY "Users can apply or admins can add" 
ON public.delivery_staff 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add DELETE policy for admins
DROP POLICY IF EXISTS "Admins can delete delivery staff" ON public.delivery_staff;
CREATE POLICY "Admins can delete delivery staff" 
ON public.delivery_staff 
FOR DELETE 
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);