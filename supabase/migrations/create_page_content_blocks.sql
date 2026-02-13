-- Create the page_content_blocks table for CMS dynamic content management
CREATE TABLE IF NOT EXISTS public.page_content_blocks (
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

-- Enable RLS but allow authenticated users full access (admin-only table)
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON public.page_content_blocks
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.page_content_blocks
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.page_content_blocks
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.page_content_blocks
    FOR DELETE TO authenticated USING (true);

-- Also allow anon users to read (for public website rendering)
CREATE POLICY "Allow anon read" ON public.page_content_blocks
    FOR SELECT TO anon USING (true);
