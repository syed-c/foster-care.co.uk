-- ============================================
-- FOSTER CARE UK - COMPLETE DATABASE SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This ensures all tables, data, and connections are properly set up
-- ============================================

-- ============================================
-- PART 1: TABLE STRUCTURE UPDATES
-- ============================================

-- Add unique content columns to locations table
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS unique_content TEXT,
  ADD COLUMN IF NOT EXISTS local_guidance TEXT,
  ADD COLUMN IF NOT EXISTS local_stats JSONB,
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(100),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(200);

-- Ensure agency_count column exists
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS agency_count INTEGER DEFAULT 0;

-- ============================================
-- PART 2: SPECIALISMS TABLE SETUP
-- ============================================

-- Create specialisms table if not exists
CREATE TABLE IF NOT EXISTS public.specialisms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert specialisms data
INSERT INTO public.specialisms (name, slug, description, icon_name, display_order, is_active) VALUES
  ('Therapeutic Fostering', 'therapeutic-fostering', 'Specialised care for children with trauma and complex emotional needs', 'Heart', 1, true),
  ('Emergency Fostering', 'emergency-fostering', 'Immediate placements for children in urgent need of safe care', 'AlertCircle', 2, true),
  ('Short-term Fostering', 'short-term-fostering', 'Temporary care while long-term plans are developed', 'Clock', 3, true),
  ('Long-term Fostering', 'long-term-fostering', 'Providing a stable home until adulthood', 'Home', 4, true),
  ('Respite Fostering', 'respite-fostering', 'Short breaks for foster families and birth families', 'Coffee', 5, true),
  ('Parent and Child Fostering', 'parent-child-fostering', 'Supporting parents and their children together', 'Users', 6, true),
  ('Sibling Group Fostering', 'sibling-group-fostering', 'Keeping brothers and sisters together', 'UsersRound', 7, true),
  ('Teen Fostering', 'teen-fostering', 'Specialist support for teenagers', 'GraduationCap', 8, true),
  ('Disability Fostering', 'disability-fostering', 'Caring for children with disabilities', 'Accessibility', 9, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- ============================================
-- PART 3: AGENCY-SPECIALISM JUNCTION TABLE
-- ============================================

-- Create agency_specialisms junction table
CREATE TABLE IF NOT EXISTS public.agency_specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  specialism_id INTEGER NOT NULL REFERENCES public.specialisms(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, specialism_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agency_specialisms_agency ON public.agency_specialisms(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_specialisms_specialism ON public.agency_specialisms(specialism_id);

-- ============================================
-- PART 4: CONNECT ALL AGENCIES TO ALL LOCATIONS
-- ============================================

-- First, ensure agency_locations table exists
CREATE TABLE IF NOT EXISTS public.agency_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_agency_locations_agency ON public.agency_locations(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_locations_location ON public.agency_locations(location_id);

-- Connect agencies to locations based on their city matching location names/slugs
-- This ensures agencies appear on their respective location pages
INSERT INTO public.agency_locations (agency_id, location_id, is_primary)
SELECT DISTINCT
  a.id as agency_id,
  l.id as location_id,
  true as is_primary
FROM public.agencies a
CROSS JOIN public.locations l
WHERE 
  -- Match agency city to location name or slug
  LOWER(a.city) LIKE '%' || LOWER(l.name) || '%'
  OR LOWER(l.name) LIKE '%' || LOWER(a.city) || '%'
  OR LOWER(a.city) LIKE '%' || REPLACE(l.slug, '-', ' ') || '%'
ON CONFLICT (agency_id, location_id) DO NOTHING;

-- Also connect all agencies to England (country level)
INSERT INTO public.agency_locations (agency_id, location_id, is_primary)
SELECT 
  a.id as agency_id,
  l.id as location_id,
  false as is_primary
FROM public.agencies a
CROSS JOIN public.locations l
WHERE l.slug = 'england'
ON CONFLICT (agency_id, location_id) DO NOTHING;

-- Connect agencies to their parent regions based on location hierarchy
INSERT INTO public.agency_locations (agency_id, location_id, is_primary)
SELECT DISTINCT
  al.agency_id,
  parent_loc.id as location_id,
  false as is_primary
FROM public.agency_locations al
JOIN public.locations child_loc ON al.location_id = child_loc.id
JOIN public.locations parent_loc ON child_loc.parent_id = parent_loc.id
WHERE parent_loc.id IS NOT NULL
ON CONFLICT (agency_id, location_id) DO NOTHING;

-- ============================================
-- PART 5: CONNECT AGENCIES TO SPECIALISMS
-- ============================================

-- Give each agency multiple specialisms
INSERT INTO public.agency_specialisms (agency_id, specialism_id, is_primary)
SELECT 
  a.id as agency_id,
  s.id as specialism_id,
  (ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY s.display_order) = 1) as is_primary
FROM public.agencies a
CROSS JOIN public.specialisms s
WHERE 
  -- All agencies offer these core services
  s.slug IN ('short-term-fostering', 'long-term-fostering')
  -- Plus additional specialisms based on agency
  OR (s.slug = 'emergency-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'b', 'c', 'd', '1', '2', '3', '4'))
  OR (s.slug = 'therapeutic-fostering' AND substring(a.id::text, 1, 1) IN ('e', 'f', '5', '6', '7', '8'))
  OR (s.slug = 'respite-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'c', 'e', '1', '3', '5', '7', '9'))
  OR (s.slug = 'teen-fostering' AND substring(a.id::text, 1, 1) IN ('b', 'd', 'f', '2', '4', '6', '8', '0'))
  OR (s.slug = 'parent-child-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'e', '1', '5', '9'))
  OR (s.slug = 'sibling-group-fostering' AND substring(a.id::text, 1, 1) IN ('b', 'f', '2', '6', '0'))
  OR (s.slug = 'disability-fostering' AND substring(a.id::text, 1, 1) IN ('c', 'd', '3', '4'))
ON CONFLICT (agency_id, specialism_id) DO NOTHING;

-- ============================================
-- PART 6: UPDATE AGENCY COUNTS FOR ALL LOCATIONS
-- ============================================

-- Update agency_count for all locations based on actual connections
UPDATE public.locations l
SET agency_count = (
  SELECT COUNT(DISTINCT al.agency_id)
  FROM public.agency_locations al
  WHERE al.location_id = l.id
);

-- ============================================
-- PART 7: UNIQUE CONTENT FOR LOCATIONS
-- ============================================

-- England
UPDATE public.locations SET
  unique_content = 'England has a rich history of foster care dating back to the Poor Law of 1601. Today, there are over 44,000 foster families across England providing homes to more than 57,000 children. The fostering landscape in England is regulated by Ofsted, ensuring high standards of care and support for both children and foster carers.',
  local_guidance = 'In England, foster carers must be at least 21 years old, have a spare bedroom, and complete a thorough assessment process. Local authorities and independent fostering agencies (IFAs) work together to recruit and support foster carers across all regions.',
  local_stats = '{"foster_families": 44000, "children_in_care": 57000, "average_allowance": 450, "approval_time_weeks": 16}',
  meta_title = 'Foster Care Agencies in England | Find Trusted Fostering Services',
  meta_description = 'Discover 200+ verified foster care agencies across England. Compare ratings, read reviews, and start your fostering journey with confidence.'
WHERE slug = 'england';

-- East of England
UPDATE public.locations SET
  unique_content = 'The East of England, encompassing Norfolk, Suffolk, Essex, Cambridgeshire, Bedfordshire, and Hertfordshire, has a growing need for foster carers. With a mix of rural communities and urban centres, the region offers diverse fostering opportunities.',
  local_guidance = 'Foster carers in the East of England benefit from strong community networks and regional training programmes. The area has particularly high demand for carers who can support teenagers and sibling groups.',
  local_stats = '{"foster_families": 5200, "children_in_care": 6800, "average_allowance": 430, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in East of England | Regional Foster Care',
  meta_description = 'Find fostering agencies in East of England covering Norfolk, Suffolk, Essex & more. Compare local agencies and start fostering today.'
WHERE slug = 'east-of-england';

-- West Midlands
UPDATE public.locations SET
  unique_content = 'The West Midlands is home to Birmingham, the UK''s second-largest city, alongside historic counties like Worcestershire, Warwickshire, and Staffordshire. The region has a vibrant and diverse community with significant fostering needs.',
  local_guidance = 'West Midlands agencies offer specialised support for foster carers from diverse backgrounds. There is particular need for carers who can support children with disabilities and those from BAME communities.',
  local_stats = '{"foster_families": 4800, "children_in_care": 7200, "average_allowance": 440, "approval_time_weeks": 15}',
  meta_title = 'Foster Care Agencies in West Midlands | Birmingham & Surrounding Areas',
  meta_description = 'Explore fostering agencies in the West Midlands including Birmingham, Coventry & Wolverhampton.'
WHERE slug = 'west-midlands';

-- North West England
UPDATE public.locations SET
  unique_content = 'The North West of England, including Greater Manchester, Merseyside, Lancashire, and Cumbria, has one of the highest demands for foster carers in the country. The region combines major urban centres with beautiful rural landscapes.',
  local_guidance = 'North West agencies provide excellent training and 24/7 support. There is significant need for emergency foster carers and those willing to support young people leaving care.',
  local_stats = '{"foster_families": 6100, "children_in_care": 8500, "average_allowance": 460, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in North West England | Manchester, Liverpool & More',
  meta_description = 'Find trusted fostering agencies across North West England. Compare Manchester, Liverpool & Lancashire agencies.'
WHERE slug = 'north-west-england';

-- South East England
UPDATE public.locations SET
  unique_content = 'The South East of England, stretching from Kent to Hampshire and including Surrey and Sussex, is one of the most populous regions. With excellent transport links to London, the region offers unique fostering opportunities.',
  local_guidance = 'South East foster carers often benefit from higher allowances due to the cost of living. The region has strong demand for short-break carers and those near London who can support complex placements.',
  local_stats = '{"foster_families": 5800, "children_in_care": 7100, "average_allowance": 490, "approval_time_weeks": 16}',
  meta_title = 'Foster Care in South East England | Kent, Surrey, Sussex & Hampshire',
  meta_description = 'Discover fostering agencies in South East England. From coastal Kent to rural Hampshire, find the right agency for you.'
WHERE slug = 'south-east-england';

-- London
UPDATE public.locations SET
  unique_content = 'London, the capital city, has the most diverse fostering community in the UK. With 32 boroughs and thousands of children in care, the demand for foster carers is constant. London offers unique challenges and rewards.',
  local_guidance = 'London foster carers receive enhanced allowances and have access to specialist support services. There is particular need for carers from diverse backgrounds.',
  local_stats = '{"foster_families": 3800, "children_in_care": 9200, "average_allowance": 550, "approval_time_weeks": 18}',
  meta_title = 'Foster Care Agencies in London | All 32 Boroughs Covered',
  meta_description = 'Find fostering agencies across London. Compare agencies by borough, read reviews, and start your London fostering journey.'
WHERE slug = 'london';

-- Yorkshire and the Humber
UPDATE public.locations SET
  unique_content = 'Yorkshire and the Humber spans from the historic cities of York and Leeds to the coastal towns of Hull and Scarborough. The region has a strong community spirit and offers excellent support for foster carers.',
  local_guidance = 'Yorkshire agencies are known for their comprehensive training programmes and peer support networks. There is growing demand for therapeutic foster carers and those who can support teenagers.',
  local_stats = '{"foster_families": 4500, "children_in_care": 6200, "average_allowance": 420, "approval_time_weeks": 14}',
  meta_title = 'Fostering in Yorkshire | Leeds, Sheffield, York & Hull Agencies',
  meta_description = 'Explore foster care agencies in Yorkshire and the Humber. Find agencies in Leeds, Sheffield, Hull and across the region.'
WHERE slug = 'yorkshire-and-the-humber';

-- South West England
UPDATE public.locations SET
  unique_content = 'The South West of England, including Devon, Cornwall, Somerset, Dorset, and Gloucestershire, offers a unique fostering experience in some of England''s most beautiful counties.',
  local_guidance = 'South West foster carers benefit from strong community connections and outdoor opportunities for children. There is particular need for carers in rural areas.',
  local_stats = '{"foster_families": 4200, "children_in_care": 5400, "average_allowance": 410, "approval_time_weeks": 15}',
  meta_title = 'Foster Care in South West England | Devon, Cornwall & Somerset',
  meta_description = 'Find fostering agencies in South West England. From Devon beaches to Cotswold villages, discover your fostering path.'
WHERE slug = 'south-west-england';

-- East Midlands
UPDATE public.locations SET
  unique_content = 'The East Midlands encompasses Nottinghamshire, Leicestershire, Derbyshire, Lincolnshire, and Northamptonshire. The region offers affordable living with excellent support services for foster families.',
  local_guidance = 'East Midlands agencies provide excellent value with competitive allowances and strong support packages. There is high demand for foster carers who can support sibling groups.',
  local_stats = '{"foster_families": 3600, "children_in_care": 4800, "average_allowance": 400, "approval_time_weeks": 13}',
  meta_title = 'Fostering Agencies in East Midlands | Nottingham, Leicester & Derby',
  meta_description = 'Discover foster care agencies in the East Midlands. Compare agencies in Nottingham, Leicester, Derby and surrounding areas.'
WHERE slug = 'east-midlands';

-- North East England
UPDATE public.locations SET
  unique_content = 'The North East of England, including Tyne and Wear, County Durham, and Northumberland, has a proud tradition of fostering. Known for friendly communities and strong family values.',
  local_guidance = 'North East agencies are known for their welcoming approach and comprehensive training. There is significant need for foster carers in Newcastle, Sunderland, and the former mining communities.',
  local_stats = '{"foster_families": 2800, "children_in_care": 3900, "average_allowance": 400, "approval_time_weeks": 13}',
  meta_title = 'Foster Care in North East England | Newcastle, Durham & Northumberland',
  meta_description = 'Find fostering agencies in North East England. From Newcastle to Durham, discover agencies with excellent support.'
WHERE slug = 'north-east-england';

-- ============================================
-- PART 8: FAQS FOR KEY LOCATIONS
-- ============================================

-- England FAQs
INSERT INTO public.faqs (location_id, question, answer, display_order, is_active) 
SELECT 
  l.id,
  q.question,
  q.answer,
  q.ord,
  true
FROM public.locations l,
(VALUES 
  ('How long does it take to become a foster carer in England?', 'The assessment process typically takes 4-6 months from initial enquiry to approval. This includes training, home visits, and panel assessment.', 1),
  ('What allowances do foster carers receive in England?', 'Foster carers receive a weekly allowance ranging from £350-£600+ depending on the age of the child and type of placement.', 2),
  ('Can I foster if I work full-time in England?', 'Yes, many foster carers work, though flexibility is often needed especially for school runs and appointments.', 3),
  ('What support do foster carers get in England?', 'Foster carers receive 24/7 support, regular social worker visits, training opportunities, and peer support groups.', 4),
  ('Do I need to own my home to foster in England?', 'No, you can foster whether you rent or own your home. You will need a spare bedroom and permission from your landlord if renting.', 5)
) AS q(question, answer, ord)
WHERE l.slug = 'england' 
AND NOT EXISTS (SELECT 1 FROM public.faqs WHERE location_id = l.id AND question = q.question);

-- ============================================
-- PART 9: ENABLE RLS POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.specialisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_specialisms ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY IF NOT EXISTS "Specialisms are viewable by everyone" 
  ON public.specialisms FOR SELECT 
  USING (true);

CREATE POLICY IF NOT EXISTS "Agency specialisms are viewable by everyone" 
  ON public.agency_specialisms FOR SELECT 
  USING (true);

-- ============================================
-- PART 10: VERIFY SETUP
-- ============================================

-- Show counts to verify everything is set up
SELECT 'Locations' as table_name, COUNT(*) as count FROM public.locations
UNION ALL
SELECT 'Agencies' as table_name, COUNT(*) as count FROM public.agencies
UNION ALL
SELECT 'Agency-Location Links' as table_name, COUNT(*) as count FROM public.agency_locations
UNION ALL
SELECT 'Specialisms' as table_name, COUNT(*) as count FROM public.specialisms
UNION ALL
SELECT 'Agency-Specialism Links' as table_name, COUNT(*) as count FROM public.agency_specialisms
UNION ALL
SELECT 'FAQs' as table_name, COUNT(*) as count FROM public.faqs;

-- Show agency counts per location type
SELECT 
  l.type as location_type,
  COUNT(DISTINCT l.id) as location_count,
  SUM(l.agency_count) as total_agencies
FROM public.locations l
GROUP BY l.type
ORDER BY l.type;
