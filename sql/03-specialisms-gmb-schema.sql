-- ============================================
-- FOSTER CARE UK - SPECIALISMS & GMB SCHEMA
-- ============================================
-- This migration adds:
-- 1. Specialisms table for fostering types
-- 2. Agency-Specialisms junction table
-- 3. GMB sync fields to agencies table
-- 4. Enhanced location hierarchy fields
-- ============================================

-- SPECIALISMS TABLE
-- Stores fostering specialisms like therapeutic, emergency, respite, etc.
CREATE TABLE IF NOT EXISTS public.specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  icon_name VARCHAR(50),
  seo_title VARCHAR(100),
  seo_description VARCHAR(200),
  hero_content TEXT,
  faq_content JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AGENCY SPECIALISMS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.agency_specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  specialism_id UUID NOT NULL REFERENCES public.specialisms(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_id, specialism_id)
);

-- ADD GMB FIELDS TO AGENCIES
-- These fields track Google My Business sync status
ALTER TABLE public.agencies 
  ADD COLUMN IF NOT EXISTS gmb_place_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gmb_last_sync TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS gmb_sync_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS gmb_data JSONB,
  ADD COLUMN IF NOT EXISTS claim_status VARCHAR(50) DEFAULT 'unclaimed',
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verification_method VARCHAR(50),
  ADD COLUMN IF NOT EXISTS short_description VARCHAR(300),
  ADD COLUMN IF NOT EXISTS support_offered TEXT[],
  ADD COLUMN IF NOT EXISTS who_suitable_for TEXT[],
  ADD COLUMN IF NOT EXISTS opening_hours JSONB,
  ADD COLUMN IF NOT EXISTS social_links JSONB,
  ADD COLUMN IF NOT EXISTS images JSONB;

-- ADD LOCATION HIERARCHY FIELDS
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS location_level VARCHAR(50),
  ADD COLUMN IF NOT EXISTS region_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS county_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS unique_content TEXT,
  ADD COLUMN IF NOT EXISTS local_guidance TEXT,
  ADD COLUMN IF NOT EXISTS nearby_locations UUID[];

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_specialisms_slug ON public.specialisms(slug);
CREATE INDEX IF NOT EXISTS idx_specialisms_active ON public.specialisms(is_active);
CREATE INDEX IF NOT EXISTS idx_agency_specialisms_agency ON public.agency_specialisms(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_specialisms_specialism ON public.agency_specialisms(specialism_id);
CREATE INDEX IF NOT EXISTS idx_agencies_gmb_place_id ON public.agencies(gmb_place_id);
CREATE INDEX IF NOT EXISTS idx_agencies_claim_status ON public.agencies(claim_status);
CREATE INDEX IF NOT EXISTS idx_locations_level ON public.locations(location_level);

-- INSERT DEFAULT SPECIALISMS
INSERT INTO public.specialisms (name, slug, description, long_description, icon_name, display_order) VALUES
  ('Therapeutic Fostering', 'therapeutic-fostering', 
   'Specialised care for children with trauma and complex emotional needs',
   'Therapeutic fostering provides intensive support for children who have experienced significant trauma, abuse, or neglect. Foster carers receive additional training in trauma-informed care and work closely with therapists and psychologists to support the child''s healing journey.',
   'Heart', 1),
  ('Emergency Fostering', 'emergency-fostering',
   'Immediate placements for children in urgent need of safe care',
   'Emergency foster carers provide immediate, short-term care for children who need to be removed from their homes urgently. This could be due to abuse, neglect, or a family crisis. Emergency placements typically last from a few days to a few weeks.',
   'AlertCircle', 2),
  ('Short-term Fostering', 'short-term-fostering',
   'Temporary care while long-term plans are developed',
   'Short-term fostering provides care for children for a defined period, usually up to two years. During this time, social workers work with the birth family to determine whether the child can safely return home or needs a permanent alternative placement.',
   'Clock', 3),
  ('Long-term Fostering', 'long-term-fostering',
   'Providing a stable home until adulthood',
   'Long-term fostering offers children a permanent family environment when they cannot return to their birth families but adoption is not appropriate. Foster carers commit to caring for the child until they reach independence.',
   'Home', 4),
  ('Respite Fostering', 'respite-fostering',
   'Short breaks for foster families and birth families',
   'Respite foster carers provide short-term care to give other foster carers or birth families a break. This might be for a weekend, a week, or during school holidays. It helps prevent carer burnout and supports family stability.',
   'Coffee', 5),
  ('Parent and Child Fostering', 'parent-child-fostering',
   'Supporting parents and their children together',
   'Parent and child placements allow a parent (usually a young or vulnerable mother) to live with foster carers alongside their child. Foster carers help assess parenting skills and provide support and guidance to help the parent care for their child safely.',
   'Users', 6),
  ('Sibling Group Fostering', 'sibling-group-fostering',
   'Keeping brothers and sisters together',
   'Sibling group foster carers have the space and skills to care for two or more siblings together. Keeping siblings together is a priority in foster care as it provides stability and helps maintain important family bonds.',
   'Users', 7),
  ('Teen Fostering', 'teen-fostering',
   'Specialist support for teenagers',
   'Fostering teenagers requires specific skills and understanding of adolescent development. Teen foster carers help young people navigate the challenges of adolescence while providing a stable, supportive home environment.',
   'GraduationCap', 8),
  ('Disability Fostering', 'disability-fostering',
   'Caring for children with disabilities',
   'Disability foster carers have additional training and often adapted homes to care for children with physical disabilities, learning difficulties, or complex health needs. They work closely with healthcare professionals to ensure children receive appropriate care.',
   'Accessibility', 9),
  ('Remand Fostering', 'remand-fostering',
   'Supporting young people in the criminal justice system',
   'Remand foster carers provide an alternative to custody for young people awaiting trial or sentencing. They receive specialist training to support young people involved with the criminal justice system and help them address the factors that led to their offending.',
   'Scale', 10)
ON CONFLICT (slug) DO NOTHING;

-- ROW LEVEL SECURITY
ALTER TABLE public.specialisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_specialisms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to specialisms
CREATE POLICY "Specialisms are viewable by everyone"
  ON public.specialisms FOR SELECT
  USING (is_active = true);

-- Allow public read access to agency specialisms
CREATE POLICY "Agency specialisms are viewable by everyone"
  ON public.agency_specialisms FOR SELECT
  USING (true);

-- Allow admins to manage specialisms
CREATE POLICY "Admins can manage specialisms"
  ON public.specialisms FOR ALL
  USING (public.is_admin(auth.uid()));

-- Allow admins and agency owners to manage agency specialisms
CREATE POLICY "Admins can manage agency specialisms"
  ON public.agency_specialisms FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Agency owners can manage their specialisms"
  ON public.agency_specialisms FOR ALL
  USING (public.owns_agency(agency_id, auth.uid()));

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_specialisms_updated_at ON public.specialisms;
CREATE TRIGGER update_specialisms_updated_at
  BEFORE UPDATE ON public.specialisms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
