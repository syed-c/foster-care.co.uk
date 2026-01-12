-- Update RLS policy for agencies table to allow authenticated users to insert
-- Remove the old policy that only allowed admins to insert
DROP POLICY IF EXISTS "Admins can insert agencies" ON public.agencies;

-- Create new policy that allows authenticated users to insert agencies
CREATE POLICY "Authenticated users can insert agencies" ON public.agencies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Update the claim policy to allow users to claim unclaimed agencies
-- Remove the old policy first
DROP POLICY IF EXISTS "Agency owners can update their agency" ON public.agencies;

-- Create new policy that allows users to update their own agencies or claim unclaimed ones
CREATE POLICY "Users can update their agencies" ON public.agencies
    FOR UPDATE USING (
        (auth.uid() = user_id) OR 
        (is_admin(auth.uid())) OR 
        (auth.uid() IS NOT NULL AND is_claimed = false)
    );