-- FIX PERMISSIONS for page_content_blocks
-- Run this if the table exists but the API says "Could not find the table"

-- 1. Grant usage on schema (standard)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant table permissions explicitly
GRANT ALL ON TABLE public.page_content_blocks TO anon, authenticated, service_role;

-- 3. Enable RLS (idempotent)
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;

-- 4. Re-create policies to be sure
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.page_content_blocks;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.page_content_blocks;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.page_content_blocks;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.page_content_blocks;

-- Create policies again
CREATE POLICY "Enable read access for all users"
ON public.page_content_blocks FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.page_content_blocks FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON public.page_content_blocks FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON public.page_content_blocks FOR DELETE
TO authenticated
USING (true);

-- 5. Force schema cache reload (optional but helpful)
NOTIFY pgrst, 'reload schema';
