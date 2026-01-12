-- ============================================
-- Foster Care UK - Database Schema Setup
-- ============================================
-- Run this script to set up the complete database schema
-- This includes all tables, RLS policies, functions, and triggers

-- ============================================
-- 1. ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'agency', 'foster_parent', 'user');

-- ============================================
-- 2. TABLES
-- ============================================

-- Locations table (countries, regions, cities)
CREATE TABLE public.locations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- 'country', 'region', 'city'
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    hero_content TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    agency_count INTEGER DEFAULT 0,
    faq_content JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agencies table
CREATE TABLE public.agencies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    address TEXT,
    city TEXT,
    postcode TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_claimed BOOLEAN DEFAULT false,
    ofsted_rating TEXT,
    ofsted_report_url TEXT,
    services JSONB DEFAULT '[]'::jsonb,
    service_areas JSONB DEFAULT '[]'::jsonb,
    specializations JSONB DEFAULT '[]'::jsonb,
    leads_remaining INTEGER DEFAULT 0,
    subscription_plan TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agency Locations junction table
CREATE TABLE public.agency_locations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(agency_id, location_id)
);

-- Profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    admin_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads table
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    postcode TEXT,
    message TEXT,
    fostering_interest TEXT,
    accommodation_type TEXT,
    preferred_age_group TEXT,
    has_children BOOLEAN,
    has_pets BOOLEAN,
    source_type TEXT,
    source_agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
    source_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'new',
    is_viewed BOOLEAN DEFAULT false,
    viewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FAQs table
CREATE TABLE public.faqs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    page_key TEXT,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CMS Content table
CREATE TABLE public.cms_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key TEXT NOT NULL,
    section_key TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    content_json JSONB,
    image_url TEXT,
    cta_text TEXT,
    cta_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(page_key, section_key)
);

-- Blog Posts table
CREATE TABLE public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Legal Pages table
CREATE TABLE public.legal_pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3. INDEXES
-- ============================================
CREATE INDEX idx_locations_parent_id ON public.locations(parent_id);
CREATE INDEX idx_locations_slug ON public.locations(slug);
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_agencies_slug ON public.agencies(slug);
CREATE INDEX idx_agencies_city ON public.agencies(city);
CREATE INDEX idx_agencies_is_featured ON public.agencies(is_featured);
CREATE INDEX idx_agency_locations_agency ON public.agency_locations(agency_id);
CREATE INDEX idx_agency_locations_location ON public.agency_locations(location_id);
CREATE INDEX idx_reviews_agency ON public.reviews(agency_id);
CREATE INDEX idx_leads_agency ON public.leads(source_agency_id);
CREATE INDEX idx_faqs_location ON public.faqs(location_id);
CREATE INDEX idx_faqs_page_key ON public.faqs(page_key);

-- ============================================
-- 4. FUNCTIONS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- Check if user owns an agency
CREATE OR REPLACE FUNCTION public.owns_agency(_user_id UUID, _agency_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.agencies
        WHERE id = _agency_id AND user_id = _user_id
    )
$$;

-- Function to create an agency for the current user
CREATE OR REPLACE FUNCTION public.create_agency(
    p_name TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_address TEXT,
    p_city TEXT,
    p_postcode TEXT,
    p_website TEXT
)
RETURNS UUID  -- Returns the ID of the created agency
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_agency_id UUID;
    current_user_id UUID;
BEGIN
    -- Get the current user ID
    current_user_id := auth.uid();
    
    -- Check if user is authenticated
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to create an agency';
    END IF;
    
    -- Check if slug already exists
    IF EXISTS (SELECT 1 FROM public.agencies WHERE slug = p_slug) THEN
        RAISE EXCEPTION 'Agency with this slug already exists';
    END IF;
    
    -- Insert the new agency
    INSERT INTO public.agencies (
        name,
        slug,
        description,
        email,
        phone,
        address,
        city,
        postcode,
        website,
        user_id,
        is_claimed,
        is_verified,
        is_featured
    ) VALUES (
        p_name,
        p_slug,
        p_description,
        p_email,
        p_phone,
        p_address,
        p_city,
        p_postcode,
        p_website,
        current_user_id,
        true,
        false,
        false
    )
    RETURNING id INTO new_agency_id;
    
    -- Assign agency role to the user if they don't have it
    INSERT INTO public.user_roles (user_id, role)
    VALUES (current_user_id, 'agency')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN new_agency_id;
END;
$$;

-- Function to claim an existing agency
CREATE OR REPLACE FUNCTION public.claim_agency(
    p_agency_id UUID,
    p_verification_contact TEXT,
    p_verification_type TEXT  -- 'email' or 'phone'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
    agency_record RECORD;
BEGIN
    -- Get the current user ID
    current_user_id := auth.uid();
    
    -- Check if user is authenticated
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to claim an agency';
    END IF;
    
    -- Get the agency record
    SELECT * INTO agency_record FROM public.agencies WHERE id = p_agency_id;
    
    -- Check if agency exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Agency not found';
    END IF;
    
    -- Check if agency is already claimed
    IF agency_record.is_claimed THEN
        RAISE EXCEPTION 'Agency is already claimed by another user';
    END IF;
    
    -- Update the agency to assign to current user
    UPDATE public.agencies
    SET 
        user_id = current_user_id,
        is_claimed = true,
        email = CASE WHEN p_verification_type = 'email' THEN p_verification_contact ELSE email END,
        phone = CASE WHEN p_verification_type = 'phone' THEN p_verification_contact ELSE phone END
    WHERE id = p_agency_id;
    
    -- Assign agency role to the user if they don't have it
    INSERT INTO public.user_roles (user_id, role)
    VALUES (current_user_id, 'agency')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- TODO: In production, you would implement proper verification here
    -- For now, we assume verification is handled outside this function
END;
$$;

-- Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON public.agencies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at
    BEFORE UPDATE ON public.cms_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_pages_updated_at
    BEFORE UPDATE ON public.legal_pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Locations policies
CREATE POLICY "Anyone can view locations" ON public.locations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage locations" ON public.locations
    FOR ALL USING (is_admin(auth.uid()));

-- Agencies policies
CREATE POLICY "Anyone can view agencies" ON public.agencies
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert agencies" ON public.agencies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their agencies" ON public.agencies
    FOR UPDATE USING (
        (auth.uid() = user_id) OR 
        (is_admin(auth.uid())) OR 
        (auth.uid() IS NOT NULL AND is_claimed = false)
    );

CREATE POLICY "Admins can delete agencies" ON public.agencies
    FOR DELETE USING (is_admin(auth.uid()));

-- Agency locations policies
CREATE POLICY "Anyone can view agency locations" ON public.agency_locations
    FOR SELECT USING (true);

CREATE POLICY "Agency owners or admins can manage agency locations" ON public.agency_locations
    FOR ALL USING (owns_agency(auth.uid(), agency_id) OR is_admin(auth.uid()));

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (is_admin(auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING ((is_approved = true) OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING ((auth.uid() = user_id) OR is_admin(auth.uid()));

CREATE POLICY "Agency owners can manage agency reviews" ON public.reviews
    FOR ALL USING (owns_agency(auth.uid(), agency_id) OR is_admin(auth.uid()));

CREATE POLICY "Admins can delete reviews" ON public.reviews
    FOR DELETE USING (is_admin(auth.uid()));

-- Leads policies
CREATE POLICY "Anyone can create leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON public.leads
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Agency owners can view their leads" ON public.leads
    FOR SELECT USING (owns_agency(auth.uid(), source_agency_id));

CREATE POLICY "Admins can update leads" ON public.leads
    FOR UPDATE USING (is_admin(auth.uid()));

-- FAQs policies
CREATE POLICY "Anyone can view active FAQs" ON public.faqs
    FOR SELECT USING ((is_active = true) OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage FAQs" ON public.faqs
    FOR ALL USING (is_admin(auth.uid()));

-- CMS Content policies
CREATE POLICY "Anyone can view active CMS content" ON public.cms_content
    FOR SELECT USING ((is_active = true) OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage CMS content" ON public.cms_content
    FOR ALL USING (is_admin(auth.uid()));

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
    FOR SELECT USING ((is_published = true) OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (is_admin(auth.uid()));

-- Legal pages policies
CREATE POLICY "Anyone can view active legal pages" ON public.legal_pages
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage legal pages" ON public.legal_pages
    FOR ALL USING (is_admin(auth.uid()));
