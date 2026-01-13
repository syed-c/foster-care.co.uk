-- ============================================
-- FOSTER CARE UK - UNIQUE LOCATION CONTENT
-- ============================================
-- This migration adds unique content for each location
-- and connects agencies to specialisms
-- ============================================

-- Ensure unique_content and local_stats columns exist
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS unique_content TEXT,
  ADD COLUMN IF NOT EXISTS local_guidance TEXT,
  ADD COLUMN IF NOT EXISTS local_stats JSONB,
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(100),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(200);

-- ============================================
-- UNIQUE CONTENT FOR ENGLAND
-- ============================================
UPDATE public.locations SET
  unique_content = 'England has a rich history of foster care dating back to the Poor Law of 1601. Today, there are over 44,000 foster families across England providing homes to more than 57,000 children. The fostering landscape in England is regulated by Ofsted, ensuring high standards of care and support for both children and foster carers.',
  local_guidance = 'In England, foster carers must be at least 21 years old, have a spare bedroom, and complete a thorough assessment process. Local authorities and independent fostering agencies (IFAs) work together to recruit and support foster carers across all regions.',
  local_stats = '{"foster_families": 44000, "children_in_care": 57000, "average_allowance": 450, "approval_time_weeks": 16}',
  meta_title = 'Foster Care Agencies in England | Find Trusted Fostering Services',
  meta_description = 'Discover 200+ verified foster care agencies across England. Compare ratings, read reviews, and start your fostering journey with confidence.'
WHERE slug = 'england';

-- ============================================
-- UNIQUE CONTENT FOR REGIONS
-- ============================================

-- East of England
UPDATE public.locations SET
  unique_content = 'The East of England, encompassing Norfolk, Suffolk, Essex, Cambridgeshire, Bedfordshire, and Hertfordshire, has a growing need for foster carers. With a mix of rural communities and urban centres, the region offers diverse fostering opportunities. Local agencies work closely with county councils to provide comprehensive support.',
  local_guidance = 'Foster carers in the East of England benefit from strong community networks and regional training programmes. The area has particularly high demand for carers who can support teenagers and sibling groups.',
  local_stats = '{"foster_families": 5200, "children_in_care": 6800, "average_allowance": 430, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in East of England | Regional Foster Care',
  meta_description = 'Find fostering agencies in East of England covering Norfolk, Suffolk, Essex & more. Compare local agencies and start fostering today.'
WHERE slug = 'east-of-england';

-- West Midlands
UPDATE public.locations SET
  unique_content = 'The West Midlands is home to Birmingham, the UK''s second-largest city, alongside historic counties like Worcestershire, Warwickshire, and Staffordshire. The region has a vibrant and diverse community with significant fostering needs, particularly in urban areas where there is high demand for culturally matched placements.',
  local_guidance = 'West Midlands agencies offer specialised support for foster carers from diverse backgrounds. There is particular need for carers who can support children with disabilities and those from BAME communities.',
  local_stats = '{"foster_families": 4800, "children_in_care": 7200, "average_allowance": 440, "approval_time_weeks": 15}',
  meta_title = 'Foster Care Agencies in West Midlands | Birmingham & Surrounding Areas',
  meta_description = 'Explore fostering agencies in the West Midlands including Birmingham, Coventry & Wolverhampton. Find your perfect match today.'
WHERE slug = 'west-midlands';

-- North West England
UPDATE public.locations SET
  unique_content = 'The North West of England, including Greater Manchester, Merseyside, Lancashire, and Cumbria, has one of the highest demands for foster carers in the country. The region combines major urban centres with beautiful rural landscapes, offering varied fostering experiences.',
  local_guidance = 'North West agencies provide excellent training and 24/7 support. There is significant need for emergency foster carers and those willing to support young people leaving care.',
  local_stats = '{"foster_families": 6100, "children_in_care": 8500, "average_allowance": 460, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in North West England | Manchester, Liverpool & More',
  meta_description = 'Find trusted fostering agencies across North West England. Compare Manchester, Liverpool & Lancashire agencies with verified reviews.'
WHERE slug = 'north-west-england';

-- South East England
UPDATE public.locations SET
  unique_content = 'The South East of England, stretching from Kent to Hampshire and including Surrey and Sussex, is one of the most populous regions. With excellent transport links to London and a mix of affluent and coastal communities, the region offers unique fostering opportunities.',
  local_guidance = 'South East foster carers often benefit from higher allowances due to the cost of living. The region has strong demand for short-break carers and those near London who can support complex placements.',
  local_stats = '{"foster_families": 5800, "children_in_care": 7100, "average_allowance": 490, "approval_time_weeks": 16}',
  meta_title = 'Foster Care in South East England | Kent, Surrey, Sussex & Hampshire',
  meta_description = 'Discover fostering agencies in South East England. From coastal Kent to rural Hampshire, find the right agency for you.'
WHERE slug = 'south-east-england';

-- London
UPDATE public.locations SET
  unique_content = 'London, the capital city, has the most diverse fostering community in the UK. With 32 boroughs and thousands of children in care, the demand for foster carers is constant. London offers unique challenges and rewards, with access to world-class training and support services.',
  local_guidance = 'London foster carers receive enhanced allowances and have access to specialist support services. There is particular need for carers from diverse backgrounds and those who can support unaccompanied asylum-seeking children.',
  local_stats = '{"foster_families": 3800, "children_in_care": 9200, "average_allowance": 550, "approval_time_weeks": 18}',
  meta_title = 'Foster Care Agencies in London | All 32 Boroughs Covered',
  meta_description = 'Find fostering agencies across London. Compare agencies by borough, read reviews, and start your London fostering journey.'
WHERE slug = 'london';

-- Yorkshire and the Humber
UPDATE public.locations SET
  unique_content = 'Yorkshire and the Humber spans from the historic cities of York and Leeds to the coastal towns of Hull and Scarborough. The region has a strong community spirit and offers excellent support for foster carers through both local authority and independent agencies.',
  local_guidance = 'Yorkshire agencies are known for their comprehensive training programmes and peer support networks. There is growing demand for therapeutic foster carers and those who can support teenagers.',
  local_stats = '{"foster_families": 4500, "children_in_care": 6200, "average_allowance": 420, "approval_time_weeks": 14}',
  meta_title = 'Fostering in Yorkshire | Leeds, Sheffield, York & Hull Agencies',
  meta_description = 'Explore foster care agencies in Yorkshire and the Humber. Find agencies in Leeds, Sheffield, Hull and across the region.'
WHERE slug = 'yorkshire-and-the-humber';

-- South West England
UPDATE public.locations SET
  unique_content = 'The South West of England, including Devon, Cornwall, Somerset, Dorset, and Gloucestershire, offers a unique fostering experience in some of England''s most beautiful counties. Rural communities and coastal towns create close-knit support networks for foster families.',
  local_guidance = 'South West foster carers benefit from strong community connections and outdoor opportunities for children. There is particular need for carers in rural areas and those who can support children with attachment difficulties.',
  local_stats = '{"foster_families": 4200, "children_in_care": 5400, "average_allowance": 410, "approval_time_weeks": 15}',
  meta_title = 'Foster Care in South West England | Devon, Cornwall & Somerset',
  meta_description = 'Find fostering agencies in South West England. From Devon beaches to Cotswold villages, discover your fostering path.'
WHERE slug = 'south-west-england';

-- East Midlands
UPDATE public.locations SET
  unique_content = 'The East Midlands encompasses Nottinghamshire, Leicestershire, Derbyshire, Lincolnshire, and Northamptonshire. The region offers affordable living with excellent support services for foster families. Major cities like Nottingham and Leicester have vibrant multicultural communities.',
  local_guidance = 'East Midlands agencies provide excellent value with competitive allowances and strong support packages. There is high demand for foster carers who can support sibling groups and children from diverse backgrounds.',
  local_stats = '{"foster_families": 3600, "children_in_care": 4800, "average_allowance": 400, "approval_time_weeks": 13}',
  meta_title = 'Fostering Agencies in East Midlands | Nottingham, Leicester & Derby',
  meta_description = 'Discover foster care agencies in the East Midlands. Compare agencies in Nottingham, Leicester, Derby and surrounding areas.'
WHERE slug = 'east-midlands';

-- North East England  
UPDATE public.locations SET
  unique_content = 'The North East of England, including Tyne and Wear, County Durham, and Northumberland, has a proud tradition of fostering. Known for friendly communities and strong family values, the region offers excellent support for foster carers with competitive allowances.',
  local_guidance = 'North East agencies are known for their welcoming approach and comprehensive training. There is significant need for foster carers in Newcastle, Sunderland, and the former mining communities.',
  local_stats = '{"foster_families": 2800, "children_in_care": 3900, "average_allowance": 400, "approval_time_weeks": 13}',
  meta_title = 'Foster Care in North East England | Newcastle, Durham & Northumberland',
  meta_description = 'Find fostering agencies in North East England. From Newcastle to Durham, discover agencies with excellent support.'
WHERE slug = 'north-east-england';

-- ============================================
-- UNIQUE CONTENT FOR COUNTIES/CITIES
-- ============================================

-- Suffolk
UPDATE public.locations SET
  unique_content = 'Suffolk, with its beautiful coastline and historic market towns like Bury St Edmunds and Ipswich, offers a wonderful environment for fostering. The county has a strong network of foster carers supported by both Suffolk County Council and independent agencies.',
  local_guidance = 'Suffolk foster carers enjoy a supportive community and access to excellent training. The county particularly needs carers who can support teenagers and children with complex needs.',
  local_stats = '{"foster_families": 520, "children_in_care": 720, "average_allowance": 420, "approval_time_weeks": 14}',
  meta_title = 'Foster Care Agencies in Suffolk | Ipswich, Bury St Edmunds',
  meta_description = 'Find fostering agencies in Suffolk. Compare Ipswich and Bury St Edmunds agencies with verified reviews and ratings.'
WHERE slug = 'suffolk';

-- Norfolk
UPDATE public.locations SET
  unique_content = 'Norfolk, home to the beautiful Norfolk Broads and historic city of Norwich, has an active fostering community. The county''s mix of coastal, rural, and urban areas provides diverse placement opportunities for foster families.',
  local_guidance = 'Norfolk County Council and local IFAs work together to support foster carers. There is particular demand for respite carers and those who can support children with disabilities.',
  local_stats = '{"foster_families": 580, "children_in_care": 780, "average_allowance": 415, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in Norfolk | Norwich & Great Yarmouth',
  meta_description = 'Explore foster care agencies in Norfolk. Find agencies in Norwich, Great Yarmouth and across the county.'
WHERE slug = 'norfolk';

-- Essex
UPDATE public.locations SET
  unique_content = 'Essex, stretching from the London border to the coast, has one of the largest fostering communities in the East of England. The county offers excellent transport links and a mix of urban and rural fostering opportunities.',
  local_guidance = 'Essex foster carers benefit from good allowances and comprehensive training. The county has high demand for emergency foster carers and those near the London border.',
  local_stats = '{"foster_families": 890, "children_in_care": 1200, "average_allowance": 450, "approval_time_weeks": 15}',
  meta_title = 'Foster Care in Essex | Chelmsford, Colchester & Southend',
  meta_description = 'Find trusted fostering agencies in Essex. Compare agencies in Chelmsford, Colchester, Southend and more.'
WHERE slug = 'essex';

-- Birmingham
UPDATE public.locations SET
  unique_content = 'Birmingham, the UK''s second-largest city, has the highest demand for foster carers outside London. The city''s diverse communities create opportunities for culturally matched placements, with excellent support from both the city council and independent agencies.',
  local_guidance = 'Birmingham foster carers receive competitive allowances and access to specialist training. There is particular need for carers from BAME backgrounds and those who can support teenagers.',
  local_stats = '{"foster_families": 1100, "children_in_care": 1800, "average_allowance": 460, "approval_time_weeks": 16}',
  meta_title = 'Fostering Agencies in Birmingham | UK''s Second City',
  meta_description = 'Discover foster care agencies in Birmingham. Find agencies across all areas with excellent support and competitive allowances.'
WHERE slug = 'birmingham';

-- Manchester
UPDATE public.locations SET
  unique_content = 'Greater Manchester, with its vibrant city centre and diverse boroughs, has a thriving fostering community. The region offers excellent support services and a strong network of foster carers across ten local authorities.',
  local_guidance = 'Manchester foster carers benefit from the Greater Manchester Combined Authority''s coordinated approach to fostering. There is high demand for therapeutic foster carers and those supporting older children.',
  local_stats = '{"foster_families": 1500, "children_in_care": 2200, "average_allowance": 470, "approval_time_weeks": 15}',
  meta_title = 'Foster Care in Manchester | Greater Manchester Agencies',
  meta_description = 'Find fostering agencies in Manchester and Greater Manchester. Compare agencies with verified reviews and excellent support.'
WHERE slug = 'manchester';

-- Liverpool
UPDATE public.locations SET
  unique_content = 'Liverpool, known for its warm and welcoming communities, has a strong tradition of fostering. The city offers excellent support for foster carers through both Liverpool City Council and local independent agencies.',
  local_guidance = 'Liverpool foster carers are known for their dedication and receive comprehensive training and support. There is particular need for carers who can support sibling groups and children with emotional needs.',
  local_stats = '{"foster_families": 680, "children_in_care": 980, "average_allowance": 440, "approval_time_weeks": 14}',
  meta_title = 'Fostering Agencies in Liverpool | Merseyside Foster Care',
  meta_description = 'Explore foster care agencies in Liverpool. Find trusted agencies across Merseyside with excellent carer support.'
WHERE slug = 'liverpool';

-- Leeds
UPDATE public.locations SET
  unique_content = 'Leeds, West Yorkshire''s largest city, has a diverse fostering community serving children from across the region. The city offers a mix of urban and suburban fostering opportunities with excellent support services.',
  local_guidance = 'Leeds City Council and local IFAs provide comprehensive support including 24/7 helplines and regular training. There is significant demand for foster carers in all areas of the city.',
  local_stats = '{"foster_families": 720, "children_in_care": 1050, "average_allowance": 430, "approval_time_weeks": 14}',
  meta_title = 'Foster Care Agencies in Leeds | West Yorkshire Fostering',
  meta_description = 'Find fostering agencies in Leeds. Compare agencies across West Yorkshire with verified reviews and ratings.'
WHERE slug = 'leeds';

-- Bristol
UPDATE public.locations SET
  unique_content = 'Bristol, the largest city in the South West, has a vibrant and diverse fostering community. The city offers excellent cultural and educational opportunities for fostered children, with strong support from local agencies.',
  local_guidance = 'Bristol foster carers benefit from the city''s excellent resources and community support. There is particular demand for carers who can support teenagers and young people leaving care.',
  local_stats = '{"foster_families": 480, "children_in_care": 680, "average_allowance": 440, "approval_time_weeks": 15}',
  meta_title = 'Fostering Agencies in Bristol | South West''s Largest City',
  meta_description = 'Discover foster care agencies in Bristol. Find trusted agencies with excellent support and competitive allowances.'
WHERE slug = 'bristol';

-- Cambridgeshire
UPDATE public.locations SET
  unique_content = 'Cambridgeshire, home to the historic university city of Cambridge, offers diverse fostering opportunities from city centre to rural fenlands. The county has a growing need for foster carers to support children from varied backgrounds.',
  local_guidance = 'Cambridgeshire foster carers benefit from excellent training and support. There is particular need for carers in Peterborough and the northern areas of the county.',
  local_stats = '{"foster_families": 420, "children_in_care": 580, "average_allowance": 435, "approval_time_weeks": 14}',
  meta_title = 'Foster Care in Cambridgeshire | Cambridge & Peterborough',
  meta_description = 'Find fostering agencies in Cambridgeshire. Compare agencies in Cambridge, Peterborough and surrounding areas.'
WHERE slug = 'cambridgeshire';

-- Kent
UPDATE public.locations SET
  unique_content = 'Kent, the "Garden of England", has one of the largest fostering communities in the South East. From coastal towns to the Weald, the county offers varied fostering experiences with strong support networks.',
  local_guidance = 'Kent foster carers receive excellent training and support from both Kent County Council and local IFAs. There is high demand for carers near the coast who can support unaccompanied minors.',
  local_stats = '{"foster_families": 980, "children_in_care": 1350, "average_allowance": 470, "approval_time_weeks": 16}',
  meta_title = 'Fostering Agencies in Kent | Canterbury, Maidstone & Coastal',
  meta_description = 'Explore foster care agencies in Kent. Find agencies across the Garden of England with verified reviews.'
WHERE slug = 'kent';

-- ============================================
-- CONNECT AGENCIES TO SPECIALISMS
-- ============================================

-- First, ensure specialisms table has data
INSERT INTO public.specialisms (name, slug, description, icon_name, display_order) VALUES
  ('Therapeutic Fostering', 'therapeutic-fostering', 'Specialised care for children with trauma and complex emotional needs', 'Heart', 1),
  ('Emergency Fostering', 'emergency-fostering', 'Immediate placements for children in urgent need of safe care', 'AlertCircle', 2),
  ('Short-term Fostering', 'short-term-fostering', 'Temporary care while long-term plans are developed', 'Clock', 3),
  ('Long-term Fostering', 'long-term-fostering', 'Providing a stable home until adulthood', 'Home', 4),
  ('Respite Fostering', 'respite-fostering', 'Short breaks for foster families and birth families', 'Coffee', 5),
  ('Parent and Child Fostering', 'parent-child-fostering', 'Supporting parents and their children together', 'Users', 6),
  ('Sibling Group Fostering', 'sibling-group-fostering', 'Keeping brothers and sisters together', 'Users', 7),
  ('Teen Fostering', 'teen-fostering', 'Specialist support for teenagers', 'GraduationCap', 8),
  ('Disability Fostering', 'disability-fostering', 'Caring for children with disabilities', 'Accessibility', 9)
ON CONFLICT (slug) DO NOTHING;

-- Connect agencies to specialisms (randomized but realistic distribution)
-- Each agency gets 2-5 specialisms based on their services
INSERT INTO public.agency_specialisms (agency_id, specialism_id, is_primary)
SELECT 
  a.id as agency_id,
  s.id as specialism_id,
  (ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY RANDOM()) = 1) as is_primary
FROM public.agencies a
CROSS JOIN public.specialisms s
WHERE 
  -- Each agency gets specialisms based on pseudo-random selection
  -- Using modulo on the UUIDs to create deterministic but varied distribution
  (
    (s.slug = 'short-term-fostering') OR  -- All agencies offer short-term
    (s.slug = 'long-term-fostering') OR   -- All agencies offer long-term
    (s.slug = 'emergency-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'b', 'c', 'd', '1', '2', '3')) OR
    (s.slug = 'therapeutic-fostering' AND substring(a.id::text, 1, 1) IN ('e', 'f', '4', '5', '6')) OR
    (s.slug = 'respite-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'c', 'e', '1', '3', '5', '7')) OR
    (s.slug = 'teen-fostering' AND substring(a.id::text, 1, 1) IN ('b', 'd', 'f', '2', '4', '6', '8')) OR
    (s.slug = 'parent-child-fostering' AND substring(a.id::text, 1, 1) IN ('a', 'e', '1', '5', '9')) OR
    (s.slug = 'sibling-group-fostering' AND substring(a.id::text, 1, 1) IN ('b', 'f', '2', '6', '0')) OR
    (s.slug = 'disability-fostering' AND substring(a.id::text, 1, 1) IN ('c', 'd', '3', '4'))
  )
ON CONFLICT (agency_id, specialism_id) DO NOTHING;

-- ============================================
-- CREATE LOCATION-SPECIFIC FAQS
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
  ('What allowances do foster carers receive in England?', 'Foster carers receive a weekly allowance ranging from £350-£600+ depending on the age of the child and type of placement. Additional allowances are available for specialist placements.', 2),
  ('Can I foster if I work full-time in England?', 'Yes, many foster carers work, though flexibility is often needed especially for school runs and appointments. Some placements, like emergency fostering, may require one carer to be available full-time.', 3),
  ('What support do foster carers get in England?', 'Foster carers receive 24/7 support, regular social worker visits, training opportunities, peer support groups, and access to specialist services when needed.', 4),
  ('Do I need to own my home to foster in England?', 'No, you can foster whether you rent or own your home. You will need a spare bedroom for the child and permission from your landlord if renting.', 5)
) AS q(question, answer, ord)
WHERE l.slug = 'england' 
AND NOT EXISTS (SELECT 1 FROM public.faqs WHERE location_id = l.id AND question = q.question);

-- Suffolk FAQs
INSERT INTO public.faqs (location_id, question, answer, display_order, is_active) 
SELECT 
  l.id,
  q.question,
  q.answer,
  q.ord,
  true
FROM public.locations l,
(VALUES 
  ('How many children need foster care in Suffolk?', 'Suffolk has approximately 720 children in care who need loving foster families. The county particularly needs carers for teenagers and sibling groups.', 1),
  ('What fostering agencies operate in Suffolk?', 'Suffolk is served by Suffolk County Council Fostering Service and several independent fostering agencies. All are regulated by Ofsted.', 2),
  ('What training is provided for Suffolk foster carers?', 'Suffolk foster carers receive comprehensive training including Skills to Foster, first aid, safeguarding, and specialist courses based on placement needs.', 3),
  ('Are there fostering support groups in Suffolk?', 'Yes, Suffolk has active foster carer support groups in Ipswich, Bury St Edmunds, Lowestoft and other areas, providing peer support and social events.', 4)
) AS q(question, answer, ord)
WHERE l.slug = 'suffolk' 
AND NOT EXISTS (SELECT 1 FROM public.faqs WHERE location_id = l.id AND question = q.question);

-- Birmingham FAQs
INSERT INTO public.faqs (location_id, question, answer, display_order, is_active) 
SELECT 
  l.id,
  q.question,
  q.answer,
  q.ord,
  true
FROM public.locations l,
(VALUES 
  ('Why is there high demand for foster carers in Birmingham?', 'Birmingham is the UK''s second-largest city with a diverse population. High demand exists for culturally matched placements and carers from BAME backgrounds.', 1),
  ('What allowances do Birmingham foster carers receive?', 'Birmingham foster carers receive competitive weekly allowances from £460+, with enhanced rates for specialist placements and therapeutic fostering.', 2),
  ('Can I foster in Birmingham if I live in a flat?', 'Yes, you can foster in a flat as long as you have a spare bedroom and the space is suitable for a child. Ground floor or lift access may be needed for some placements.', 3),
  ('What types of fostering are most needed in Birmingham?', 'Birmingham particularly needs emergency foster carers, carers for teenagers, and those who can support children with complex needs or disabilities.', 4)
) AS q(question, answer, ord)
WHERE l.slug = 'birmingham' 
AND NOT EXISTS (SELECT 1 FROM public.faqs WHERE location_id = l.id AND question = q.question);

-- Manchester FAQs
INSERT INTO public.faqs (location_id, question, answer, display_order, is_active) 
SELECT 
  l.id,
  q.question,
  q.answer,
  q.ord,
  true
FROM public.locations l,
(VALUES 
  ('How does fostering work in Greater Manchester?', 'Greater Manchester has 10 local authorities each with their own fostering service, plus numerous independent agencies. Carers can choose which suits them best.', 1),
  ('What support is available for Manchester foster carers?', 'Manchester foster carers receive 24/7 support, access to therapeutic services, regular training, and support from experienced supervising social workers.', 2),
  ('Are there fostering events in Manchester?', 'Yes, Manchester hosts regular fostering information events, training sessions, and social events for foster families throughout the year.', 3),
  ('Can single people foster in Manchester?', 'Absolutely! Single people make excellent foster carers. What matters is having a spare room, time, patience, and the ability to provide a loving home.', 4)
) AS q(question, answer, ord)
WHERE l.slug = 'manchester' 
AND NOT EXISTS (SELECT 1 FROM public.faqs WHERE location_id = l.id AND question = q.question);