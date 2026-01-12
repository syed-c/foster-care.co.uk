-- Update RLS policy for reviews table to allow agency owners to manage reviews
-- Remove the old policy that might conflict
DROP POLICY IF EXISTS "Agency owners can manage agency reviews" ON public.reviews;

-- Create new policy that allows agency owners to manage reviews for their agency
CREATE POLICY "Agency owners can manage agency reviews" ON public.reviews
    FOR ALL USING (public.owns_agency(auth.uid(), agency_id) OR public.is_admin(auth.uid()));