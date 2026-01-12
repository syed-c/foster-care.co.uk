-- Create country_pages table
CREATE TABLE public.country_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_country_pages_slug ON public.country_pages(slug);
CREATE INDEX idx_country_pages_active ON public.country_pages(is_active);

-- Enable RLS
ALTER TABLE public.country_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active country pages" ON public.country_pages
    FOR SELECT TO authenticated, anon
    USING (is_active = true);

CREATE POLICY "Admins can manage country pages" ON public.country_pages
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));