-- Migration to fix the page_content_blocks table schema
-- This drops the incorrect table (using page_id) and recreates it with page_key/block_key

-- Drop the existing malformed table if it exists
DROP TABLE IF EXISTS public.page_content_blocks;

-- Create the page_content_blocks table with the correct schema
CREATE TABLE public.page_content_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key TEXT NOT NULL,
    block_key TEXT NOT NULL,
    block_type TEXT NOT NULL DEFAULT 'text',
    title TEXT,
    content TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(page_key, block_key)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_blocks_page_key ON public.page_content_blocks(page_key);
CREATE INDEX IF NOT EXISTS idx_page_content_blocks_block_key ON public.page_content_blocks(block_key);
CREATE INDEX IF NOT EXISTS idx_page_content_blocks_active ON public.page_content_blocks(is_active);

-- Enable RLS
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow authenticated users (admin) full access
CREATE POLICY "Allow authenticated read" ON public.page_content_blocks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert" ON public.page_content_blocks
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.page_content_blocks
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.page_content_blocks
    FOR DELETE TO authenticated USING (true);

-- Allow anon users to read (for public website rendering)
CREATE POLICY "Allow anon read" ON public.page_content_blocks
    FOR SELECT TO anon USING (true);

-- Re-attach the updated_at trigger (assuming the function exists from previous migrations)
-- We check if the function exists just in case, but usually standard supabase setup has it.
-- If not, simple updated_at management is handled by the initial insert default, but trigger is better.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_page_content_blocks_updated_at
        BEFORE UPDATE ON public.page_content_blocks
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
