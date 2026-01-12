-- ============================================
-- Foster Care UK - Demo Data
-- ============================================
-- Run this script after schema setup to populate demo data

-- ============================================
-- 1. LOCATIONS - Countries
-- ============================================
INSERT INTO public.locations (id, name, slug, type, description, seo_title, seo_description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'England', 'england', 'country', 
     'Find foster care agencies across England, from London to the North East. Browse verified agencies and start your fostering journey today.',
     'Foster Care Agencies in England | Find Verified Agencies',
     'Discover top-rated foster care agencies across England. Compare services, read reviews, and find the perfect agency for your fostering journey.'),
    ('22222222-2222-2222-2222-222222222222', 'Scotland', 'scotland', 'country',
     'Browse foster care agencies throughout Scotland. Find trusted agencies from Glasgow to Edinburgh and the Highlands.',
     'Foster Care Agencies in Scotland | Scottish Fostering Services',
     'Find foster care agencies across Scotland. From Glasgow to Edinburgh, discover agencies that can support your fostering journey.'),
    ('33333333-3333-3333-3333-333333333333', 'Wales', 'wales', 'country',
     'Discover foster care agencies across Wales. Supporting children and families from Cardiff to North Wales.',
     'Foster Care Agencies in Wales | Welsh Fostering Services',
     'Find trusted foster care agencies in Wales. Browse verified agencies and learn about fostering opportunities across Wales.'),
    ('44444444-4444-4444-4444-444444444444', 'Northern Ireland', 'northern-ireland', 'country',
     'Find foster care agencies in Northern Ireland. From Belfast to Derry, discover agencies supporting fostering families.',
     'Foster Care Agencies in Northern Ireland | NI Fostering',
     'Discover foster care agencies across Northern Ireland. Find verified agencies and start your fostering journey today.');

-- ============================================
-- 2. LOCATIONS - England Regions
-- ============================================
INSERT INTO public.locations (id, parent_id, name, slug, type, description, agency_count) VALUES
    ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
     'London', 'london', 'region', 
     'Find foster care agencies in London. The capital has a wide range of fostering services supporting children from all backgrounds.', 78),
    ('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
     'South East', 'south-east', 'region',
     'Discover foster care agencies across the South East of England, including Kent, Surrey, Sussex, and Hampshire.', 62),
    ('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
     'South West', 'south-west', 'region',
     'Browse foster care agencies in the South West, from Bristol to Cornwall, Devon, and Somerset.', 45),
    ('e4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
     'East of England', 'east-of-england', 'region',
     'Find fostering agencies in the East of England, covering Norfolk, Suffolk, Essex, and Cambridgeshire.', 38),
    ('e5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
     'West Midlands', 'west-midlands', 'region',
     'Discover foster care agencies in the West Midlands, including Birmingham, Coventry, and the Black Country.', 48),
    ('e6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111',
     'East Midlands', 'east-midlands', 'region',
     'Browse fostering services across the East Midlands, from Nottingham to Leicester and Derby.', 38),
    ('e7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111',
     'Yorkshire and the Humber', 'yorkshire', 'region',
     'Find foster care agencies in Yorkshire and the Humber, including Leeds, Sheffield, and York.', 42),
    ('e8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111',
     'North West', 'north-west', 'region',
     'Discover fostering agencies across the North West, from Manchester and Liverpool to Cumbria.', 54),
    ('e9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111',
     'North East', 'north-east', 'region',
     'Browse foster care agencies in the North East, including Newcastle, Durham, and Northumberland.', 28);

-- ============================================
-- 3. LOCATIONS - Scotland Regions
-- ============================================
INSERT INTO public.locations (parent_id, name, slug, type, description, agency_count) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Glasgow', 'glasgow', 'region',
     'Find foster care agencies in Glasgow and the surrounding areas.', 25),
    ('22222222-2222-2222-2222-222222222222', 'Edinburgh', 'edinburgh', 'region',
     'Discover fostering agencies in Edinburgh and the Lothians.', 22),
    ('22222222-2222-2222-2222-222222222222', 'Highlands', 'highlands', 'region',
     'Browse foster care agencies serving the Scottish Highlands.', 12),
    ('22222222-2222-2222-2222-222222222222', 'Central Scotland', 'central-scotland', 'region',
     'Find fostering services across Central Scotland, including Stirling and Falkirk.', 26);

-- ============================================
-- 4. LOCATIONS - Wales Regions
-- ============================================
INSERT INTO public.locations (parent_id, name, slug, type, description, agency_count) VALUES
    ('33333333-3333-3333-3333-333333333333', 'South Wales', 'south-wales', 'region',
     'Discover foster care agencies in South Wales, including Cardiff, Swansea, and Newport.', 25),
    ('33333333-3333-3333-3333-333333333333', 'North Wales', 'north-wales', 'region',
     'Find fostering agencies across North Wales, from Wrexham to Anglesey.', 12),
    ('33333333-3333-3333-3333-333333333333', 'Mid Wales', 'mid-wales', 'region',
     'Browse foster care agencies in Mid Wales, including Powys and Ceredigion.', 8);

-- ============================================
-- 5. LOCATIONS - Northern Ireland Regions
-- ============================================
INSERT INTO public.locations (parent_id, name, slug, type, description, agency_count) VALUES
    ('44444444-4444-4444-4444-444444444444', 'Belfast', 'belfast', 'region',
     'Find foster care agencies in Belfast and surrounding areas.', 18),
    ('44444444-4444-4444-4444-444444444444', 'Derry', 'derry', 'region',
     'Discover fostering services in Derry/Londonderry and the North West.', 8),
    ('44444444-4444-4444-4444-444444444444', 'County Down', 'county-down', 'region',
     'Browse foster care agencies in County Down.', 9);

-- ============================================
-- 6. AGENCIES
-- ============================================
INSERT INTO public.agencies (name, slug, description, city, postcode, phone, email, website, rating, review_count, is_verified, is_featured, services, specializations) VALUES
    ('Bright Futures Fostering', 'bright-futures-fostering',
     'Bright Futures Fostering is an award-winning independent fostering agency with over 20 years of experience. We provide comprehensive support to foster carers across London and the South East, ensuring every child in our care receives the love and attention they deserve.',
     'London', 'SW1A 1AA', '0800 123 4567', 'info@brightfuturesfostering.co.uk', 'www.brightfuturesfostering.co.uk',
     4.9, 124, true, true,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Emergency placements", "Sibling groups", "Therapeutic fostering"]'::jsonb,
     '["Complex needs", "Teenagers", "Sibling groups"]'::jsonb),
    
    ('Family First Care', 'family-first-care',
     'Dedicated to matching children with loving foster carers in the North West region. Our experienced team provides 24/7 support and comprehensive training programs.',
     'Manchester', 'M1 1AA', '0800 234 5678', 'hello@familyfirstcare.co.uk', 'www.familyfirstcare.co.uk',
     4.8, 89, true, true,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Parent and child placements"]'::jsonb,
     '["Young children", "Parent and child"]'::jsonb),
    
    ('Compass Fostering Services', 'compass-fostering',
     'One of the UK''s largest independent fostering agencies with comprehensive support services. We have local offices throughout England and Wales.',
     'Birmingham', 'B1 1AA', '0800 345 6789', 'contact@compassfostering.co.uk', 'www.compassfostering.co.uk',
     4.7, 156, true, true,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Emergency placements", "Specialist fostering"]'::jsonb,
     '["SEND children", "Therapeutic care", "Teenagers"]'::jsonb),
    
    ('Foster Care Associates', 'foster-care-associates',
     'Providing high-quality foster placements across Yorkshire and the Humber. Our dedicated support team ensures carers have everything they need.',
     'Leeds', 'LS1 1AA', '0800 456 7890', 'info@fca-fostering.co.uk', 'www.fca-fostering.co.uk',
     4.6, 203, true, false,
     '["Short-term fostering", "Long-term fostering", "Respite care"]'::jsonb,
     '["School-age children", "Teenagers"]'::jsonb),
    
    ('National Fostering Agency', 'national-fostering-agency',
     'The UK''s leading fostering agency with local offices throughout England and Wales. We support over 3,000 foster families across the country.',
     'Nationwide', '', '0800 567 8901', 'enquiries@nfa.co.uk', 'www.nfa.co.uk',
     4.5, 312, true, true,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Emergency placements", "Sibling groups", "Specialist fostering", "Parent and child"]'::jsonb,
     '["All ages", "Complex needs", "UASC"]'::jsonb),
    
    ('Capstone Foster Care', 'capstone-foster-care',
     'A boutique agency focused on providing therapeutic fostering placements. We specialize in supporting children with complex emotional and behavioral needs.',
     'Bristol', 'BS1 1AA', '0800 678 9012', 'info@capstonefostercare.co.uk', 'www.capstonefostercare.co.uk',
     4.8, 67, true, true,
     '["Therapeutic fostering", "Long-term fostering", "Specialist placements"]'::jsonb,
     '["Therapeutic care", "Complex needs", "Trauma-informed care"]'::jsonb),
    
    ('Northern Stars Fostering', 'northern-stars-fostering',
     'Dedicated to supporting foster families across the North East. We believe every child deserves a loving home and a bright future.',
     'Newcastle', 'NE1 1AA', '0800 789 0123', 'hello@northernstars.co.uk', 'www.northernstars.co.uk',
     4.5, 45, true, false,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Emergency placements"]'::jsonb,
     '["Teenagers", "Sibling groups"]'::jsonb),
    
    ('Scottish Family Fostering', 'scottish-family-fostering',
     'Scotland''s leading independent fostering agency, providing support and placements across the country.',
     'Glasgow', 'G1 1AA', '0800 890 1234', 'info@scottishfamilyfostering.co.uk', 'www.scottishfamilyfostering.co.uk',
     4.7, 78, true, true,
     '["Short-term fostering", "Long-term fostering", "Respite care", "Specialist fostering"]'::jsonb,
     '["All ages", "SEND children"]'::jsonb),
    
    ('Valleys Foster Care', 'valleys-foster-care',
     'Supporting foster families across South Wales. We provide comprehensive training and 24/7 support to all our carers.',
     'Cardiff', 'CF1 1AA', '0800 901 2345', 'enquiries@valleysfostercare.co.uk', 'www.valleysfostercare.co.uk',
     4.6, 34, true, false,
     '["Short-term fostering", "Long-term fostering", "Respite care"]'::jsonb,
     '["Young children", "School-age children"]'::jsonb),
    
    ('Belfast Fostering Services', 'belfast-fostering-services',
     'Northern Ireland''s trusted fostering agency. We support children and families throughout Belfast and beyond.',
     'Belfast', 'BT1 1AA', '0800 012 3456', 'info@belfastfostering.co.uk', 'www.belfastfostering.co.uk',
     4.4, 28, true, false,
     '["Short-term fostering", "Long-term fostering", "Respite care"]'::jsonb,
     '["All ages"]'::jsonb);

-- ============================================
-- 7. FAQs - General
-- ============================================
INSERT INTO public.faqs (question, answer, page_key, display_order, is_active) VALUES
    ('What is foster care?', 
     'Foster care is when a child lives with a family who is not their birth family on a temporary or permanent basis. Foster carers provide a safe, nurturing environment while children cannot live with their birth parents.',
     'home', 1, true),
    ('Can I foster if I work?', 
     'Yes, many foster carers work. However, fostering does require flexibility, especially for younger children or those with complex needs. Part-time work or flexible working arrangements are common among foster carers.',
     'home', 2, true),
    ('Do I need to own my own home to foster?', 
     'No, you don''t need to own your own home. You can foster if you rent, but you''ll need a spare room for the child and written permission from your landlord if you rent.',
     'home', 3, true),
    ('Can single people foster?', 
     'Absolutely! Single people make wonderful foster carers. The most important thing is that you can provide a safe, loving, and stable home for a child.',
     'home', 4, true),
    ('How long does the fostering assessment take?', 
     'The assessment process typically takes 4-6 months. It includes training, home visits, background checks, and interviews with references. This thorough process ensures children are placed with suitable carers.',
     'home', 5, true),
    ('Do foster carers get paid?', 
     'Yes, foster carers receive a fostering allowance to cover the cost of caring for a child, plus a fee for their skills and time. The amount varies depending on the agency and the needs of the child.',
     'home', 6, true);

-- ============================================
-- 8. FAQs - Location Specific (England)
-- ============================================
INSERT INTO public.faqs (question, answer, location_id, display_order, is_active) VALUES
    ('How many children are in foster care in England?', 
     'There are approximately 83,000 children in care in England, with around 56,000 living with foster families. There is always a need for more foster carers, particularly for teenagers, sibling groups, and children with additional needs.',
     '11111111-1111-1111-1111-111111111111', 1, true),
    ('Who regulates fostering agencies in England?', 
     'Fostering agencies in England are regulated by Ofsted (Office for Standards in Education, Children''s Services and Skills). They inspect all agencies and publish reports on their quality and performance.',
     '11111111-1111-1111-1111-111111111111', 2, true),
    ('What support do foster carers receive in England?', 
     'Foster carers receive 24/7 support from their supervising social worker, access to training programs, regular support groups, and respite care when needed. Many agencies also provide therapeutic support services.',
     '11111111-1111-1111-1111-111111111111', 3, true);

-- ============================================
-- 9. CMS CONTENT
-- ============================================
INSERT INTO public.cms_content (page_key, section_key, title, subtitle, content, display_order, is_active) VALUES
    ('home', 'hero', 'Find Your Perfect Fostering Agency', 
     'Supporting Your Fostering Journey',
     'Connect with verified foster care agencies across the UK. We help you find the right agency to support your fostering journey.',
     1, true),
    ('home', 'about', 'About Foster Care UK', 
     'Your Trusted Guide to Fostering',
     'We are the UK''s leading directory of foster care agencies. Our mission is to connect potential foster carers with trusted, verified agencies that can support them throughout their fostering journey.',
     2, true),
    ('home', 'cta', 'Ready to Make a Difference?', 
     'Start Your Journey Today',
     'Every child deserves a loving home. Take the first step towards becoming a foster carer today.',
     3, true),
    ('about', 'mission', 'Our Mission', 
     'Connecting Carers with Agencies',
     'We believe that finding the right fostering agency is crucial to a successful fostering journey. Our platform makes it easy to compare agencies, read reviews, and make informed decisions.',
     1, true);

-- ============================================
-- 10. LEGAL PAGES
-- ============================================
INSERT INTO public.legal_pages (title, slug, content, seo_title, seo_description, is_active) VALUES
    ('Privacy Policy', 'privacy-policy',
     '<h2>Introduction</h2><p>This privacy policy explains how Foster Care UK collects, uses, and protects your personal information.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, submit an enquiry, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users.</p><h2>Contact Us</h2><p>If you have any questions about this privacy policy, please contact us at privacy@fostercare.uk.</p>',
     'Privacy Policy | Foster Care UK',
     'Read our privacy policy to understand how we collect, use, and protect your personal information.',
     true),
    ('Terms of Service', 'terms-of-service',
     '<h2>Agreement to Terms</h2><p>By accessing or using Foster Care UK, you agree to be bound by these Terms of Service.</p><h2>Use of Service</h2><p>You may use our service only for lawful purposes and in accordance with these Terms.</p><h2>User Accounts</h2><p>You are responsible for maintaining the confidentiality of your account and password.</p><h2>Contact</h2><p>If you have questions about these terms, please contact us at legal@fostercare.uk.</p>',
     'Terms of Service | Foster Care UK',
     'Read our terms of service to understand the rules and regulations governing your use of Foster Care UK.',
     true),
    ('Cookie Policy', 'cookie-policy',
     '<h2>What Are Cookies?</h2><p>Cookies are small text files that are stored on your device when you visit a website.</p><h2>How We Use Cookies</h2><p>We use cookies to improve your experience on our website, analyze site traffic, and understand where our visitors come from.</p><h2>Managing Cookies</h2><p>You can control and manage cookies in your browser settings.</p>',
     'Cookie Policy | Foster Care UK',
     'Learn about how we use cookies on Foster Care UK and how you can manage your cookie preferences.',
     true);

-- ============================================
-- 11. UPDATE ENGLAND AGENCY COUNT
-- ============================================
UPDATE public.locations 
SET agency_count = (
    SELECT COALESCE(SUM(agency_count), 0) 
    FROM public.locations 
    WHERE parent_id = '11111111-1111-1111-1111-111111111111'
)
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.locations 
SET agency_count = (
    SELECT COALESCE(SUM(agency_count), 0) 
    FROM public.locations 
    WHERE parent_id = '22222222-2222-2222-2222-222222222222'
)
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE public.locations 
SET agency_count = (
    SELECT COALESCE(SUM(agency_count), 0) 
    FROM public.locations 
    WHERE parent_id = '33333333-3333-3333-3333-333333333333'
)
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE public.locations 
SET agency_count = (
    SELECT COALESCE(SUM(agency_count), 0) 
    FROM public.locations 
    WHERE parent_id = '44444444-4444-4444-4444-444444444444'
)
WHERE id = '44444444-4444-4444-4444-444444444444';
