-- Service Pages SQL for Supabase Dashboard
-- Copy and run each INSERT statement separately

-- 1. Short-Term Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/short-term',
  'Short-Term Fostering in England',
  '{"title":"Short-Term Fostering in England","intro":{"paragraphs":["Short-term fostering provides temporary care for children who need a safe home while longer-term plans are made."]},"what_is_it":{"heading":"What is Short-Term Fostering?","paragraphs":["Short-term fostering involves caring for a child for a limited period while assessments are completed or longer-term plans are arranged."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Short-term fostering is ideal for flexible individuals or families with a spare bedroom."]},"requirements":{"heading":"Requirements","paragraphs":["Must be over 21 with a spare bedroom, undergo background checks."]},"benefits":{"heading":"Benefits","paragraphs":["Flexible commitment, training provided, financial allowances."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Home Visit","description":"Social worker assesses suitability"},{"name":"Assessment","description":"Complete training and Form F"},{"name":"Approval","description":"Panel decision"}]},"support":{"heading":"Support","paragraphs":["24/7 support, dedicated social worker, training."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Make a Difference","paragraph":"Start your fostering journey today.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- 2. Long-Term Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/long-term',
  'Long-Term Fostering in England',
  '{"title":"Long-Term Fostering in England","intro":{"paragraphs":["Long-term fostering provides stable homes for children who cannot return to their birth family until adulthood."]},"what_is_it":{"heading":"What is Long-Term Fostering?","paragraphs":["Long-term fostering is for children who need a permanent home but are unable to live with their birth family."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Patient, committed individuals or couples who can offer a stable home environment."]},"requirements":{"heading":"Requirements","paragraphs":["Must be over 21 with a spare bedroom, complete assessment."]},"benefits":{"heading":"Rewards","paragraphs":["Build lasting relationships, comprehensive support, financial allowances."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Home Visit","description":"Social worker assesses suitability"},{"name":"Assessment","description":"Complete training and Form F"},{"name":"Approval","description":"Panel decision"}]},"support":{"heading":"Support","paragraphs":["Dedicated social worker, regular supervision, training."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Provide Stability","paragraph":"Give a child a forever home.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- 3. Emergency Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/emergency',
  'Emergency Fostering in England',
  '{"title":"Emergency Fostering in England","intro":{"paragraphs":["Emergency fostering provides immediate, same-day placements for children who need urgent care due to unexpected circumstances."]},"what_is_it":{"heading":"What is Emergency Fostering?","paragraphs":["Emergency foster carers provide immediate, short-notice care for children who need a safe place urgently."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Flexible people available at short notice with a spare bedroom."]},"requirements":{"heading":"Requirements","paragraphs":["Flexible availability, spare bedroom ready at short notice."]},"benefits":{"heading":"Benefits","paragraphs":["Play a crucial role, higher allowances, full support."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Assessment","description":"Complete the assessment process"},{"name":"Training","description":"Receive emergency-specific training"},{"name":"Approval","description":"Be approved for emergency placements"}]},"support":{"heading":"Support","paragraphs":["24/7 on-call support, immediate guidance."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Help Children in Crisis","paragraph":"Make an immediate difference.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- 4. Respite Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/respite',
  'Respite Fostering in England',
  '{"title":"Respite Fostering in England","intro":{"paragraphs":["Respite fostering provides short breaks for children and their main foster families."]},"what_is_it":{"heading":"What is Respite Fostering?","paragraphs":["Respite foster care involves looking after a child for short periods to give the main family a break."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Ideal for those who want to help but cannot commit to full-time care."]},"requirements":{"heading":"Requirements","paragraphs":["Spare bedroom for planned breaks, good communication."]},"benefits":{"heading":"Benefits","paragraphs":["Flexible commitment, make a difference, financial allowances."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Assessment","description":"Complete the assessment process"},{"name":"Training","description":"Receive preparation training"},{"name":"Approval","description":"Become an approved respite foster carrier"}]},"support":{"heading":"Support","paragraphs":["Full training and guidance, support from agency."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Support Families","paragraph":"Help maintain stable placements.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- 5. Parent & Child Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/parent-child',
  'Parent & Child Fostering in England',
  '{"title":"Parent & Child Fostering in England","intro":{"paragraphs":["Parent and child fostering supports a parent and their child to live together in a supportive family environment."]},"what_is_it":{"heading":"What is Parent & Child Fostering?","paragraphs":["The foster carrier provides guidance, supervision, and practical help to the parent."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Experienced fosterers with patience and excellent communication skills."]},"requirements":{"heading":"Requirements","paragraphs":["Prior fostering experience recommended, additional training required."]},"benefits":{"heading":"Rewards","paragraphs":["Help a parent build skills, competitive allowances, comprehensive support."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Experience","description":"Most agencies require prior fostering experience"},{"name":"Training","description":"Complete specialised training"},{"name":"Approval","description":"Get approved for parent & child placements"}]},"support":{"heading":"Support","paragraphs":["Regular supervision, training in parenting programmes."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Build Family Stability","paragraph":"Transform lives through support.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();

-- 6. Therapeutic Fostering
INSERT INTO location_content (slug, title, content) 
VALUES (
  'england/therapeutic',
  'Therapeutic Fostering in England',
  '{"title":"Therapeutic Fostering in England","intro":{"paragraphs":["Therapeutic fostering provides specialist care for children with complex emotional, behavioural, or developmental needs."]},"what_is_it":{"heading":"What is Therapeutic Fostering?","paragraphs":["For children who have experienced trauma and need a therapeutic approach to develop healthy relationships."]},"who_is_it_for":{"heading":"Who Can Foster?","paragraphs":["Patient, understanding individuals who can provide consistent, trauma-informed care."]},"requirements":{"heading":"Requirements","paragraphs":["Additional training in therapeutic approaches, ability to work with mental health professionals."]},"benefits":{"heading":"Benefits","paragraphs":["Transform a child life, highest allowances, extensive training."]},"process":{"heading":"How to Become","steps":[{"name":"Enquiry","description":"Contact an agency"},{"name":"Assessment","description":"Complete detailed assessment"},{"name":"Training","description":"Undergo therapeutic care training"},{"name":"Approval","description":"Get approved with therapeutic specialism"}]},"support":{"heading":"Support","paragraphs":["Therapeutic consultations, 24/7 crisis support, CAMHS collaboration."]},"agencies":{"heading":"Find Agencies","paragraph":"Browse our directory."},"cta":{"heading":"Help Children Heal","paragraph":"Provide the specialised care vulnerable children need.","button_text":"Find an Agency"}}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW();
