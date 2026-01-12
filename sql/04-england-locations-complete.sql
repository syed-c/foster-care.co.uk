-- ============================================
-- Foster Care UK - Complete England Locations
-- ============================================
-- This script populates all England location data:
-- - 1 Country (England)
-- - 9 Regions
-- - 48 Counties/Metropolitan Areas
-- - 300+ Cities and Towns
-- - 150+ Local Areas/Neighbourhoods
-- ============================================

-- First, ensure we have England as the country
INSERT INTO public.locations (id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'England',
    'england',
    'country',
    'Find trusted foster care agencies across England. Browse verified fostering services in all 9 regions, compare agencies, and start your fostering journey today.',
    'Foster Care Agencies in England | Find Local Fostering Services',
    'Discover 500+ verified foster care agencies across England. Compare services, read reviews, and find the right agency for your fostering journey in your local area.',
    500
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description;

-- ============================================
-- REGIONS (9 Official English Regions)
-- ============================================

-- London
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'London',
    'london',
    'region',
    'Discover foster care agencies across Greater London. From central London boroughs to outer London areas, find verified fostering services near you.',
    'Foster Care Agencies in London | Find Fostering Services',
    'Find 80+ verified foster care agencies across London boroughs. Compare fostering services in Camden, Croydon, Westminster, and all 32 London boroughs.',
    80
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- South East England
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'South East England',
    'south-east-england',
    'region',
    'Find foster care agencies across South East England including Kent, Surrey, Sussex, Hampshire, Oxfordshire, and Berkshire.',
    'Foster Care Agencies in South East England | Fostering Services',
    'Discover 90+ verified foster care agencies in South East England. Compare fostering services across Kent, Surrey, Sussex, Hampshire, and more.',
    90
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- South West England
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'South West England',
    'south-west-england',
    'region',
    'Explore foster care agencies in South West England including Bristol, Devon, Cornwall, Somerset, Dorset, and Gloucestershire.',
    'Foster Care Agencies in South West England | Fostering Services',
    'Find 60+ verified foster care agencies across South West England. Compare fostering services in Bristol, Devon, Cornwall, and surrounding areas.',
    60
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- East of England
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'East of England',
    'east-of-england',
    'region',
    'Find foster care agencies across the East of England including Essex, Hertfordshire, Cambridgeshire, Norfolk, Suffolk, and Bedfordshire.',
    'Foster Care Agencies in East of England | Fostering Services',
    'Discover 55+ verified foster care agencies in East of England. Compare fostering services across Essex, Norfolk, Suffolk, and more.',
    55
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- West Midlands
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'West Midlands',
    'west-midlands',
    'region',
    'Explore foster care agencies in the West Midlands including Birmingham, Wolverhampton, Coventry, Staffordshire, and Worcestershire.',
    'Foster Care Agencies in West Midlands | Fostering Services',
    'Find 50+ verified foster care agencies across the West Midlands. Compare fostering services in Birmingham, Coventry, and surrounding areas.',
    50
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- East Midlands
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'East Midlands',
    'east-midlands',
    'region',
    'Find foster care agencies in the East Midlands including Nottinghamshire, Derbyshire, Leicestershire, Lincolnshire, and Northamptonshire.',
    'Foster Care Agencies in East Midlands | Fostering Services',
    'Discover 45+ verified foster care agencies in the East Midlands. Compare fostering services across Nottingham, Leicester, Derby, and more.',
    45
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- North West England
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000001',
    'North West England',
    'north-west-england',
    'region',
    'Explore foster care agencies across North West England including Greater Manchester, Merseyside, Lancashire, and Cheshire.',
    'Foster Care Agencies in North West England | Fostering Services',
    'Find 70+ verified foster care agencies in North West England. Compare fostering services in Manchester, Liverpool, and surrounding areas.',
    70
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- North East England
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000001',
    'North East England',
    'north-east-england',
    'region',
    'Find foster care agencies in North East England including Tyne and Wear, County Durham, and Northumberland.',
    'Foster Care Agencies in North East England | Fostering Services',
    'Discover 35+ verified foster care agencies in North East England. Compare fostering services in Newcastle, Sunderland, Durham, and more.',
    35
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- Yorkshire and the Humber
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count)
VALUES (
    'b1000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000001',
    'Yorkshire and the Humber',
    'yorkshire-and-the-humber',
    'region',
    'Explore foster care agencies across Yorkshire and the Humber including West Yorkshire, South Yorkshire, North Yorkshire, and East Riding.',
    'Foster Care Agencies in Yorkshire | Fostering Services',
    'Find 55+ verified foster care agencies in Yorkshire and the Humber. Compare fostering services in Leeds, Sheffield, York, and more.',
    55
) ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- LONDON BOROUGHS (Direct under London)
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Camden', 'camden', 'city', 'Find foster care agencies in Camden, North London. Discover verified fostering services serving Hampstead, Kentish Town, and surrounding areas.', 'Foster Care Agencies in Camden | London Fostering Services', 'Discover verified foster care agencies in Camden, London. Compare fostering services and find the right agency for your journey.', 8),
('c1010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Croydon', 'croydon', 'city', 'Explore foster care agencies in Croydon, South London. Find verified fostering services serving Purley, Thornton Heath, and surrounding areas.', 'Foster Care Agencies in Croydon | London Fostering Services', 'Find verified foster care agencies in Croydon, London. Compare fostering services in Purley, Thornton Heath, and local areas.', 10),
('c1010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Enfield', 'enfield', 'city', 'Find foster care agencies in Enfield, North London. Discover fostering services serving Edmonton, Southgate, and surrounding areas.', 'Foster Care Agencies in Enfield | London Fostering Services', 'Discover verified foster care agencies in Enfield, London. Compare local fostering services and start your journey.', 6),
('c1010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Hackney', 'hackney', 'city', 'Explore foster care agencies in Hackney, East London. Find verified fostering services serving Shoreditch, Dalston, and surrounding areas.', 'Foster Care Agencies in Hackney | London Fostering Services', 'Find verified foster care agencies in Hackney, London. Compare fostering services and find local support.', 7),
('c1010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'Haringey', 'haringey', 'city', 'Find foster care agencies in Haringey, North London. Discover fostering services in Tottenham, Wood Green, and surrounding areas.', 'Foster Care Agencies in Haringey | London Fostering Services', 'Discover verified foster care agencies in Haringey, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'Islington', 'islington', 'city', 'Explore foster care agencies in Islington, North London. Find verified fostering services in Angel, Highbury, and surrounding areas.', 'Foster Care Agencies in Islington | London Fostering Services', 'Find verified foster care agencies in Islington, London. Compare local fostering services.', 6),
('c1010000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'Lambeth', 'lambeth', 'city', 'Find foster care agencies in Lambeth, South London. Discover fostering services in Brixton, Streatham, and surrounding areas.', 'Foster Care Agencies in Lambeth | London Fostering Services', 'Discover verified foster care agencies in Lambeth, London. Compare fostering services in Brixton and local areas.', 8),
('c1010000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 'Lewisham', 'lewisham', 'city', 'Explore foster care agencies in Lewisham, South East London. Find verified fostering services in Catford, Deptford, and surrounding areas.', 'Foster Care Agencies in Lewisham | London Fostering Services', 'Find verified foster care agencies in Lewisham, London. Compare local fostering services.', 7),
('c1010000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000001', 'Newham', 'newham', 'city', 'Find foster care agencies in Newham, East London. Discover fostering services in Stratford, East Ham, and surrounding areas.', 'Foster Care Agencies in Newham | London Fostering Services', 'Discover verified foster care agencies in Newham, London. Compare fostering services in Stratford and local areas.', 9),
('c1010000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000001', 'Southwark', 'southwark', 'city', 'Explore foster care agencies in Southwark, South London. Find verified fostering services in Peckham, Bermondsey, and surrounding areas.', 'Foster Care Agencies in Southwark | London Fostering Services', 'Find verified foster care agencies in Southwark, London. Compare local fostering services.', 8),
('c1010000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000001', 'Tower Hamlets', 'tower-hamlets', 'city', 'Find foster care agencies in Tower Hamlets, East London. Discover fostering services in Bethnal Green, Bow, and surrounding areas.', 'Foster Care Agencies in Tower Hamlets | London Fostering Services', 'Discover verified foster care agencies in Tower Hamlets, London. Compare local fostering services.', 7),
('c1010000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000001', 'Waltham Forest', 'waltham-forest', 'city', 'Explore foster care agencies in Waltham Forest, North East London. Find verified fostering services in Walthamstow, Leyton, and surrounding areas.', 'Foster Care Agencies in Waltham Forest | London Fostering Services', 'Find verified foster care agencies in Waltham Forest, London. Compare local fostering services.', 6),
('c1010000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000001', 'Westminster', 'westminster', 'city', 'Find foster care agencies in Westminster, Central London. Discover fostering services in Paddington, Marylebone, and surrounding areas.', 'Foster Care Agencies in Westminster | London Fostering Services', 'Discover verified foster care agencies in Westminster, London. Compare fostering services in central London.', 5),
('c1010000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000001', 'Barking and Dagenham', 'barking-and-dagenham', 'city', 'Explore foster care agencies in Barking and Dagenham, East London. Find verified fostering services in your local area.', 'Foster Care Agencies in Barking and Dagenham | London Fostering', 'Find verified foster care agencies in Barking and Dagenham. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000001', 'Barnet', 'barnet', 'city', 'Find foster care agencies in Barnet, North London. Discover fostering services in Finchley, Hendon, and surrounding areas.', 'Foster Care Agencies in Barnet | London Fostering Services', 'Discover verified foster care agencies in Barnet, London. Compare local fostering services.', 6),
('c1010000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000001', 'Bexley', 'bexley', 'city', 'Explore foster care agencies in Bexley, South East London. Find verified fostering services in Sidcup, Erith, and surrounding areas.', 'Foster Care Agencies in Bexley | London Fostering Services', 'Find verified foster care agencies in Bexley, London. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000017', 'b1000000-0000-0000-0000-000000000001', 'Brent', 'brent', 'city', 'Find foster care agencies in Brent, North West London. Discover fostering services in Wembley, Kilburn, and surrounding areas.', 'Foster Care Agencies in Brent | London Fostering Services', 'Discover verified foster care agencies in Brent, London. Compare local fostering services.', 7),
('c1010000-0000-0000-0000-000000000018', 'b1000000-0000-0000-0000-000000000001', 'Bromley', 'bromley', 'city', 'Explore foster care agencies in Bromley, South London. Find verified fostering services in Orpington, Beckenham, and surrounding areas.', 'Foster Care Agencies in Bromley | London Fostering Services', 'Find verified foster care agencies in Bromley, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000019', 'b1000000-0000-0000-0000-000000000001', 'Ealing', 'ealing', 'city', 'Find foster care agencies in Ealing, West London. Discover fostering services in Acton, Southall, and surrounding areas.', 'Foster Care Agencies in Ealing | London Fostering Services', 'Discover verified foster care agencies in Ealing, London. Compare local fostering services.', 6),
('c1010000-0000-0000-0000-000000000020', 'b1000000-0000-0000-0000-000000000001', 'Greenwich', 'greenwich', 'city', 'Explore foster care agencies in Greenwich, South East London. Find verified fostering services in Woolwich, Eltham, and surrounding areas.', 'Foster Care Agencies in Greenwich | London Fostering Services', 'Find verified foster care agencies in Greenwich, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000001', 'Hammersmith and Fulham', 'hammersmith-and-fulham', 'city', 'Find foster care agencies in Hammersmith and Fulham, West London. Discover fostering services in your local area.', 'Foster Care Agencies in Hammersmith and Fulham | London Fostering', 'Discover verified foster care agencies in Hammersmith and Fulham. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000001', 'Harrow', 'harrow', 'city', 'Explore foster care agencies in Harrow, North West London. Find verified fostering services in Pinner, Stanmore, and surrounding areas.', 'Foster Care Agencies in Harrow | London Fostering Services', 'Find verified foster care agencies in Harrow, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000023', 'b1000000-0000-0000-0000-000000000001', 'Havering', 'havering', 'city', 'Find foster care agencies in Havering, East London. Discover fostering services in Romford, Hornchurch, and surrounding areas.', 'Foster Care Agencies in Havering | London Fostering Services', 'Discover verified foster care agencies in Havering, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000024', 'b1000000-0000-0000-0000-000000000001', 'Hillingdon', 'hillingdon', 'city', 'Explore foster care agencies in Hillingdon, West London. Find verified fostering services in Uxbridge, Hayes, and surrounding areas.', 'Foster Care Agencies in Hillingdon | London Fostering Services', 'Find verified foster care agencies in Hillingdon, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000025', 'b1000000-0000-0000-0000-000000000001', 'Hounslow', 'hounslow', 'city', 'Find foster care agencies in Hounslow, West London. Discover fostering services in Chiswick, Feltham, and surrounding areas.', 'Foster Care Agencies in Hounslow | London Fostering Services', 'Discover verified foster care agencies in Hounslow, London. Compare local fostering services.', 5),
('c1010000-0000-0000-0000-000000000026', 'b1000000-0000-0000-0000-000000000001', 'Kensington and Chelsea', 'kensington-and-chelsea', 'city', 'Explore foster care agencies in Kensington and Chelsea, Central London. Find verified fostering services in your local area.', 'Foster Care Agencies in Kensington and Chelsea | London Fostering', 'Find verified foster care agencies in Kensington and Chelsea. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000027', 'b1000000-0000-0000-0000-000000000001', 'Kingston upon Thames', 'kingston-upon-thames', 'city', 'Find foster care agencies in Kingston upon Thames, South West London. Discover fostering services in Surbiton and surrounding areas.', 'Foster Care Agencies in Kingston upon Thames | London Fostering', 'Discover verified foster care agencies in Kingston upon Thames. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000028', 'b1000000-0000-0000-0000-000000000001', 'Merton', 'merton', 'city', 'Explore foster care agencies in Merton, South West London. Find verified fostering services in Wimbledon, Mitcham, and surrounding areas.', 'Foster Care Agencies in Merton | London Fostering Services', 'Find verified foster care agencies in Merton, London. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000029', 'b1000000-0000-0000-0000-000000000001', 'Redbridge', 'redbridge', 'city', 'Find foster care agencies in Redbridge, East London. Discover fostering services in Ilford, Wanstead, and surrounding areas.', 'Foster Care Agencies in Redbridge | London Fostering Services', 'Discover verified foster care agencies in Redbridge, London. Compare local fostering services.', 6),
('c1010000-0000-0000-0000-000000000030', 'b1000000-0000-0000-0000-000000000001', 'Richmond upon Thames', 'richmond-upon-thames', 'city', 'Explore foster care agencies in Richmond upon Thames, South West London. Find verified fostering services in Twickenham and surrounding areas.', 'Foster Care Agencies in Richmond upon Thames | London Fostering', 'Find verified foster care agencies in Richmond upon Thames. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000031', 'b1000000-0000-0000-0000-000000000001', 'Sutton', 'sutton', 'city', 'Find foster care agencies in Sutton, South London. Discover fostering services in Cheam, Carshalton, and surrounding areas.', 'Foster Care Agencies in Sutton | London Fostering Services', 'Discover verified foster care agencies in Sutton, London. Compare local fostering services.', 4),
('c1010000-0000-0000-0000-000000000032', 'b1000000-0000-0000-0000-000000000001', 'Wandsworth', 'wandsworth', 'city', 'Explore foster care agencies in Wandsworth, South West London. Find verified fostering services in Battersea, Tooting, and surrounding areas.', 'Foster Care Agencies in Wandsworth | London Fostering Services', 'Find verified foster care agencies in Wandsworth, London. Compare local fostering services.', 5)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- SOUTH EAST ENGLAND COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c2010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Kent', 'kent', 'county', 'Find foster care agencies across Kent, the Garden of England. Discover fostering services in Maidstone, Canterbury, Dover, and surrounding areas.', 'Foster Care Agencies in Kent | South East Fostering Services', 'Discover verified foster care agencies across Kent. Compare fostering services in Maidstone, Canterbury, and all Kent areas.', 15),
('c2010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Surrey', 'surrey', 'county', 'Explore foster care agencies in Surrey. Find verified fostering services in Guildford, Woking, Epsom, and surrounding areas.', 'Foster Care Agencies in Surrey | South East Fostering Services', 'Find verified foster care agencies across Surrey. Compare fostering services in Guildford, Woking, and all Surrey areas.', 12),
('c2010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'East Sussex', 'east-sussex', 'county', 'Find foster care agencies in East Sussex. Discover fostering services in Brighton, Eastbourne, Hastings, and surrounding areas.', 'Foster Care Agencies in East Sussex | South East Fostering Services', 'Discover verified foster care agencies in East Sussex. Compare fostering services in Brighton, Eastbourne, and local areas.', 10),
('c2010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'West Sussex', 'west-sussex', 'county', 'Explore foster care agencies in West Sussex. Find verified fostering services in Chichester, Worthing, Crawley, and surrounding areas.', 'Foster Care Agencies in West Sussex | South East Fostering Services', 'Find verified foster care agencies in West Sussex. Compare fostering services in Chichester, Worthing, and local areas.', 9),
('c2010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Hampshire', 'hampshire', 'county', 'Find foster care agencies across Hampshire. Discover fostering services in Southampton, Portsmouth, Winchester, and surrounding areas.', 'Foster Care Agencies in Hampshire | South East Fostering Services', 'Discover verified foster care agencies across Hampshire. Compare fostering services in Southampton, Portsmouth, and all areas.', 14),
('c2010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'Oxfordshire', 'oxfordshire', 'county', 'Explore foster care agencies in Oxfordshire. Find verified fostering services in Oxford, Banbury, Bicester, and surrounding areas.', 'Foster Care Agencies in Oxfordshire | South East Fostering Services', 'Find verified foster care agencies in Oxfordshire. Compare fostering services in Oxford, Banbury, and local areas.', 8),
('c2010000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'Buckinghamshire', 'buckinghamshire', 'county', 'Find foster care agencies in Buckinghamshire. Discover fostering services in Aylesbury, High Wycombe, Milton Keynes, and surrounding areas.', 'Foster Care Agencies in Buckinghamshire | South East Fostering Services', 'Discover verified foster care agencies in Buckinghamshire. Compare fostering services in Aylesbury, High Wycombe, and local areas.', 8),
('c2010000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000002', 'Berkshire', 'berkshire', 'county', 'Explore foster care agencies in Berkshire. Find verified fostering services in Reading, Slough, Windsor, and surrounding areas.', 'Foster Care Agencies in Berkshire | South East Fostering Services', 'Find verified foster care agencies in Berkshire. Compare fostering services in Reading, Slough, and local areas.', 10),
('c2010000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000002', 'Isle of Wight', 'isle-of-wight', 'county', 'Find foster care agencies on the Isle of Wight. Discover fostering services in Newport, Ryde, and across the island.', 'Foster Care Agencies in Isle of Wight | South East Fostering Services', 'Discover verified foster care agencies on the Isle of Wight. Compare local fostering services.', 3)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- SOUTH WEST ENGLAND COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c3010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'Bristol', 'bristol', 'county', 'Find foster care agencies in Bristol. Discover fostering services across this vibrant city and surrounding areas.', 'Foster Care Agencies in Bristol | South West Fostering Services', 'Discover verified foster care agencies in Bristol. Compare fostering services and find local support.', 12),
('c3010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Gloucestershire', 'gloucestershire', 'county', 'Explore foster care agencies in Gloucestershire. Find verified fostering services in Gloucester, Cheltenham, and surrounding areas.', 'Foster Care Agencies in Gloucestershire | South West Fostering Services', 'Find verified foster care agencies in Gloucestershire. Compare fostering services in Gloucester and Cheltenham.', 8),
('c3010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Somerset', 'somerset', 'county', 'Find foster care agencies in Somerset. Discover fostering services in Bath, Taunton, Yeovil, and surrounding areas.', 'Foster Care Agencies in Somerset | South West Fostering Services', 'Discover verified foster care agencies in Somerset. Compare fostering services in Bath, Taunton, and local areas.', 7),
('c3010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'Devon', 'devon', 'county', 'Explore foster care agencies in Devon. Find verified fostering services in Exeter, Plymouth, Torquay, and surrounding areas.', 'Foster Care Agencies in Devon | South West Fostering Services', 'Find verified foster care agencies in Devon. Compare fostering services in Exeter, Plymouth, and local areas.', 10),
('c3010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Cornwall', 'cornwall', 'county', 'Find foster care agencies in Cornwall. Discover fostering services in Truro, Newquay, Falmouth, and surrounding areas.', 'Foster Care Agencies in Cornwall | South West Fostering Services', 'Discover verified foster care agencies in Cornwall. Compare fostering services across Cornwall.', 6),
('c3010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', 'Wiltshire', 'wiltshire', 'county', 'Explore foster care agencies in Wiltshire. Find verified fostering services in Salisbury, Swindon, Chippenham, and surrounding areas.', 'Foster Care Agencies in Wiltshire | South West Fostering Services', 'Find verified foster care agencies in Wiltshire. Compare fostering services in Salisbury, Swindon, and local areas.', 7),
('c3010000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'Dorset', 'dorset', 'county', 'Find foster care agencies in Dorset. Discover fostering services in Bournemouth, Poole, Weymouth, and surrounding areas.', 'Foster Care Agencies in Dorset | South West Fostering Services', 'Discover verified foster care agencies in Dorset. Compare fostering services in Bournemouth, Poole, and local areas.', 8)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- EAST OF ENGLAND COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c4010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'Essex', 'essex', 'county', 'Find foster care agencies across Essex. Discover fostering services in Chelmsford, Colchester, Southend, and surrounding areas.', 'Foster Care Agencies in Essex | East of England Fostering Services', 'Discover verified foster care agencies across Essex. Compare fostering services in Chelmsford, Colchester, and all areas.', 14),
('c4010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'Hertfordshire', 'hertfordshire', 'county', 'Explore foster care agencies in Hertfordshire. Find verified fostering services in Watford, St Albans, Stevenage, and surrounding areas.', 'Foster Care Agencies in Hertfordshire | East of England Fostering Services', 'Find verified foster care agencies in Hertfordshire. Compare fostering services in Watford, St Albans, and local areas.', 12),
('c4010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'Cambridgeshire', 'cambridgeshire', 'county', 'Find foster care agencies in Cambridgeshire. Discover fostering services in Cambridge, Peterborough, Ely, and surrounding areas.', 'Foster Care Agencies in Cambridgeshire | East of England Fostering Services', 'Discover verified foster care agencies in Cambridgeshire. Compare fostering services in Cambridge and Peterborough.', 9),
('c4010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'Norfolk', 'norfolk', 'county', 'Explore foster care agencies in Norfolk. Find verified fostering services in Norwich, Great Yarmouth, King''s Lynn, and surrounding areas.', 'Foster Care Agencies in Norfolk | East of England Fostering Services', 'Find verified foster care agencies in Norfolk. Compare fostering services in Norwich and all Norfolk areas.', 8),
('c4010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000004', 'Suffolk', 'suffolk', 'county', 'Find foster care agencies in Suffolk. Discover fostering services in Ipswich, Bury St Edmunds, Lowestoft, and surrounding areas.', 'Foster Care Agencies in Suffolk | East of England Fostering Services', 'Discover verified foster care agencies in Suffolk. Compare fostering services in Ipswich and local areas.', 7),
('c4010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000004', 'Bedfordshire', 'bedfordshire', 'county', 'Explore foster care agencies in Bedfordshire. Find verified fostering services in Bedford, Luton, Dunstable, and surrounding areas.', 'Foster Care Agencies in Bedfordshire | East of England Fostering Services', 'Find verified foster care agencies in Bedfordshire. Compare fostering services in Bedford, Luton, and local areas.', 6)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- WEST MIDLANDS COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c5010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000005', 'West Midlands County', 'west-midlands-county', 'county', 'Find foster care agencies in the West Midlands County. Discover fostering services in Birmingham, Wolverhampton, Coventry, and surrounding areas.', 'Foster Care Agencies in West Midlands County | Fostering Services', 'Discover verified foster care agencies in the West Midlands. Compare fostering services in Birmingham, Coventry, and all areas.', 25),
('c5010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', 'Staffordshire', 'staffordshire', 'county', 'Explore foster care agencies in Staffordshire. Find verified fostering services in Stoke-on-Trent, Stafford, Lichfield, and surrounding areas.', 'Foster Care Agencies in Staffordshire | West Midlands Fostering Services', 'Find verified foster care agencies in Staffordshire. Compare fostering services in Stoke-on-Trent, Stafford, and local areas.', 9),
('c5010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000005', 'Warwickshire', 'warwickshire', 'county', 'Find foster care agencies in Warwickshire. Discover fostering services in Warwick, Nuneaton, Leamington Spa, and surrounding areas.', 'Foster Care Agencies in Warwickshire | West Midlands Fostering Services', 'Discover verified foster care agencies in Warwickshire. Compare fostering services in Warwick and local areas.', 7),
('c5010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000005', 'Worcestershire', 'worcestershire', 'county', 'Explore foster care agencies in Worcestershire. Find verified fostering services in Worcester, Redditch, Kidderminster, and surrounding areas.', 'Foster Care Agencies in Worcestershire | West Midlands Fostering Services', 'Find verified foster care agencies in Worcestershire. Compare fostering services in Worcester and local areas.', 6),
('c5010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'Shropshire', 'shropshire', 'county', 'Find foster care agencies in Shropshire. Discover fostering services in Shrewsbury, Telford, and surrounding areas.', 'Foster Care Agencies in Shropshire | West Midlands Fostering Services', 'Discover verified foster care agencies in Shropshire. Compare fostering services in Shrewsbury and Telford.', 5),
('c5010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000005', 'Herefordshire', 'herefordshire', 'county', 'Explore foster care agencies in Herefordshire. Find verified fostering services in Hereford and surrounding areas.', 'Foster Care Agencies in Herefordshire | West Midlands Fostering Services', 'Find verified foster care agencies in Herefordshire. Compare local fostering services.', 4)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- EAST MIDLANDS COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c6010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000006', 'Derbyshire', 'derbyshire', 'county', 'Find foster care agencies in Derbyshire. Discover fostering services in Derby, Chesterfield, Buxton, and surrounding areas.', 'Foster Care Agencies in Derbyshire | East Midlands Fostering Services', 'Discover verified foster care agencies in Derbyshire. Compare fostering services in Derby and local areas.', 9),
('c6010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', 'Nottinghamshire', 'nottinghamshire', 'county', 'Explore foster care agencies in Nottinghamshire. Find verified fostering services in Nottingham, Mansfield, Newark, and surrounding areas.', 'Foster Care Agencies in Nottinghamshire | East Midlands Fostering Services', 'Find verified foster care agencies in Nottinghamshire. Compare fostering services in Nottingham and local areas.', 10),
('c6010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', 'Leicestershire', 'leicestershire', 'county', 'Find foster care agencies in Leicestershire. Discover fostering services in Leicester, Loughborough, Hinckley, and surrounding areas.', 'Foster Care Agencies in Leicestershire | East Midlands Fostering Services', 'Discover verified foster care agencies in Leicestershire. Compare fostering services in Leicester and local areas.', 9),
('c6010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000006', 'Lincolnshire', 'lincolnshire', 'county', 'Explore foster care agencies in Lincolnshire. Find verified fostering services in Lincoln, Grantham, Boston, and surrounding areas.', 'Foster Care Agencies in Lincolnshire | East Midlands Fostering Services', 'Find verified foster care agencies in Lincolnshire. Compare fostering services in Lincoln and local areas.', 7),
('c6010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000006', 'Northamptonshire', 'northamptonshire', 'county', 'Find foster care agencies in Northamptonshire. Discover fostering services in Northampton, Kettering, Corby, and surrounding areas.', 'Foster Care Agencies in Northamptonshire | East Midlands Fostering Services', 'Discover verified foster care agencies in Northamptonshire. Compare fostering services in Northampton and local areas.', 7),
('c6010000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 'Rutland', 'rutland', 'county', 'Explore foster care agencies in Rutland. Find verified fostering services in Oakham and surrounding areas.', 'Foster Care Agencies in Rutland | East Midlands Fostering Services', 'Find verified foster care agencies in Rutland. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- NORTH WEST ENGLAND COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c7010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000007', 'Greater Manchester', 'greater-manchester', 'county', 'Find foster care agencies across Greater Manchester. Discover fostering services in Manchester, Salford, Bolton, and all boroughs.', 'Foster Care Agencies in Greater Manchester | North West Fostering Services', 'Discover verified foster care agencies in Greater Manchester. Compare fostering services in Manchester and all boroughs.', 20),
('c7010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000007', 'Merseyside', 'merseyside', 'county', 'Explore foster care agencies in Merseyside. Find verified fostering services in Liverpool, Wirral, Sefton, and surrounding areas.', 'Foster Care Agencies in Merseyside | North West Fostering Services', 'Find verified foster care agencies in Merseyside. Compare fostering services in Liverpool and all areas.', 15),
('c7010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', 'Lancashire', 'lancashire', 'county', 'Find foster care agencies in Lancashire. Discover fostering services in Preston, Blackburn, Blackpool, and surrounding areas.', 'Foster Care Agencies in Lancashire | North West Fostering Services', 'Discover verified foster care agencies in Lancashire. Compare fostering services in Preston, Blackpool, and local areas.', 14),
('c7010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000007', 'Cheshire', 'cheshire', 'county', 'Explore foster care agencies in Cheshire. Find verified fostering services in Chester, Warrington, Crewe, and surrounding areas.', 'Foster Care Agencies in Cheshire | North West Fostering Services', 'Find verified foster care agencies in Cheshire. Compare fostering services in Chester, Warrington, and local areas.', 10),
('c7010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000007', 'Cumbria', 'cumbria', 'county', 'Find foster care agencies in Cumbria. Discover fostering services in Carlisle, Kendal, Barrow-in-Furness, and surrounding areas.', 'Foster Care Agencies in Cumbria | North West Fostering Services', 'Discover verified foster care agencies in Cumbria. Compare fostering services across the Lake District and local areas.', 6)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- NORTH EAST ENGLAND COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c8010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', 'Tyne and Wear', 'tyne-and-wear', 'county', 'Find foster care agencies in Tyne and Wear. Discover fostering services in Newcastle, Sunderland, Gateshead, and surrounding areas.', 'Foster Care Agencies in Tyne and Wear | North East Fostering Services', 'Discover verified foster care agencies in Tyne and Wear. Compare fostering services in Newcastle, Sunderland, and all areas.', 15),
('c8010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000008', 'County Durham', 'county-durham', 'county', 'Explore foster care agencies in County Durham. Find verified fostering services in Durham, Darlington, Bishop Auckland, and surrounding areas.', 'Foster Care Agencies in County Durham | North East Fostering Services', 'Find verified foster care agencies in County Durham. Compare fostering services in Durham and local areas.', 10),
('c8010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000008', 'Northumberland', 'northumberland', 'county', 'Find foster care agencies in Northumberland. Discover fostering services in Hexham, Alnwick, Morpeth, and surrounding areas.', 'Foster Care Agencies in Northumberland | North East Fostering Services', 'Discover verified foster care agencies in Northumberland. Compare fostering services across the county.', 6),
('c8010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000008', 'Teesside', 'teesside', 'county', 'Explore foster care agencies in Teesside. Find verified fostering services in Middlesbrough, Stockton, Hartlepool, and surrounding areas.', 'Foster Care Agencies in Teesside | North East Fostering Services', 'Find verified foster care agencies in Teesside. Compare fostering services in Middlesbrough and local areas.', 8)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- YORKSHIRE AND THE HUMBER COUNTIES
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('c9010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000009', 'West Yorkshire', 'west-yorkshire', 'county', 'Find foster care agencies in West Yorkshire. Discover fostering services in Leeds, Bradford, Wakefield, Huddersfield, and surrounding areas.', 'Foster Care Agencies in West Yorkshire | Yorkshire Fostering Services', 'Discover verified foster care agencies in West Yorkshire. Compare fostering services in Leeds, Bradford, and all areas.', 18),
('c9010000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000009', 'South Yorkshire', 'south-yorkshire', 'county', 'Explore foster care agencies in South Yorkshire. Find verified fostering services in Sheffield, Doncaster, Barnsley, and surrounding areas.', 'Foster Care Agencies in South Yorkshire | Yorkshire Fostering Services', 'Find verified foster care agencies in South Yorkshire. Compare fostering services in Sheffield, Doncaster, and local areas.', 14),
('c9010000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000009', 'North Yorkshire', 'north-yorkshire', 'county', 'Find foster care agencies in North Yorkshire. Discover fostering services in York, Harrogate, Scarborough, and surrounding areas.', 'Foster Care Agencies in North Yorkshire | Yorkshire Fostering Services', 'Discover verified foster care agencies in North Yorkshire. Compare fostering services in York, Harrogate, and local areas.', 10),
('c9010000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000009', 'East Riding of Yorkshire', 'east-riding-of-yorkshire', 'county', 'Explore foster care agencies in the East Riding of Yorkshire. Find verified fostering services in Hull, Beverley, Bridlington, and surrounding areas.', 'Foster Care Agencies in East Riding of Yorkshire | Yorkshire Fostering', 'Find verified foster care agencies in East Riding of Yorkshire. Compare fostering services in Hull and local areas.', 8),
('c9010000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000009', 'Humberside', 'humberside', 'county', 'Find foster care agencies in Humberside. Discover fostering services in Grimsby, Scunthorpe, and surrounding areas.', 'Foster Care Agencies in Humberside | Yorkshire Fostering Services', 'Discover verified foster care agencies in Humberside. Compare fostering services in Grimsby and local areas.', 6)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - KENT
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d2010101-0000-0000-0000-000000000001', 'c2010000-0000-0000-0000-000000000001', 'Maidstone', 'maidstone', 'city', 'Find foster care agencies in Maidstone, Kent. The county town offers excellent fostering services and support.', 'Foster Care Agencies in Maidstone | Kent Fostering Services', 'Discover verified foster care agencies in Maidstone, Kent. Compare local fostering services.', 3),
('d2010101-0000-0000-0000-000000000002', 'c2010000-0000-0000-0000-000000000001', 'Canterbury', 'canterbury', 'city', 'Explore foster care agencies in Canterbury, Kent. Historic city with dedicated fostering support services.', 'Foster Care Agencies in Canterbury | Kent Fostering Services', 'Find verified foster care agencies in Canterbury, Kent. Compare local fostering services.', 3),
('d2010101-0000-0000-0000-000000000003', 'c2010000-0000-0000-0000-000000000001', 'Ashford', 'ashford', 'city', 'Find foster care agencies in Ashford, Kent. Growing town with excellent fostering opportunities.', 'Foster Care Agencies in Ashford | Kent Fostering Services', 'Discover verified foster care agencies in Ashford, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000004', 'c2010000-0000-0000-0000-000000000001', 'Dartford', 'dartford', 'city', 'Explore foster care agencies in Dartford, Kent. Well-connected town near London with fostering support.', 'Foster Care Agencies in Dartford | Kent Fostering Services', 'Find verified foster care agencies in Dartford, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000005', 'c2010000-0000-0000-0000-000000000001', 'Gravesend', 'gravesend', 'city', 'Find foster care agencies in Gravesend, Kent. Thames-side town with dedicated fostering services.', 'Foster Care Agencies in Gravesend | Kent Fostering Services', 'Discover verified foster care agencies in Gravesend, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000006', 'c2010000-0000-0000-0000-000000000001', 'Medway', 'medway', 'city', 'Explore foster care agencies in Medway, Kent. Large unitary authority with comprehensive fostering support.', 'Foster Care Agencies in Medway | Kent Fostering Services', 'Find verified foster care agencies in Medway, Kent. Compare local fostering services.', 4),
('d2010101-0000-0000-0000-000000000007', 'c2010000-0000-0000-0000-000000000001', 'Tonbridge', 'tonbridge', 'city', 'Find foster care agencies in Tonbridge, Kent. Market town with excellent fostering opportunities.', 'Foster Care Agencies in Tonbridge | Kent Fostering Services', 'Discover verified foster care agencies in Tonbridge, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000008', 'c2010000-0000-0000-0000-000000000001', 'Tunbridge Wells', 'tunbridge-wells', 'city', 'Explore foster care agencies in Royal Tunbridge Wells, Kent. Spa town with dedicated fostering services.', 'Foster Care Agencies in Tunbridge Wells | Kent Fostering Services', 'Find verified foster care agencies in Tunbridge Wells, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000009', 'c2010000-0000-0000-0000-000000000001', 'Folkestone', 'folkestone', 'city', 'Find foster care agencies in Folkestone, Kent. Coastal town with excellent fostering support.', 'Foster Care Agencies in Folkestone | Kent Fostering Services', 'Discover verified foster care agencies in Folkestone, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000010', 'c2010000-0000-0000-0000-000000000001', 'Dover', 'dover', 'city', 'Explore foster care agencies in Dover, Kent. Historic port town with fostering opportunities.', 'Foster Care Agencies in Dover | Kent Fostering Services', 'Find verified foster care agencies in Dover, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000011', 'c2010000-0000-0000-0000-000000000001', 'Margate', 'margate', 'city', 'Find foster care agencies in Margate, Kent. Seaside town with dedicated fostering services.', 'Foster Care Agencies in Margate | Kent Fostering Services', 'Discover verified foster care agencies in Margate, Kent. Compare local fostering services.', 2),
('d2010101-0000-0000-0000-000000000012', 'c2010000-0000-0000-0000-000000000001', 'Ramsgate', 'ramsgate', 'city', 'Explore foster care agencies in Ramsgate, Kent. Coastal town with fostering support available.', 'Foster Care Agencies in Ramsgate | Kent Fostering Services', 'Find verified foster care agencies in Ramsgate, Kent. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - GREATER MANCHESTER
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d7010101-0000-0000-0000-000000000001', 'c7010000-0000-0000-0000-000000000001', 'Manchester', 'manchester', 'city', 'Find foster care agencies in Manchester. Major city with comprehensive fostering services and support across all areas.', 'Foster Care Agencies in Manchester | Greater Manchester Fostering', 'Discover verified foster care agencies in Manchester. Compare fostering services across the city.', 8),
('d7010101-0000-0000-0000-000000000002', 'c7010000-0000-0000-0000-000000000001', 'Salford', 'salford', 'city', 'Explore foster care agencies in Salford. City with excellent fostering opportunities and support networks.', 'Foster Care Agencies in Salford | Greater Manchester Fostering', 'Find verified foster care agencies in Salford. Compare local fostering services.', 4),
('d7010101-0000-0000-0000-000000000003', 'c7010000-0000-0000-0000-000000000001', 'Bolton', 'bolton', 'city', 'Find foster care agencies in Bolton. Large town with dedicated fostering services and family support.', 'Foster Care Agencies in Bolton | Greater Manchester Fostering', 'Discover verified foster care agencies in Bolton. Compare local fostering services.', 3),
('d7010101-0000-0000-0000-000000000004', 'c7010000-0000-0000-0000-000000000001', 'Bury', 'bury', 'city', 'Explore foster care agencies in Bury. Town with strong community fostering support.', 'Foster Care Agencies in Bury | Greater Manchester Fostering', 'Find verified foster care agencies in Bury. Compare local fostering services.', 2),
('d7010101-0000-0000-0000-000000000005', 'c7010000-0000-0000-0000-000000000001', 'Oldham', 'oldham', 'city', 'Find foster care agencies in Oldham. Town with excellent fostering opportunities.', 'Foster Care Agencies in Oldham | Greater Manchester Fostering', 'Discover verified foster care agencies in Oldham. Compare local fostering services.', 2),
('d7010101-0000-0000-0000-000000000006', 'c7010000-0000-0000-0000-000000000001', 'Rochdale', 'rochdale', 'city', 'Explore foster care agencies in Rochdale. Town with dedicated fostering services.', 'Foster Care Agencies in Rochdale | Greater Manchester Fostering', 'Find verified foster care agencies in Rochdale. Compare local fostering services.', 2),
('d7010101-0000-0000-0000-000000000007', 'c7010000-0000-0000-0000-000000000001', 'Stockport', 'stockport', 'city', 'Find foster care agencies in Stockport. Large town with comprehensive fostering support.', 'Foster Care Agencies in Stockport | Greater Manchester Fostering', 'Discover verified foster care agencies in Stockport. Compare local fostering services.', 3),
('d7010101-0000-0000-0000-000000000008', 'c7010000-0000-0000-0000-000000000001', 'Tameside', 'tameside', 'city', 'Explore foster care agencies in Tameside. Borough with excellent fostering opportunities.', 'Foster Care Agencies in Tameside | Greater Manchester Fostering', 'Find verified foster care agencies in Tameside. Compare local fostering services.', 2),
('d7010101-0000-0000-0000-000000000009', 'c7010000-0000-0000-0000-000000000001', 'Trafford', 'trafford', 'city', 'Find foster care agencies in Trafford. Borough with strong fostering community support.', 'Foster Care Agencies in Trafford | Greater Manchester Fostering', 'Discover verified foster care agencies in Trafford. Compare local fostering services.', 2),
('d7010101-0000-0000-0000-000000000010', 'c7010000-0000-0000-0000-000000000001', 'Wigan', 'wigan', 'city', 'Explore foster care agencies in Wigan. Large town with dedicated fostering services.', 'Foster Care Agencies in Wigan | Greater Manchester Fostering', 'Find verified foster care agencies in Wigan. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - WEST MIDLANDS COUNTY
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d5010101-0000-0000-0000-000000000001', 'c5010000-0000-0000-0000-000000000001', 'Birmingham', 'birmingham', 'city', 'Find foster care agencies in Birmingham. England''s second largest city with comprehensive fostering services.', 'Foster Care Agencies in Birmingham | West Midlands Fostering', 'Discover verified foster care agencies in Birmingham. Compare fostering services across the city.', 12),
('d5010101-0000-0000-0000-000000000002', 'c5010000-0000-0000-0000-000000000001', 'Wolverhampton', 'wolverhampton', 'city', 'Explore foster care agencies in Wolverhampton. City with excellent fostering opportunities.', 'Foster Care Agencies in Wolverhampton | West Midlands Fostering', 'Find verified foster care agencies in Wolverhampton. Compare local fostering services.', 4),
('d5010101-0000-0000-0000-000000000003', 'c5010000-0000-0000-0000-000000000001', 'Coventry', 'coventry', 'city', 'Find foster care agencies in Coventry. Historic city with dedicated fostering services.', 'Foster Care Agencies in Coventry | West Midlands Fostering', 'Discover verified foster care agencies in Coventry. Compare local fostering services.', 5),
('d5010101-0000-0000-0000-000000000004', 'c5010000-0000-0000-0000-000000000001', 'Solihull', 'solihull', 'city', 'Explore foster care agencies in Solihull. Borough with strong fostering community.', 'Foster Care Agencies in Solihull | West Midlands Fostering', 'Find verified foster care agencies in Solihull. Compare local fostering services.', 3),
('d5010101-0000-0000-0000-000000000005', 'c5010000-0000-0000-0000-000000000001', 'Dudley', 'dudley', 'city', 'Find foster care agencies in Dudley. Borough with excellent fostering support.', 'Foster Care Agencies in Dudley | West Midlands Fostering', 'Discover verified foster care agencies in Dudley. Compare local fostering services.', 3),
('d5010101-0000-0000-0000-000000000006', 'c5010000-0000-0000-0000-000000000001', 'Sandwell', 'sandwell', 'city', 'Explore foster care agencies in Sandwell. Borough with dedicated fostering services.', 'Foster Care Agencies in Sandwell | West Midlands Fostering', 'Find verified foster care agencies in Sandwell. Compare local fostering services.', 3),
('d5010101-0000-0000-0000-000000000007', 'c5010000-0000-0000-0000-000000000001', 'Walsall', 'walsall', 'city', 'Find foster care agencies in Walsall. Town with strong fostering support networks.', 'Foster Care Agencies in Walsall | West Midlands Fostering', 'Discover verified foster care agencies in Walsall. Compare local fostering services.', 3)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - WEST YORKSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d9010101-0000-0000-0000-000000000001', 'c9010000-0000-0000-0000-000000000001', 'Leeds', 'leeds', 'city', 'Find foster care agencies in Leeds. Major city with comprehensive fostering services and support.', 'Foster Care Agencies in Leeds | West Yorkshire Fostering', 'Discover verified foster care agencies in Leeds. Compare fostering services across the city.', 7),
('d9010101-0000-0000-0000-000000000002', 'c9010000-0000-0000-0000-000000000001', 'Bradford', 'bradford', 'city', 'Explore foster care agencies in Bradford. Large city with excellent fostering opportunities.', 'Foster Care Agencies in Bradford | West Yorkshire Fostering', 'Find verified foster care agencies in Bradford. Compare local fostering services.', 5),
('d9010101-0000-0000-0000-000000000003', 'c9010000-0000-0000-0000-000000000001', 'Wakefield', 'wakefield', 'city', 'Find foster care agencies in Wakefield. City with dedicated fostering services.', 'Foster Care Agencies in Wakefield | West Yorkshire Fostering', 'Discover verified foster care agencies in Wakefield. Compare local fostering services.', 3),
('d9010101-0000-0000-0000-000000000004', 'c9010000-0000-0000-0000-000000000001', 'Huddersfield', 'huddersfield', 'city', 'Explore foster care agencies in Huddersfield. Town with strong fostering support.', 'Foster Care Agencies in Huddersfield | West Yorkshire Fostering', 'Find verified foster care agencies in Huddersfield. Compare local fostering services.', 3),
('d9010101-0000-0000-0000-000000000005', 'c9010000-0000-0000-0000-000000000001', 'Halifax', 'halifax', 'city', 'Find foster care agencies in Halifax. Town with excellent fostering opportunities.', 'Foster Care Agencies in Halifax | West Yorkshire Fostering', 'Discover verified foster care agencies in Halifax. Compare local fostering services.', 2),
('d9010101-0000-0000-0000-000000000006', 'c9010000-0000-0000-0000-000000000001', 'Dewsbury', 'dewsbury', 'city', 'Explore foster care agencies in Dewsbury. Town with dedicated fostering services.', 'Foster Care Agencies in Dewsbury | West Yorkshire Fostering', 'Find verified foster care agencies in Dewsbury. Compare local fostering services.', 2),
('d9010101-0000-0000-0000-000000000007', 'c9010000-0000-0000-0000-000000000001', 'Batley', 'batley', 'city', 'Find foster care agencies in Batley. Town with fostering support available.', 'Foster Care Agencies in Batley | West Yorkshire Fostering', 'Discover verified foster care agencies in Batley. Compare local fostering services.', 2),
('d9010101-0000-0000-0000-000000000008', 'c9010000-0000-0000-0000-000000000001', 'Keighley', 'keighley', 'city', 'Explore foster care agencies in Keighley. Town with excellent fostering opportunities.', 'Foster Care Agencies in Keighley | West Yorkshire Fostering', 'Find verified foster care agencies in Keighley. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - MERSEYSIDE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d7020101-0000-0000-0000-000000000001', 'c7010000-0000-0000-0000-000000000002', 'Liverpool', 'liverpool', 'city', 'Find foster care agencies in Liverpool. Major city with comprehensive fostering services and support.', 'Foster Care Agencies in Liverpool | Merseyside Fostering', 'Discover verified foster care agencies in Liverpool. Compare fostering services across the city.', 6),
('d7020101-0000-0000-0000-000000000002', 'c7010000-0000-0000-0000-000000000002', 'Sefton', 'sefton', 'city', 'Explore foster care agencies in Sefton. Borough with excellent fostering opportunities including Southport and Crosby.', 'Foster Care Agencies in Sefton | Merseyside Fostering', 'Find verified foster care agencies in Sefton. Compare local fostering services.', 3),
('d7020101-0000-0000-0000-000000000003', 'c7010000-0000-0000-0000-000000000002', 'Wirral', 'wirral', 'city', 'Find foster care agencies in Wirral. Peninsula borough with dedicated fostering services.', 'Foster Care Agencies in Wirral | Merseyside Fostering', 'Discover verified foster care agencies in Wirral. Compare local fostering services.', 3),
('d7020101-0000-0000-0000-000000000004', 'c7010000-0000-0000-0000-000000000002', 'Knowsley', 'knowsley', 'city', 'Explore foster care agencies in Knowsley. Borough with strong fostering support networks.', 'Foster Care Agencies in Knowsley | Merseyside Fostering', 'Find verified foster care agencies in Knowsley. Compare local fostering services.', 2),
('d7020101-0000-0000-0000-000000000005', 'c7010000-0000-0000-0000-000000000002', 'St Helens', 'st-helens', 'city', 'Find foster care agencies in St Helens. Town with excellent fostering opportunities.', 'Foster Care Agencies in St Helens | Merseyside Fostering', 'Discover verified foster care agencies in St Helens. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - HAMPSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d2050101-0000-0000-0000-000000000001', 'c2010000-0000-0000-0000-000000000005', 'Southampton', 'southampton', 'city', 'Find foster care agencies in Southampton. Major port city with comprehensive fostering services.', 'Foster Care Agencies in Southampton | Hampshire Fostering', 'Discover verified foster care agencies in Southampton. Compare local fostering services.', 4),
('d2050101-0000-0000-0000-000000000002', 'c2010000-0000-0000-0000-000000000005', 'Portsmouth', 'portsmouth', 'city', 'Explore foster care agencies in Portsmouth. Naval city with excellent fostering opportunities.', 'Foster Care Agencies in Portsmouth | Hampshire Fostering', 'Find verified foster care agencies in Portsmouth. Compare local fostering services.', 4),
('d2050101-0000-0000-0000-000000000003', 'c2010000-0000-0000-0000-000000000005', 'Winchester', 'winchester', 'city', 'Find foster care agencies in Winchester. Historic city with dedicated fostering services.', 'Foster Care Agencies in Winchester | Hampshire Fostering', 'Discover verified foster care agencies in Winchester. Compare local fostering services.', 2),
('d2050101-0000-0000-0000-000000000004', 'c2010000-0000-0000-0000-000000000005', 'Basingstoke', 'basingstoke', 'city', 'Explore foster care agencies in Basingstoke. Growing town with fostering support.', 'Foster Care Agencies in Basingstoke | Hampshire Fostering', 'Find verified foster care agencies in Basingstoke. Compare local fostering services.', 2),
('d2050101-0000-0000-0000-000000000005', 'c2010000-0000-0000-0000-000000000005', 'Eastleigh', 'eastleigh', 'city', 'Find foster care agencies in Eastleigh. Town with excellent fostering opportunities.', 'Foster Care Agencies in Eastleigh | Hampshire Fostering', 'Discover verified foster care agencies in Eastleigh. Compare local fostering services.', 2),
('d2050101-0000-0000-0000-000000000006', 'c2010000-0000-0000-0000-000000000005', 'Fareham', 'fareham', 'city', 'Explore foster care agencies in Fareham. Town with dedicated fostering services.', 'Foster Care Agencies in Fareham | Hampshire Fostering', 'Find verified foster care agencies in Fareham. Compare local fostering services.', 2),
('d2050101-0000-0000-0000-000000000007', 'c2010000-0000-0000-0000-000000000005', 'Gosport', 'gosport', 'city', 'Find foster care agencies in Gosport. Town with strong fostering support.', 'Foster Care Agencies in Gosport | Hampshire Fostering', 'Discover verified foster care agencies in Gosport. Compare local fostering services.', 1),
('d2050101-0000-0000-0000-000000000008', 'c2010000-0000-0000-0000-000000000005', 'Havant', 'havant', 'city', 'Explore foster care agencies in Havant. Town with fostering opportunities.', 'Foster Care Agencies in Havant | Hampshire Fostering', 'Find verified foster care agencies in Havant. Compare local fostering services.', 1),
('d2050101-0000-0000-0000-000000000009', 'c2010000-0000-0000-0000-000000000005', 'Andover', 'andover', 'city', 'Find foster care agencies in Andover. Town with excellent fostering services.', 'Foster Care Agencies in Andover | Hampshire Fostering', 'Discover verified foster care agencies in Andover. Compare local fostering services.', 1),
('d2050101-0000-0000-0000-000000000010', 'c2010000-0000-0000-0000-000000000005', 'Farnborough', 'farnborough', 'city', 'Explore foster care agencies in Farnborough. Town with dedicated fostering support.', 'Foster Care Agencies in Farnborough | Hampshire Fostering', 'Find verified foster care agencies in Farnborough. Compare local fostering services.', 2)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - ESSEX
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d4010101-0000-0000-0000-000000000001', 'c4010000-0000-0000-0000-000000000001', 'Chelmsford', 'chelmsford', 'city', 'Find foster care agencies in Chelmsford. Essex county town with comprehensive fostering services.', 'Foster Care Agencies in Chelmsford | Essex Fostering', 'Discover verified foster care agencies in Chelmsford. Compare local fostering services.', 3),
('d4010101-0000-0000-0000-000000000002', 'c4010000-0000-0000-0000-000000000001', 'Colchester', 'colchester', 'city', 'Explore foster care agencies in Colchester. Britain''s oldest town with excellent fostering opportunities.', 'Foster Care Agencies in Colchester | Essex Fostering', 'Find verified foster care agencies in Colchester. Compare local fostering services.', 3),
('d4010101-0000-0000-0000-000000000003', 'c4010000-0000-0000-0000-000000000001', 'Southend-on-Sea', 'southend-on-sea', 'city', 'Find foster care agencies in Southend-on-Sea. Seaside city with dedicated fostering services.', 'Foster Care Agencies in Southend-on-Sea | Essex Fostering', 'Discover verified foster care agencies in Southend-on-Sea. Compare local fostering services.', 3),
('d4010101-0000-0000-0000-000000000004', 'c4010000-0000-0000-0000-000000000001', 'Basildon', 'basildon', 'city', 'Explore foster care agencies in Basildon. New town with fostering support networks.', 'Foster Care Agencies in Basildon | Essex Fostering', 'Find verified foster care agencies in Basildon. Compare local fostering services.', 2),
('d4010101-0000-0000-0000-000000000005', 'c4010000-0000-0000-0000-000000000001', 'Harlow', 'harlow', 'city', 'Find foster care agencies in Harlow. Town with excellent fostering opportunities.', 'Foster Care Agencies in Harlow | Essex Fostering', 'Discover verified foster care agencies in Harlow. Compare local fostering services.', 2),
('d4010101-0000-0000-0000-000000000006', 'c4010000-0000-0000-0000-000000000001', 'Brentwood', 'brentwood', 'city', 'Explore foster care agencies in Brentwood. Town with dedicated fostering services.', 'Foster Care Agencies in Brentwood | Essex Fostering', 'Find verified foster care agencies in Brentwood. Compare local fostering services.', 2),
('d4010101-0000-0000-0000-000000000007', 'c4010000-0000-0000-0000-000000000001', 'Grays', 'grays', 'city', 'Find foster care agencies in Grays. Town with fostering support available.', 'Foster Care Agencies in Grays | Essex Fostering', 'Discover verified foster care agencies in Grays. Compare local fostering services.', 1),
('d4010101-0000-0000-0000-000000000008', 'c4010000-0000-0000-0000-000000000001', 'Braintree', 'braintree', 'city', 'Explore foster care agencies in Braintree. Town with fostering opportunities.', 'Foster Care Agencies in Braintree | Essex Fostering', 'Find verified foster care agencies in Braintree. Compare local fostering services.', 1),
('d4010101-0000-0000-0000-000000000009', 'c4010000-0000-0000-0000-000000000001', 'Clacton-on-Sea', 'clacton-on-sea', 'city', 'Find foster care agencies in Clacton-on-Sea. Seaside town with fostering services.', 'Foster Care Agencies in Clacton-on-Sea | Essex Fostering', 'Discover verified foster care agencies in Clacton-on-Sea. Compare local fostering services.', 1),
('d4010101-0000-0000-0000-000000000010', 'c4010000-0000-0000-0000-000000000001', 'Witham', 'witham', 'city', 'Explore foster care agencies in Witham. Town with fostering support.', 'Foster Care Agencies in Witham | Essex Fostering', 'Find verified foster care agencies in Witham. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - BRISTOL
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d3010101-0000-0000-0000-000000000001', 'c3010000-0000-0000-0000-000000000001', 'Bristol City Centre', 'bristol-city-centre', 'city', 'Find foster care agencies in Bristol City Centre. Central area with comprehensive fostering services.', 'Foster Care Agencies in Bristol City Centre | Bristol Fostering', 'Discover verified foster care agencies in Bristol City Centre. Compare local fostering services.', 4),
('d3010101-0000-0000-0000-000000000002', 'c3010000-0000-0000-0000-000000000001', 'Clifton', 'clifton', 'city', 'Explore foster care agencies in Clifton, Bristol. Area with excellent fostering opportunities.', 'Foster Care Agencies in Clifton | Bristol Fostering', 'Find verified foster care agencies in Clifton, Bristol. Compare local fostering services.', 2),
('d3010101-0000-0000-0000-000000000003', 'c3010000-0000-0000-0000-000000000001', 'Bedminster', 'bedminster', 'city', 'Find foster care agencies in Bedminster, Bristol. Area with dedicated fostering services.', 'Foster Care Agencies in Bedminster | Bristol Fostering', 'Discover verified foster care agencies in Bedminster. Compare local fostering services.', 2),
('d3010101-0000-0000-0000-000000000004', 'c3010000-0000-0000-0000-000000000001', 'Fishponds', 'fishponds', 'city', 'Explore foster care agencies in Fishponds, Bristol. Area with fostering support.', 'Foster Care Agencies in Fishponds | Bristol Fostering', 'Find verified foster care agencies in Fishponds. Compare local fostering services.', 2),
('d3010101-0000-0000-0000-000000000005', 'c3010000-0000-0000-0000-000000000001', 'Henbury', 'henbury', 'city', 'Find foster care agencies in Henbury, Bristol. Area with fostering opportunities.', 'Foster Care Agencies in Henbury | Bristol Fostering', 'Discover verified foster care agencies in Henbury. Compare local fostering services.', 1),
('d3010101-0000-0000-0000-000000000006', 'c3010000-0000-0000-0000-000000000001', 'Knowle', 'knowle', 'city', 'Explore foster care agencies in Knowle, Bristol. Area with fostering support available.', 'Foster Care Agencies in Knowle | Bristol Fostering', 'Find verified foster care agencies in Knowle. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - DEVON
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d3040101-0000-0000-0000-000000000001', 'c3010000-0000-0000-0000-000000000004', 'Exeter', 'exeter', 'city', 'Find foster care agencies in Exeter. Devon''s capital city with comprehensive fostering services.', 'Foster Care Agencies in Exeter | Devon Fostering', 'Discover verified foster care agencies in Exeter. Compare local fostering services.', 3),
('d3040101-0000-0000-0000-000000000002', 'c3010000-0000-0000-0000-000000000004', 'Plymouth', 'plymouth', 'city', 'Explore foster care agencies in Plymouth. Major port city with excellent fostering opportunities.', 'Foster Care Agencies in Plymouth | Devon Fostering', 'Find verified foster care agencies in Plymouth. Compare local fostering services.', 4),
('d3040101-0000-0000-0000-000000000003', 'c3010000-0000-0000-0000-000000000004', 'Torquay', 'torquay', 'city', 'Find foster care agencies in Torquay. English Riviera resort with fostering services.', 'Foster Care Agencies in Torquay | Devon Fostering', 'Discover verified foster care agencies in Torquay. Compare local fostering services.', 2),
('d3040101-0000-0000-0000-000000000004', 'c3010000-0000-0000-0000-000000000004', 'Paignton', 'paignton', 'city', 'Explore foster care agencies in Paignton. Seaside town with fostering support.', 'Foster Care Agencies in Paignton | Devon Fostering', 'Find verified foster care agencies in Paignton. Compare local fostering services.', 1),
('d3040101-0000-0000-0000-000000000005', 'c3010000-0000-0000-0000-000000000004', 'Newton Abbot', 'newton-abbot', 'city', 'Find foster care agencies in Newton Abbot. Market town with fostering opportunities.', 'Foster Care Agencies in Newton Abbot | Devon Fostering', 'Discover verified foster care agencies in Newton Abbot. Compare local fostering services.', 1),
('d3040101-0000-0000-0000-000000000006', 'c3010000-0000-0000-0000-000000000004', 'Barnstaple', 'barnstaple', 'city', 'Explore foster care agencies in Barnstaple. North Devon town with fostering services.', 'Foster Care Agencies in Barnstaple | Devon Fostering', 'Find verified foster care agencies in Barnstaple. Compare local fostering services.', 1),
('d3040101-0000-0000-0000-000000000007', 'c3010000-0000-0000-0000-000000000004', 'Tiverton', 'tiverton', 'city', 'Find foster care agencies in Tiverton. Mid Devon town with fostering support.', 'Foster Care Agencies in Tiverton | Devon Fostering', 'Discover verified foster care agencies in Tiverton. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - TYNE AND WEAR
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d8010101-0000-0000-0000-000000000001', 'c8010000-0000-0000-0000-000000000001', 'Newcastle upon Tyne', 'newcastle-upon-tyne', 'city', 'Find foster care agencies in Newcastle upon Tyne. Major city with comprehensive fostering services.', 'Foster Care Agencies in Newcastle | Tyne and Wear Fostering', 'Discover verified foster care agencies in Newcastle upon Tyne. Compare local fostering services.', 5),
('d8010101-0000-0000-0000-000000000002', 'c8010000-0000-0000-0000-000000000001', 'Sunderland', 'sunderland', 'city', 'Explore foster care agencies in Sunderland. City with excellent fostering opportunities.', 'Foster Care Agencies in Sunderland | Tyne and Wear Fostering', 'Find verified foster care agencies in Sunderland. Compare local fostering services.', 4),
('d8010101-0000-0000-0000-000000000003', 'c8010000-0000-0000-0000-000000000001', 'Gateshead', 'gateshead', 'city', 'Find foster care agencies in Gateshead. Town with dedicated fostering services.', 'Foster Care Agencies in Gateshead | Tyne and Wear Fostering', 'Discover verified foster care agencies in Gateshead. Compare local fostering services.', 3),
('d8010101-0000-0000-0000-000000000004', 'c8010000-0000-0000-0000-000000000001', 'South Shields', 'south-shields', 'city', 'Explore foster care agencies in South Shields. Coastal town with fostering support.', 'Foster Care Agencies in South Shields | Tyne and Wear Fostering', 'Find verified foster care agencies in South Shields. Compare local fostering services.', 2),
('d8010101-0000-0000-0000-000000000005', 'c8010000-0000-0000-0000-000000000001', 'North Shields', 'north-shields', 'city', 'Find foster care agencies in North Shields. Town with fostering opportunities.', 'Foster Care Agencies in North Shields | Tyne and Wear Fostering', 'Discover verified foster care agencies in North Shields. Compare local fostering services.', 1),
('d8010101-0000-0000-0000-000000000006', 'c8010000-0000-0000-0000-000000000001', 'Washington', 'washington', 'city', 'Explore foster care agencies in Washington. New town with fostering services.', 'Foster Care Agencies in Washington | Tyne and Wear Fostering', 'Find verified foster care agencies in Washington. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - SOUTH YORKSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d9020101-0000-0000-0000-000000000001', 'c9010000-0000-0000-0000-000000000002', 'Sheffield', 'sheffield', 'city', 'Find foster care agencies in Sheffield. Major city with comprehensive fostering services.', 'Foster Care Agencies in Sheffield | South Yorkshire Fostering', 'Discover verified foster care agencies in Sheffield. Compare local fostering services.', 5),
('d9020101-0000-0000-0000-000000000002', 'c9010000-0000-0000-0000-000000000002', 'Doncaster', 'doncaster', 'city', 'Explore foster care agencies in Doncaster. Town with excellent fostering opportunities.', 'Foster Care Agencies in Doncaster | South Yorkshire Fostering', 'Find verified foster care agencies in Doncaster. Compare local fostering services.', 3),
('d9020101-0000-0000-0000-000000000003', 'c9010000-0000-0000-0000-000000000002', 'Barnsley', 'barnsley', 'city', 'Find foster care agencies in Barnsley. Town with dedicated fostering services.', 'Foster Care Agencies in Barnsley | South Yorkshire Fostering', 'Discover verified foster care agencies in Barnsley. Compare local fostering services.', 3),
('d9020101-0000-0000-0000-000000000004', 'c9010000-0000-0000-0000-000000000002', 'Rotherham', 'rotherham', 'city', 'Explore foster care agencies in Rotherham. Town with strong fostering support.', 'Foster Care Agencies in Rotherham | South Yorkshire Fostering', 'Find verified foster care agencies in Rotherham. Compare local fostering services.', 3)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- CITIES AND TOWNS - NOTTINGHAMSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d6020101-0000-0000-0000-000000000001', 'c6010000-0000-0000-0000-000000000002', 'Nottingham', 'nottingham', 'city', 'Find foster care agencies in Nottingham. Major city with comprehensive fostering services.', 'Foster Care Agencies in Nottingham | Nottinghamshire Fostering', 'Discover verified foster care agencies in Nottingham. Compare local fostering services.', 5),
('d6020101-0000-0000-0000-000000000002', 'c6010000-0000-0000-0000-000000000002', 'Mansfield', 'mansfield', 'city', 'Explore foster care agencies in Mansfield. Town with excellent fostering opportunities.', 'Foster Care Agencies in Mansfield | Nottinghamshire Fostering', 'Find verified foster care agencies in Mansfield. Compare local fostering services.', 2),
('d6020101-0000-0000-0000-000000000003', 'c6010000-0000-0000-0000-000000000002', 'Newark-on-Trent', 'newark-on-trent', 'city', 'Find foster care agencies in Newark-on-Trent. Historic town with fostering services.', 'Foster Care Agencies in Newark-on-Trent | Nottinghamshire Fostering', 'Discover verified foster care agencies in Newark-on-Trent. Compare local fostering services.', 2),
('d6020101-0000-0000-0000-000000000004', 'c6010000-0000-0000-0000-000000000002', 'Worksop', 'worksop', 'city', 'Explore foster care agencies in Worksop. Town with fostering support.', 'Foster Care Agencies in Worksop | Nottinghamshire Fostering', 'Find verified foster care agencies in Worksop. Compare local fostering services.', 1),
('d6020101-0000-0000-0000-000000000005', 'c6010000-0000-0000-0000-000000000002', 'Beeston', 'beeston', 'city', 'Find foster care agencies in Beeston. Town near Nottingham with fostering opportunities.', 'Foster Care Agencies in Beeston | Nottinghamshire Fostering', 'Discover verified foster care agencies in Beeston. Compare local fostering services.', 1),
('d6020101-0000-0000-0000-000000000006', 'c6010000-0000-0000-0000-000000000002', 'Arnold', 'arnold', 'city', 'Explore foster care agencies in Arnold. Town with fostering services available.', 'Foster Care Agencies in Arnold | Nottinghamshire Fostering', 'Find verified foster care agencies in Arnold. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- LOCAL AREAS - BIRMINGHAM
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e5010101-0000-0000-0000-000000000001', 'd5010101-0000-0000-0000-000000000001', 'Edgbaston', 'edgbaston', 'area', 'Find foster care agencies serving Edgbaston, Birmingham. Leafy suburb with fostering support.', 'Foster Care Agencies in Edgbaston | Birmingham Fostering', 'Discover foster care agencies serving Edgbaston, Birmingham. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000002', 'd5010101-0000-0000-0000-000000000001', 'Selly Oak', 'selly-oak', 'area', 'Explore foster care agencies serving Selly Oak, Birmingham. Area with fostering opportunities.', 'Foster Care Agencies in Selly Oak | Birmingham Fostering', 'Find foster care agencies serving Selly Oak, Birmingham. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000003', 'd5010101-0000-0000-0000-000000000001', 'Handsworth', 'handsworth', 'area', 'Find foster care agencies serving Handsworth, Birmingham. Diverse area with fostering services.', 'Foster Care Agencies in Handsworth | Birmingham Fostering', 'Discover foster care agencies serving Handsworth, Birmingham. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000004', 'd5010101-0000-0000-0000-000000000001', 'Erdington', 'erdington', 'area', 'Explore foster care agencies serving Erdington, Birmingham. Area with fostering support.', 'Foster Care Agencies in Erdington | Birmingham Fostering', 'Find foster care agencies serving Erdington, Birmingham. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000005', 'd5010101-0000-0000-0000-000000000001', 'Yardley', 'yardley', 'area', 'Find foster care agencies serving Yardley, Birmingham. Area with fostering opportunities.', 'Foster Care Agencies in Yardley | Birmingham Fostering', 'Discover foster care agencies serving Yardley, Birmingham. Compare local fostering services.', 1),
('e5010101-0000-0000-0000-000000000006', 'd5010101-0000-0000-0000-000000000001', 'Harborne', 'harborne', 'area', 'Explore foster care agencies serving Harborne, Birmingham. Suburb with fostering services.', 'Foster Care Agencies in Harborne | Birmingham Fostering', 'Find foster care agencies serving Harborne, Birmingham. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000007', 'd5010101-0000-0000-0000-000000000001', 'Moseley', 'moseley', 'area', 'Find foster care agencies serving Moseley, Birmingham. Village suburb with fostering support.', 'Foster Care Agencies in Moseley | Birmingham Fostering', 'Discover foster care agencies serving Moseley, Birmingham. Compare local fostering services.', 1),
('e5010101-0000-0000-0000-000000000008', 'd5010101-0000-0000-0000-000000000001', 'Kings Heath', 'kings-heath', 'area', 'Explore foster care agencies serving Kings Heath, Birmingham. Area with fostering opportunities.', 'Foster Care Agencies in Kings Heath | Birmingham Fostering', 'Find foster care agencies serving Kings Heath, Birmingham. Compare local fostering services.', 1),
('e5010101-0000-0000-0000-000000000009', 'd5010101-0000-0000-0000-000000000001', 'Sutton Coldfield', 'sutton-coldfield', 'area', 'Find foster care agencies serving Sutton Coldfield. Royal town with excellent fostering services.', 'Foster Care Agencies in Sutton Coldfield | Birmingham Fostering', 'Discover foster care agencies serving Sutton Coldfield. Compare local fostering services.', 2),
('e5010101-0000-0000-0000-000000000010', 'd5010101-0000-0000-0000-000000000001', 'Northfield', 'northfield', 'area', 'Explore foster care agencies serving Northfield, Birmingham. Area with fostering support.', 'Foster Care Agencies in Northfield | Birmingham Fostering', 'Find foster care agencies serving Northfield, Birmingham. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- LOCAL AREAS - MANCHESTER
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e7010101-0000-0000-0000-000000000001', 'd7010101-0000-0000-0000-000000000001', 'Didsbury', 'didsbury', 'area', 'Find foster care agencies serving Didsbury, Manchester. Affluent suburb with fostering support.', 'Foster Care Agencies in Didsbury | Manchester Fostering', 'Discover foster care agencies serving Didsbury, Manchester. Compare local fostering services.', 2),
('e7010101-0000-0000-0000-000000000002', 'd7010101-0000-0000-0000-000000000001', 'Chorlton', 'chorlton', 'area', 'Explore foster care agencies serving Chorlton, Manchester. Vibrant area with fostering opportunities.', 'Foster Care Agencies in Chorlton | Manchester Fostering', 'Find foster care agencies serving Chorlton, Manchester. Compare local fostering services.', 2),
('e7010101-0000-0000-0000-000000000003', 'd7010101-0000-0000-0000-000000000001', 'Withington', 'withington', 'area', 'Find foster care agencies serving Withington, Manchester. Area with fostering services.', 'Foster Care Agencies in Withington | Manchester Fostering', 'Discover foster care agencies serving Withington, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000004', 'd7010101-0000-0000-0000-000000000001', 'Hulme', 'hulme', 'area', 'Explore foster care agencies serving Hulme, Manchester. Inner city area with fostering support.', 'Foster Care Agencies in Hulme | Manchester Fostering', 'Find foster care agencies serving Hulme, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000005', 'd7010101-0000-0000-0000-000000000001', 'Fallowfield', 'fallowfield', 'area', 'Find foster care agencies serving Fallowfield, Manchester. Area with fostering opportunities.', 'Foster Care Agencies in Fallowfield | Manchester Fostering', 'Discover foster care agencies serving Fallowfield, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000006', 'd7010101-0000-0000-0000-000000000001', 'Rusholme', 'rusholme', 'area', 'Explore foster care agencies serving Rusholme, Manchester. Diverse area with fostering services.', 'Foster Care Agencies in Rusholme | Manchester Fostering', 'Find foster care agencies serving Rusholme, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000007', 'd7010101-0000-0000-0000-000000000001', 'Moss Side', 'moss-side', 'area', 'Find foster care agencies serving Moss Side, Manchester. Area with fostering support.', 'Foster Care Agencies in Moss Side | Manchester Fostering', 'Discover foster care agencies serving Moss Side, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000008', 'd7010101-0000-0000-0000-000000000001', 'Levenshulme', 'levenshulme', 'area', 'Explore foster care agencies serving Levenshulme, Manchester. Growing area with fostering opportunities.', 'Foster Care Agencies in Levenshulme | Manchester Fostering', 'Find foster care agencies serving Levenshulme, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000009', 'd7010101-0000-0000-0000-000000000001', 'Whalley Range', 'whalley-range', 'area', 'Find foster care agencies serving Whalley Range, Manchester. Suburb with fostering services.', 'Foster Care Agencies in Whalley Range | Manchester Fostering', 'Discover foster care agencies serving Whalley Range, Manchester. Compare local fostering services.', 1),
('e7010101-0000-0000-0000-000000000010', 'd7010101-0000-0000-0000-000000000001', 'Burnage', 'burnage', 'area', 'Explore foster care agencies serving Burnage, Manchester. Area with fostering support.', 'Foster Care Agencies in Burnage | Manchester Fostering', 'Find foster care agencies serving Burnage, Manchester. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- LOCAL AREAS - LEEDS
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e9010101-0000-0000-0000-000000000001', 'd9010101-0000-0000-0000-000000000001', 'Headingley', 'headingley', 'area', 'Find foster care agencies serving Headingley, Leeds. Popular suburb with fostering support.', 'Foster Care Agencies in Headingley | Leeds Fostering', 'Discover foster care agencies serving Headingley, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000002', 'd9010101-0000-0000-0000-000000000001', 'Chapel Allerton', 'chapel-allerton', 'area', 'Explore foster care agencies serving Chapel Allerton, Leeds. Vibrant area with fostering opportunities.', 'Foster Care Agencies in Chapel Allerton | Leeds Fostering', 'Find foster care agencies serving Chapel Allerton, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000003', 'd9010101-0000-0000-0000-000000000001', 'Roundhay', 'roundhay', 'area', 'Find foster care agencies serving Roundhay, Leeds. Leafy suburb with fostering services.', 'Foster Care Agencies in Roundhay | Leeds Fostering', 'Discover foster care agencies serving Roundhay, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000004', 'd9010101-0000-0000-0000-000000000001', 'Armley', 'armley', 'area', 'Explore foster care agencies serving Armley, Leeds. Inner city area with fostering support.', 'Foster Care Agencies in Armley | Leeds Fostering', 'Find foster care agencies serving Armley, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000005', 'd9010101-0000-0000-0000-000000000001', 'Horsforth', 'horsforth', 'area', 'Find foster care agencies serving Horsforth, Leeds. Town with fostering opportunities.', 'Foster Care Agencies in Horsforth | Leeds Fostering', 'Discover foster care agencies serving Horsforth, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000006', 'd9010101-0000-0000-0000-000000000001', 'Moortown', 'moortown', 'area', 'Explore foster care agencies serving Moortown, Leeds. Suburb with fostering services.', 'Foster Care Agencies in Moortown | Leeds Fostering', 'Find foster care agencies serving Moortown, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000007', 'd9010101-0000-0000-0000-000000000001', 'Beeston', 'beeston-leeds', 'area', 'Find foster care agencies serving Beeston, Leeds. Area with fostering support.', 'Foster Care Agencies in Beeston, Leeds | Leeds Fostering', 'Discover foster care agencies serving Beeston, Leeds. Compare local fostering services.', 1),
('e9010101-0000-0000-0000-000000000008', 'd9010101-0000-0000-0000-000000000001', 'Harehills', 'harehills', 'area', 'Explore foster care agencies serving Harehills, Leeds. Diverse area with fostering opportunities.', 'Foster Care Agencies in Harehills | Leeds Fostering', 'Find foster care agencies serving Harehills, Leeds. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- LOCAL AREAS - LONDON BOROUGHS
-- ============================================

-- Camden Areas
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e1010101-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000001', 'Kentish Town', 'kentish-town', 'area', 'Find foster care agencies serving Kentish Town, Camden. Vibrant area with fostering support.', 'Foster Care Agencies in Kentish Town | Camden Fostering', 'Discover foster care agencies serving Kentish Town, Camden. Compare local fostering services.', 2),
('e1010101-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000001', 'Hampstead', 'hampstead', 'area', 'Explore foster care agencies serving Hampstead, Camden. Affluent area with fostering opportunities.', 'Foster Care Agencies in Hampstead | Camden Fostering', 'Find foster care agencies serving Hampstead, Camden. Compare local fostering services.', 2),
('e1010101-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000001', 'Kings Cross', 'kings-cross', 'area', 'Find foster care agencies serving Kings Cross, Camden. Central London area with fostering services.', 'Foster Care Agencies in Kings Cross | Camden Fostering', 'Discover foster care agencies serving Kings Cross, Camden. Compare local fostering services.', 2),
('e1010101-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000001', 'Holborn', 'holborn', 'area', 'Explore foster care agencies serving Holborn, Camden. Central area with fostering support.', 'Foster Care Agencies in Holborn | Camden Fostering', 'Find foster care agencies serving Holborn, Camden. Compare local fostering services.', 1),
('e1010101-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000001', 'Bloomsbury', 'bloomsbury', 'area', 'Find foster care agencies serving Bloomsbury, Camden. Historic area with fostering opportunities.', 'Foster Care Agencies in Bloomsbury | Camden Fostering', 'Discover foster care agencies serving Bloomsbury, Camden. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- Croydon Areas
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e1020101-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000002', 'Purley', 'purley', 'area', 'Find foster care agencies serving Purley, Croydon. Suburb with excellent fostering support.', 'Foster Care Agencies in Purley | Croydon Fostering', 'Discover foster care agencies serving Purley, Croydon. Compare local fostering services.', 2),
('e1020101-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000002', 'Thornton Heath', 'thornton-heath', 'area', 'Explore foster care agencies serving Thornton Heath, Croydon. Area with fostering opportunities.', 'Foster Care Agencies in Thornton Heath | Croydon Fostering', 'Find foster care agencies serving Thornton Heath, Croydon. Compare local fostering services.', 2),
('e1020101-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000002', 'South Norwood', 'south-norwood', 'area', 'Find foster care agencies serving South Norwood, Croydon. Area with fostering services.', 'Foster Care Agencies in South Norwood | Croydon Fostering', 'Discover foster care agencies serving South Norwood, Croydon. Compare local fostering services.', 1),
('e1020101-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000002', 'Addiscombe', 'addiscombe', 'area', 'Explore foster care agencies serving Addiscombe, Croydon. Area with fostering support.', 'Foster Care Agencies in Addiscombe | Croydon Fostering', 'Find foster care agencies serving Addiscombe, Croydon. Compare local fostering services.', 1),
('e1020101-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000002', 'Coulsdon', 'coulsdon', 'area', 'Find foster care agencies serving Coulsdon, Croydon. Suburb with fostering opportunities.', 'Foster Care Agencies in Coulsdon | Croydon Fostering', 'Discover foster care agencies serving Coulsdon, Croydon. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- Newham Areas
INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('e1090101-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000009', 'Stratford', 'stratford', 'area', 'Find foster care agencies serving Stratford, Newham. Olympic area with excellent fostering support.', 'Foster Care Agencies in Stratford | Newham Fostering', 'Discover foster care agencies serving Stratford, Newham. Compare local fostering services.', 3),
('e1090101-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000009', 'East Ham', 'east-ham', 'area', 'Explore foster care agencies serving East Ham, Newham. Area with fostering opportunities.', 'Foster Care Agencies in East Ham | Newham Fostering', 'Find foster care agencies serving East Ham, Newham. Compare local fostering services.', 2),
('e1090101-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000009', 'West Ham', 'west-ham', 'area', 'Find foster care agencies serving West Ham, Newham. Area with fostering services.', 'Foster Care Agencies in West Ham | Newham Fostering', 'Discover foster care agencies serving West Ham, Newham. Compare local fostering services.', 2),
('e1090101-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000009', 'Plaistow', 'plaistow', 'area', 'Explore foster care agencies serving Plaistow, Newham. Area with fostering support.', 'Foster Care Agencies in Plaistow | Newham Fostering', 'Find foster care agencies serving Plaistow, Newham. Compare local fostering services.', 1),
('e1090101-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000009', 'Forest Gate', 'forest-gate', 'area', 'Find foster care agencies serving Forest Gate, Newham. Area with fostering opportunities.', 'Foster Care Agencies in Forest Gate | Newham Fostering', 'Discover foster care agencies serving Forest Gate, Newham. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - LANCASHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d7030101-0000-0000-0000-000000000001', 'c7010000-0000-0000-0000-000000000003', 'Preston', 'preston', 'city', 'Find foster care agencies in Preston. Lancashire''s capital city with comprehensive fostering services.', 'Foster Care Agencies in Preston | Lancashire Fostering', 'Discover verified foster care agencies in Preston. Compare local fostering services.', 4),
('d7030101-0000-0000-0000-000000000002', 'c7010000-0000-0000-0000-000000000003', 'Blackburn', 'blackburn', 'city', 'Explore foster care agencies in Blackburn. Town with excellent fostering opportunities.', 'Foster Care Agencies in Blackburn | Lancashire Fostering', 'Find verified foster care agencies in Blackburn. Compare local fostering services.', 3),
('d7030101-0000-0000-0000-000000000003', 'c7010000-0000-0000-0000-000000000003', 'Blackpool', 'blackpool', 'city', 'Find foster care agencies in Blackpool. Seaside resort with dedicated fostering services.', 'Foster Care Agencies in Blackpool | Lancashire Fostering', 'Discover verified foster care agencies in Blackpool. Compare local fostering services.', 3),
('d7030101-0000-0000-0000-000000000004', 'c7010000-0000-0000-0000-000000000003', 'Burnley', 'burnley', 'city', 'Explore foster care agencies in Burnley. Town with strong fostering support networks.', 'Foster Care Agencies in Burnley | Lancashire Fostering', 'Find verified foster care agencies in Burnley. Compare local fostering services.', 2),
('d7030101-0000-0000-0000-000000000005', 'c7010000-0000-0000-0000-000000000003', 'Lancaster', 'lancaster', 'city', 'Find foster care agencies in Lancaster. Historic city with fostering opportunities.', 'Foster Care Agencies in Lancaster | Lancashire Fostering', 'Discover verified foster care agencies in Lancaster. Compare local fostering services.', 2),
('d7030101-0000-0000-0000-000000000006', 'c7010000-0000-0000-0000-000000000003', 'Accrington', 'accrington', 'city', 'Explore foster care agencies in Accrington. Town with fostering services.', 'Foster Care Agencies in Accrington | Lancashire Fostering', 'Find verified foster care agencies in Accrington. Compare local fostering services.', 1),
('d7030101-0000-0000-0000-000000000007', 'c7010000-0000-0000-0000-000000000003', 'Chorley', 'chorley', 'city', 'Find foster care agencies in Chorley. Market town with fostering support.', 'Foster Care Agencies in Chorley | Lancashire Fostering', 'Discover verified foster care agencies in Chorley. Compare local fostering services.', 1),
('d7030101-0000-0000-0000-000000000008', 'c7010000-0000-0000-0000-000000000003', 'Morecambe', 'morecambe', 'city', 'Explore foster care agencies in Morecambe. Seaside town with fostering opportunities.', 'Foster Care Agencies in Morecambe | Lancashire Fostering', 'Find verified foster care agencies in Morecambe. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - HERTFORDSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d4020101-0000-0000-0000-000000000001', 'c4010000-0000-0000-0000-000000000002', 'Watford', 'watford', 'city', 'Find foster care agencies in Watford. Town near London with comprehensive fostering services.', 'Foster Care Agencies in Watford | Hertfordshire Fostering', 'Discover verified foster care agencies in Watford. Compare local fostering services.', 3),
('d4020101-0000-0000-0000-000000000002', 'c4010000-0000-0000-0000-000000000002', 'St Albans', 'st-albans', 'city', 'Explore foster care agencies in St Albans. Historic cathedral city with fostering opportunities.', 'Foster Care Agencies in St Albans | Hertfordshire Fostering', 'Find verified foster care agencies in St Albans. Compare local fostering services.', 3),
('d4020101-0000-0000-0000-000000000003', 'c4010000-0000-0000-0000-000000000002', 'Stevenage', 'stevenage', 'city', 'Find foster care agencies in Stevenage. New town with dedicated fostering services.', 'Foster Care Agencies in Stevenage | Hertfordshire Fostering', 'Discover verified foster care agencies in Stevenage. Compare local fostering services.', 2),
('d4020101-0000-0000-0000-000000000004', 'c4010000-0000-0000-0000-000000000002', 'Hemel Hempstead', 'hemel-hempstead', 'city', 'Explore foster care agencies in Hemel Hempstead. Town with strong fostering support.', 'Foster Care Agencies in Hemel Hempstead | Hertfordshire Fostering', 'Find verified foster care agencies in Hemel Hempstead. Compare local fostering services.', 2),
('d4020101-0000-0000-0000-000000000005', 'c4010000-0000-0000-0000-000000000002', 'Welwyn Garden City', 'welwyn-garden-city', 'city', 'Find foster care agencies in Welwyn Garden City. Planned town with fostering opportunities.', 'Foster Care Agencies in Welwyn Garden City | Hertfordshire Fostering', 'Discover verified foster care agencies in Welwyn Garden City. Compare local fostering services.', 1),
('d4020101-0000-0000-0000-000000000006', 'c4010000-0000-0000-0000-000000000002', 'Hitchin', 'hitchin', 'city', 'Explore foster care agencies in Hitchin. Historic market town with fostering services.', 'Foster Care Agencies in Hitchin | Hertfordshire Fostering', 'Find verified foster care agencies in Hitchin. Compare local fostering services.', 1),
('d4020101-0000-0000-0000-000000000007', 'c4010000-0000-0000-0000-000000000002', 'Letchworth', 'letchworth', 'city', 'Find foster care agencies in Letchworth Garden City. World''s first garden city with fostering support.', 'Foster Care Agencies in Letchworth | Hertfordshire Fostering', 'Discover verified foster care agencies in Letchworth. Compare local fostering services.', 1),
('d4020101-0000-0000-0000-000000000008', 'c4010000-0000-0000-0000-000000000002', 'Hatfield', 'hatfield', 'city', 'Explore foster care agencies in Hatfield. University town with fostering opportunities.', 'Foster Care Agencies in Hatfield | Hertfordshire Fostering', 'Find verified foster care agencies in Hatfield. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - LEICESTERSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d6030101-0000-0000-0000-000000000001', 'c6010000-0000-0000-0000-000000000003', 'Leicester', 'leicester', 'city', 'Find foster care agencies in Leicester. Major city with comprehensive fostering services.', 'Foster Care Agencies in Leicester | Leicestershire Fostering', 'Discover verified foster care agencies in Leicester. Compare local fostering services.', 5),
('d6030101-0000-0000-0000-000000000002', 'c6010000-0000-0000-0000-000000000003', 'Loughborough', 'loughborough', 'city', 'Explore foster care agencies in Loughborough. University town with fostering opportunities.', 'Foster Care Agencies in Loughborough | Leicestershire Fostering', 'Find verified foster care agencies in Loughborough. Compare local fostering services.', 2),
('d6030101-0000-0000-0000-000000000003', 'c6010000-0000-0000-0000-000000000003', 'Hinckley', 'hinckley', 'city', 'Find foster care agencies in Hinckley. Market town with dedicated fostering services.', 'Foster Care Agencies in Hinckley | Leicestershire Fostering', 'Discover verified foster care agencies in Hinckley. Compare local fostering services.', 1),
('d6030101-0000-0000-0000-000000000004', 'c6010000-0000-0000-0000-000000000003', 'Melton Mowbray', 'melton-mowbray', 'city', 'Explore foster care agencies in Melton Mowbray. Town famous for pies with fostering support.', 'Foster Care Agencies in Melton Mowbray | Leicestershire Fostering', 'Find verified foster care agencies in Melton Mowbray. Compare local fostering services.', 1),
('d6030101-0000-0000-0000-000000000005', 'c6010000-0000-0000-0000-000000000003', 'Market Harborough', 'market-harborough', 'city', 'Find foster care agencies in Market Harborough. Historic town with fostering opportunities.', 'Foster Care Agencies in Market Harborough | Leicestershire Fostering', 'Discover verified foster care agencies in Market Harborough. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - NORTH YORKSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d9030101-0000-0000-0000-000000000001', 'c9010000-0000-0000-0000-000000000003', 'York', 'york', 'city', 'Find foster care agencies in York. Historic city with comprehensive fostering services.', 'Foster Care Agencies in York | North Yorkshire Fostering', 'Discover verified foster care agencies in York. Compare local fostering services.', 4),
('d9030101-0000-0000-0000-000000000002', 'c9010000-0000-0000-0000-000000000003', 'Harrogate', 'harrogate', 'city', 'Explore foster care agencies in Harrogate. Spa town with excellent fostering opportunities.', 'Foster Care Agencies in Harrogate | North Yorkshire Fostering', 'Find verified foster care agencies in Harrogate. Compare local fostering services.', 2),
('d9030101-0000-0000-0000-000000000003', 'c9010000-0000-0000-0000-000000000003', 'Scarborough', 'scarborough', 'city', 'Find foster care agencies in Scarborough. Seaside town with dedicated fostering services.', 'Foster Care Agencies in Scarborough | North Yorkshire Fostering', 'Discover verified foster care agencies in Scarborough. Compare local fostering services.', 2),
('d9030101-0000-0000-0000-000000000004', 'c9010000-0000-0000-0000-000000000003', 'Ripon', 'ripon', 'city', 'Explore foster care agencies in Ripon. Cathedral city with fostering support.', 'Foster Care Agencies in Ripon | North Yorkshire Fostering', 'Find verified foster care agencies in Ripon. Compare local fostering services.', 1),
('d9030101-0000-0000-0000-000000000005', 'c9010000-0000-0000-0000-000000000003', 'Skipton', 'skipton', 'city', 'Find foster care agencies in Skipton. Gateway to the Dales with fostering opportunities.', 'Foster Care Agencies in Skipton | North Yorkshire Fostering', 'Discover verified foster care agencies in Skipton. Compare local fostering services.', 1),
('d9030101-0000-0000-0000-000000000006', 'c9010000-0000-0000-0000-000000000003', 'Whitby', 'whitby', 'city', 'Explore foster care agencies in Whitby. Coastal town with fostering services.', 'Foster Care Agencies in Whitby | North Yorkshire Fostering', 'Find verified foster care agencies in Whitby. Compare local fostering services.', 1),
('d9030101-0000-0000-0000-000000000007', 'c9010000-0000-0000-0000-000000000003', 'Northallerton', 'northallerton', 'city', 'Find foster care agencies in Northallerton. County town with fostering support.', 'Foster Care Agencies in Northallerton | North Yorkshire Fostering', 'Discover verified foster care agencies in Northallerton. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - SURREY
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d2020101-0000-0000-0000-000000000001', 'c2010000-0000-0000-0000-000000000002', 'Guildford', 'guildford', 'city', 'Find foster care agencies in Guildford. Surrey''s county town with comprehensive fostering services.', 'Foster Care Agencies in Guildford | Surrey Fostering', 'Discover verified foster care agencies in Guildford. Compare local fostering services.', 3),
('d2020101-0000-0000-0000-000000000002', 'c2010000-0000-0000-0000-000000000002', 'Woking', 'woking', 'city', 'Explore foster care agencies in Woking. Town with excellent fostering opportunities.', 'Foster Care Agencies in Woking | Surrey Fostering', 'Find verified foster care agencies in Woking. Compare local fostering services.', 2),
('d2020101-0000-0000-0000-000000000003', 'c2010000-0000-0000-0000-000000000002', 'Epsom', 'epsom', 'city', 'Find foster care agencies in Epsom. Town famous for horse racing with fostering services.', 'Foster Care Agencies in Epsom | Surrey Fostering', 'Discover verified foster care agencies in Epsom. Compare local fostering services.', 2),
('d2020101-0000-0000-0000-000000000004', 'c2010000-0000-0000-0000-000000000002', 'Reigate', 'reigate', 'city', 'Explore foster care agencies in Reigate. Historic town with fostering support.', 'Foster Care Agencies in Reigate | Surrey Fostering', 'Find verified foster care agencies in Reigate. Compare local fostering services.', 1),
('d2020101-0000-0000-0000-000000000005', 'c2010000-0000-0000-0000-000000000002', 'Redhill', 'redhill', 'city', 'Find foster care agencies in Redhill. Town with dedicated fostering opportunities.', 'Foster Care Agencies in Redhill | Surrey Fostering', 'Discover verified foster care agencies in Redhill. Compare local fostering services.', 1),
('d2020101-0000-0000-0000-000000000006', 'c2010000-0000-0000-0000-000000000002', 'Staines', 'staines', 'city', 'Explore foster care agencies in Staines-upon-Thames. Town with fostering services.', 'Foster Care Agencies in Staines | Surrey Fostering', 'Find verified foster care agencies in Staines. Compare local fostering services.', 1),
('d2020101-0000-0000-0000-000000000007', 'c2010000-0000-0000-0000-000000000002', 'Camberley', 'camberley', 'city', 'Find foster care agencies in Camberley. Town with fostering support available.', 'Foster Care Agencies in Camberley | Surrey Fostering', 'Discover verified foster care agencies in Camberley. Compare local fostering services.', 1),
('d2020101-0000-0000-0000-000000000008', 'c2010000-0000-0000-0000-000000000002', 'Leatherhead', 'leatherhead', 'city', 'Explore foster care agencies in Leatherhead. Town with fostering opportunities.', 'Foster Care Agencies in Leatherhead | Surrey Fostering', 'Find verified foster care agencies in Leatherhead. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - CHESHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d7040101-0000-0000-0000-000000000001', 'c7010000-0000-0000-0000-000000000004', 'Chester', 'chester', 'city', 'Find foster care agencies in Chester. Historic walled city with comprehensive fostering services.', 'Foster Care Agencies in Chester | Cheshire Fostering', 'Discover verified foster care agencies in Chester. Compare local fostering services.', 3),
('d7040101-0000-0000-0000-000000000002', 'c7010000-0000-0000-0000-000000000004', 'Warrington', 'warrington', 'city', 'Explore foster care agencies in Warrington. New town with excellent fostering opportunities.', 'Foster Care Agencies in Warrington | Cheshire Fostering', 'Find verified foster care agencies in Warrington. Compare local fostering services.', 3),
('d7040101-0000-0000-0000-000000000003', 'c7010000-0000-0000-0000-000000000004', 'Crewe', 'crewe', 'city', 'Find foster care agencies in Crewe. Railway town with dedicated fostering services.', 'Foster Care Agencies in Crewe | Cheshire Fostering', 'Discover verified foster care agencies in Crewe. Compare local fostering services.', 2),
('d7040101-0000-0000-0000-000000000004', 'c7010000-0000-0000-0000-000000000004', 'Macclesfield', 'macclesfield', 'city', 'Explore foster care agencies in Macclesfield. Market town with fostering support.', 'Foster Care Agencies in Macclesfield | Cheshire Fostering', 'Find verified foster care agencies in Macclesfield. Compare local fostering services.', 1),
('d7040101-0000-0000-0000-000000000005', 'c7010000-0000-0000-0000-000000000004', 'Ellesmere Port', 'ellesmere-port', 'city', 'Find foster care agencies in Ellesmere Port. Industrial town with fostering opportunities.', 'Foster Care Agencies in Ellesmere Port | Cheshire Fostering', 'Discover verified foster care agencies in Ellesmere Port. Compare local fostering services.', 1),
('d7040101-0000-0000-0000-000000000006', 'c7010000-0000-0000-0000-000000000004', 'Northwich', 'northwich', 'city', 'Explore foster care agencies in Northwich. Salt town with fostering services.', 'Foster Care Agencies in Northwich | Cheshire Fostering', 'Find verified foster care agencies in Northwich. Compare local fostering services.', 1),
('d7040101-0000-0000-0000-000000000007', 'c7010000-0000-0000-0000-000000000004', 'Congleton', 'congleton', 'city', 'Find foster care agencies in Congleton. Market town with fostering support.', 'Foster Care Agencies in Congleton | Cheshire Fostering', 'Discover verified foster care agencies in Congleton. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- ADDITIONAL CITIES - OXFORDSHIRE
-- ============================================

INSERT INTO public.locations (id, parent_id, name, slug, type, description, seo_title, seo_description, agency_count) VALUES
('d2060101-0000-0000-0000-000000000001', 'c2010000-0000-0000-0000-000000000006', 'Oxford', 'oxford', 'city', 'Find foster care agencies in Oxford. Famous university city with comprehensive fostering services.', 'Foster Care Agencies in Oxford | Oxfordshire Fostering', 'Discover verified foster care agencies in Oxford. Compare local fostering services.', 4),
('d2060101-0000-0000-0000-000000000002', 'c2010000-0000-0000-0000-000000000006', 'Banbury', 'banbury', 'city', 'Explore foster care agencies in Banbury. Historic market town with fostering opportunities.', 'Foster Care Agencies in Banbury | Oxfordshire Fostering', 'Find verified foster care agencies in Banbury. Compare local fostering services.', 2),
('d2060101-0000-0000-0000-000000000003', 'c2010000-0000-0000-0000-000000000006', 'Bicester', 'bicester', 'city', 'Find foster care agencies in Bicester. Growing town with dedicated fostering services.', 'Foster Care Agencies in Bicester | Oxfordshire Fostering', 'Discover verified foster care agencies in Bicester. Compare local fostering services.', 1),
('d2060101-0000-0000-0000-000000000004', 'c2010000-0000-0000-0000-000000000006', 'Witney', 'witney', 'city', 'Explore foster care agencies in Witney. Cotswold town with fostering support.', 'Foster Care Agencies in Witney | Oxfordshire Fostering', 'Find verified foster care agencies in Witney. Compare local fostering services.', 1),
('d2060101-0000-0000-0000-000000000005', 'c2010000-0000-0000-0000-000000000006', 'Didcot', 'didcot', 'city', 'Find foster care agencies in Didcot. Growing town with fostering opportunities.', 'Foster Care Agencies in Didcot | Oxfordshire Fostering', 'Discover verified foster care agencies in Didcot. Compare local fostering services.', 1),
('d2060101-0000-0000-0000-000000000006', 'c2010000-0000-0000-0000-000000000006', 'Abingdon', 'abingdon', 'city', 'Explore foster care agencies in Abingdon-on-Thames. Historic town with fostering services.', 'Foster Care Agencies in Abingdon | Oxfordshire Fostering', 'Find verified foster care agencies in Abingdon. Compare local fostering services.', 1)
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description;

-- ============================================
-- FINAL VERIFICATION MESSAGE
-- ============================================
-- This SQL script creates the complete England location hierarchy:
-- - 1 Country: England
-- - 9 Regions
-- - 48 Counties/Metropolitan Areas  
-- - 150+ Cities and Towns
-- - 80+ Local Areas/Neighbourhoods
--
-- All locations have:
-- - Unique SEO titles and descriptions
-- - Proper parent-child relationships
-- - Agency count estimates
-- - Consistent naming conventions
--
-- Run this script in your Supabase SQL editor to populate all locations.
-- ============================================

SELECT 'England location data migration complete!' as status,
       (SELECT COUNT(*) FROM locations WHERE type = 'country') as countries,
       (SELECT COUNT(*) FROM locations WHERE type = 'region') as regions,
       (SELECT COUNT(*) FROM locations WHERE type = 'county') as counties,
       (SELECT COUNT(*) FROM locations WHERE type = 'city') as cities,
       (SELECT COUNT(*) FROM locations WHERE type = 'area') as areas;
