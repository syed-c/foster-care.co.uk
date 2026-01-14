-- =============================================
-- SUPER ADMIN SETUP FOR adilahmadip@gmail.com
-- =============================================
-- Run this SQL in Supabase SQL Editor to make the user a super admin

-- First, let's find the user and add them as admin
DO $$
DECLARE
    v_user_id uuid;
BEGIN
    -- Find the user by email
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'adilahmadip@gmail.com';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User not found. They need to sign up first.';
    ELSE
        -- Insert admin role (ignore if already exists)
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'User % has been granted admin role', v_user_id;
    END IF;
END $$;

-- =============================================
-- SITE SETTINGS TABLE
-- =============================================
-- Create a table to store site-wide settings

CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_json JSONB,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admin can read/write
CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read certain settings
CREATE POLICY "Public can read public settings" ON public.site_settings
    FOR SELECT TO anon
    USING (category IN ('general', 'branding', 'contact'));

-- Insert default settings
INSERT INTO public.site_settings (key, value, value_json, description, category) VALUES
-- General Settings
('site_name', 'Foster Care UK', NULL, 'Main site name', 'general'),
('site_tagline', 'Find Trusted Foster Care Agencies', NULL, 'Site tagline/slogan', 'general'),
('site_description', 'The UK''s leading directory for finding and comparing foster care agencies. Connect with trusted agencies near you.', NULL, 'Site meta description', 'general'),

-- Contact Settings
('contact_email', 'hello@fostercare.uk', NULL, 'Main contact email', 'contact'),
('contact_phone', '0800 123 4567', NULL, 'Main contact phone', 'contact'),
('contact_address', 'United Kingdom', NULL, 'Physical address', 'contact'),

-- Branding Settings
('primary_color', '#0f766e', NULL, 'Primary brand color', 'branding'),
('logo_text', 'FC', NULL, 'Logo text abbreviation', 'branding'),

-- Social Media
('social_facebook', '', NULL, 'Facebook page URL', 'social'),
('social_twitter', '', NULL, 'Twitter/X profile URL', 'social'),
('social_linkedin', '', NULL, 'LinkedIn page URL', 'social'),
('social_instagram', '', NULL, 'Instagram profile URL', 'social'),

-- Feature Flags
('enable_lead_notifications', 'true', NULL, 'Send email on new leads', 'features'),
('enable_auto_approve_reviews', 'false', NULL, 'Auto-approve new reviews', 'features'),
('enable_agency_registration', 'true', NULL, 'Allow new agency registrations', 'features'),

-- SEO Settings
('google_analytics_id', '', NULL, 'Google Analytics ID', 'seo'),
('google_tag_manager_id', '', NULL, 'Google Tag Manager ID', 'seo')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- SPECIALISMS TABLE (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.specialisms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    seo_title VARCHAR(100),
    seo_description VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specialisms ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read active specialisms" ON public.specialisms
    FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage specialisms" ON public.specialisms
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default specialisms
INSERT INTO public.specialisms (name, slug, description, icon, display_order) VALUES
('Emergency & Short-Term', 'emergency-short-term', 'Providing temporary care for children in urgent situations', 'Clock', 1),
('Long-Term Fostering', 'long-term-fostering', 'Offering stable, permanent homes for children who cannot return to their birth families', 'Home', 2),
('Respite Care', 'respite-care', 'Temporary breaks for foster families and birth parents', 'Heart', 3),
('Therapeutic Fostering', 'therapeutic-fostering', 'Specialized care for children with complex emotional or behavioral needs', 'Brain', 4),
('Parent & Child', 'parent-child', 'Supporting parents and their children together in a foster setting', 'Users', 5),
('Sibling Groups', 'sibling-groups', 'Keeping brothers and sisters together in foster care', 'UsersRound', 6),
('Teenagers', 'teenagers', 'Specialized placements for young people aged 13-18', 'GraduationCap', 7),
('UASC', 'unaccompanied-asylum-seeking', 'Supporting unaccompanied asylum-seeking children', 'Globe', 8),
('Disability Support', 'disability-support', 'Care for children with physical or learning disabilities', 'Accessibility', 9),
('Mother & Baby', 'mother-baby', 'Placements for young mothers and their babies', 'Baby', 10)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- AGENCY SPECIALISMS JUNCTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.agency_specialisms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
    specialism_id uuid REFERENCES public.specialisms(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(agency_id, specialism_id)
);

-- Enable RLS
ALTER TABLE public.agency_specialisms ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read agency specialisms" ON public.agency_specialisms
    FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins can manage agency specialisms" ON public.agency_specialisms
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- VERIFY SETUP
-- =============================================
SELECT 'Site settings created:' as status, COUNT(*) as count FROM public.site_settings;
SELECT 'Specialisms created:' as status, COUNT(*) as count FROM public.specialisms;

-- Show the admin user
SELECT 
    u.email,
    r.role,
    r.created_at
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = 'adilahmadip@gmail.com';
