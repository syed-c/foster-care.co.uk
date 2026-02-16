import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any;

// GET: Fetch all data needed by the CMS admin page
export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    // Use untyped reference to avoid Supabase strict types blocking admin operations
    const db: AnyDB = supabase;

    try {
        if (action === 'locations') {
            const { data, error } = await db
                .from('locations')
                .select('id, name, slug, type, parent_id')
                .order('type')
                .order('name');
            if (error) throw error;
            return NextResponse.json({ data });
        }

        if (action === 'blocks') {
            const pageKey = searchParams.get('page_key');
            try {
                let query = db
                    .from('page_content_blocks')
                    .select('*')
                    .order('page_key')
                    .order('display_order');

                if (pageKey) {
                    query = query.eq('page_key', pageKey);
                }

                const { data, error } = await query;
                if (error) throw error;
                return NextResponse.json({ data });
            } catch {
                // Table may not exist yet
                return NextResponse.json({ data: [] });
            }
        }

        if (action === 'faqs') {
            const pageKey = searchParams.get('page_key');
            try {
                let query = db
                    .from('faqs')
                    .select('*')
                    .order('display_order');

                if (pageKey) {
                    query = query.eq('page_key', pageKey);
                }

                const { data, error } = await query;
                if (error) throw error;
                return NextResponse.json({ data });
            } catch {
                return NextResponse.json({ data: [] });
            }
        }

        // Default: return all data
        const locationsRes = await db.from('locations').select('id, name, slug, type, parent_id').order('type').order('name');

        let blocksData: AnyDB[] = [];
        try {
            const blocksRes = await db.from('page_content_blocks').select('*').order('page_key').order('display_order');
            blocksData = blocksRes.data || [];
        } catch {
            // Table may not exist yet — that's OK
        }

        return NextResponse.json({
            locations: locationsRes.data || [],
            blocks: blocksData,
        });
    } catch (error: AnyDB) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create or update content blocks and FAQs
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db: AnyDB = supabase;

    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'save_block') {
            const { block } = body;
            if (block.id) {
                const { id, created_at, ...updateData } = block;
                const { data, error } = await db
                    .from('page_content_blocks')
                    .update({ ...updateData, updated_at: new Date().toISOString() })
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ data });
            } else {
                const { id, created_at, updated_at, ...insertData } = block;
                const { data, error } = await db
                    .from('page_content_blocks')
                    .insert(insertData)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ data });
            }
        }

        if (action === 'delete_block') {
            const { id } = body;
            const { error } = await db
                .from('page_content_blocks')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'save_faq') {
            const { faq } = body;
            if (faq.id) {
                const { id, created_at, ...updateData } = faq;
                const { data, error } = await db
                    .from('faqs')
                    .update(updateData)
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ data });
            } else {
                const { id, ...insertData } = faq;
                const { data, error } = await db
                    .from('faqs')
                    .insert(insertData)
                    .select()
                    .single();
                if (error) throw error;
                return NextResponse.json({ data });
            }
        }

        if (action === 'delete_faq') {
            const { id } = body;
            const { error } = await db
                .from('faqs')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'seed_blocks') {
            const { page_key, page_type } = body;

            // Try to find location name if page_key starts with loc_
            let locationName = "Your Location";
            if (page_key.startsWith('loc_')) {
                const slug = page_key.replace('loc_', '');
                const { data: loc } = await db.from('locations').select('name').eq('slug', slug).single();
                if (loc) locationName = loc.name;
            } else {
                // Formatting "become-a-foster" -> "Become A Foster"
                locationName = page_key.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            }

            const defaultBlocks = getDefaultBlocks(page_key, page_type, locationName);

            const { data: existing } = await db
                .from('page_content_blocks')
                .select('block_key')
                .eq('page_key', page_key);

            const existingKeys = new Set((existing || []).map((b: AnyDB) => b.block_key));
            const newBlocks = defaultBlocks.filter((b: AnyDB) => !existingKeys.has(b.block_key));

            if (newBlocks.length > 0) {
                const { error } = await db
                    .from('page_content_blocks')
                    .insert(newBlocks);
                if (error) throw error;
            }

            // Seed FAQs
            const defaultFaqs = getDefaultFaqs(page_key, page_type, locationName);
            let seededFaqsCount = 0;

            if (defaultFaqs.length > 0) {
                const { data: existingFaqs } = await db
                    .from('faqs')
                    .select('question')
                    .eq('page_key', page_key);

                const existingQuestions = new Set((existingFaqs || []).map((f: AnyDB) => f.question));
                const newFaqs = defaultFaqs.filter((f: AnyDB) => !existingQuestions.has(f.question));

                if (newFaqs.length > 0) {
                    const { error } = await db
                        .from('faqs')
                        .insert(newFaqs);
                    if (error) throw error;
                    seededFaqsCount = newFaqs.length;
                }
            }

            return NextResponse.json({
                seeded_blocks: newBlocks.length,
                seeded_faqs: seededFaqsCount,
                message: `Generated ${newBlocks.length} blocks and ${seededFaqsCount} FAQs`
            });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (error: AnyDB) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getDefaultBlocks(pageKey: string, pageType: string, name: string) {
    const base = [
        { page_key: pageKey, block_key: 'hero_badge', block_type: 'hero', title: 'Hero Badge', content: 'National Fostering Excellence', metadata: {}, display_order: 1, is_active: true },
        { page_key: pageKey, block_key: 'hero_title', block_type: 'hero', title: 'Hero Title', content: `Fostering in ${name}`, metadata: {}, display_order: 2, is_active: true },
        { page_key: pageKey, block_key: 'hero_subtitle', block_type: 'hero', title: 'Hero Subtitle', content: `Help us transform lives. Discover the rewards of fostering and join ${name}'s largest network of approved agencies.`, metadata: {}, display_order: 3, is_active: true },
        { page_key: pageKey, block_key: 'hero_cta', block_type: 'cta', title: 'Hero Primary CTA', content: 'Start Your Journey', metadata: { cta_text: 'Start Your Journey', cta_url: '/become-a-foster' }, display_order: 4, is_active: true },
        { page_key: pageKey, block_key: 'hero_secondary_cta', block_type: 'cta', title: 'Hero Secondary CTA', content: 'View Local Agencies', metadata: { cta_text: 'View Local Agencies', cta_url: '#agencies' }, display_order: 5, is_active: true },
    ];

    if (pageType === 'country') {
        return [
            ...base,
            { page_key: pageKey, block_key: 'why_foster_content', block_type: 'text', title: 'Why Foster Content', content: `<p>Fostering in ${name} is more than just providing a bed; it's about offering stability, safety, and a future to children who need it most.</p><p>By choosing to foster here, you are joining a world-class network of support.</p>`, metadata: {}, display_order: 10, is_active: true },
            { page_key: pageKey, block_key: 'why_foster_image', block_type: 'image', title: 'Why Foster Image', content: '', metadata: { url: '/images/locations/england-hero.png', alt: `Fostering in ${name}` }, display_order: 11, is_active: true },

            // Agency Types
            { page_key: pageKey, block_key: 'agency_types_title', block_type: 'text', title: 'Agency Types Title', content: 'Independent and Local Authority Fostering Agencies', metadata: {}, display_order: 12, is_active: true },
            { page_key: pageKey, block_key: 'agency_types_intro', block_type: 'text', title: 'Agency Types Intro', content: `When exploring your options, you’ll notice that fostering support in ${name} comes from two main paths. Each one offers something unique, and the goal is simply to find the path that feels right for you.`, metadata: {}, display_order: 13, is_active: true },
            { page_key: pageKey, block_key: 'ifa_card_title', block_type: 'text', title: 'IFA Card Title', content: 'Independent Fostering Agencies', metadata: {}, display_order: 14, is_active: true },
            { page_key: pageKey, block_key: 'ifa_card_content', block_type: 'text', title: 'IFA Card Content', content: `<p class="mb-4">Independent agencies (often called IFAs) operate separately from local councils. Many IFAs offer:</p><ul class="space-y-4"><li>Stronger day-to-day support</li><li>Specialist placements</li><li>Therapeutic training</li><li>24/7 help</li><li>A close-knit carer community</li></ul>`, metadata: {}, display_order: 15, is_active: true },
            { page_key: pageKey, block_key: 'la_card_title', block_type: 'text', title: 'LA Card Title', content: 'Local Authority Fostering', metadata: {}, display_order: 16, is_active: true },
            { page_key: pageKey, block_key: 'la_card_content', block_type: 'text', title: 'LA Card Content', content: `<p class="mb-4">Local authorities recruit and support carers directly. Some people choose councils because:</p><ul class="space-y-4"><li>Placements may be closer to children’s home areas</li><li>They want direct involvement with children’s services</li><li>They prefer council-led support systems</li></ul>`, metadata: {}, display_order: 17, is_active: true },
            { page_key: pageKey, block_key: 'agency_types_closing', block_type: 'text', title: 'Agency Types Closing', content: 'Both independent agencies and local authorities play important roles. What matters is choosing the one that feels comfortable and supportive for your home.', metadata: {}, display_order: 18, is_active: true },

            // Types of Fostering
            { page_key: pageKey, block_key: 'types_title', block_type: 'text', title: 'Types Title', content: `Types of Fostering in ${name}`, metadata: {}, display_order: 19, is_active: true },
            { page_key: pageKey, block_key: 'types_intro', block_type: 'text', title: 'Types Intro', content: 'Fostering needs vary across the country. Different children require different types of care, and each type lets you use your strengths in a meaningful way.', metadata: {}, display_order: 20, is_active: true },

            // Process (Updated)
            { page_key: pageKey, block_key: 'process_title', block_type: 'text', title: 'Process Section Title', content: `How to Become a Foster Carer in ${name}`, metadata: {}, display_order: 30, is_active: true },
            { page_key: pageKey, block_key: 'process_intro', block_type: 'text', title: 'Process Intro', content: 'Becoming a foster carer is not about qualifications, it’s about compassion, stability, and the willingness to learn. Agencies guide you through a respectful and clear approval journey.', metadata: {}, display_order: 31, is_active: true },
            { page_key: pageKey, block_key: 'process_closing', block_type: 'text', title: 'Process Closing', content: 'You’re supported through every step. No one expects you to figure things out alone.', metadata: {}, display_order: 32, is_active: true },
            { page_key: pageKey, block_key: 'is_right_content', block_type: 'text', title: 'Is Fostering Right Content', content: `<p>Becoming a foster carer is a significant lifestyle change. It's natural to have questions about how it will affect your family, your work, and your daily routine.</p>`, metadata: {}, display_order: 33, is_active: true },

            // Ofsted
            { page_key: pageKey, block_key: 'ofsted_title', block_type: 'text', title: 'Ofsted Title', content: `Ofsted-Rated Fostering Agencies in ${name}`, metadata: {}, display_order: 40, is_active: true },
            { page_key: pageKey, block_key: 'ofsted_intro', block_type: 'text', title: 'Ofsted Intro', content: `Ofsted inspects and rates fostering agencies across ${name}. These ratings help you understand quality of support, safeguarding standards, leadership, and outcomes for children.`, metadata: {}, display_order: 41, is_active: true },
            { page_key: pageKey, block_key: 'ofsted_note', block_type: 'text', title: 'Ofsted Note', content: 'Every agency listed on our platform includes clear information about their most recent Ofsted rating so you can make confident, informed decisions.', metadata: {}, display_order: 42, is_active: true },

            // Support
            { page_key: pageKey, block_key: 'support_title', block_type: 'text', title: 'Support Title', content: `Support for Foster Carers in ${name}`, metadata: {}, display_order: 50, is_active: true },
            { page_key: pageKey, block_key: 'support_intro', block_type: 'text', title: 'Support Intro', content: 'Strong support makes fostering sustainable and rewarding. Agencies usually provide a mix of emotional, practical, and financial help.', metadata: {}, display_order: 51, is_active: true },

            // Regions
            { page_key: pageKey, block_key: 'regions_title', block_type: 'text', title: 'Regions Title', content: `Fostering Across Regions in ${name}`, metadata: {}, display_order: 60, is_active: true },
            { page_key: pageKey, block_key: 'regions_intro', block_type: 'text', title: 'Regions Intro', content: 'Each region has its own fostering needs and agency networks. You can explore fostering opportunities in:', metadata: {}, display_order: 61, is_active: true },

            // Guide
            { page_key: pageKey, block_key: 'guide_title', block_type: 'text', title: 'Guide Title', content: `Who This ${name} Fostering Guide Is For`, metadata: {}, display_order: 70, is_active: true },
            { page_key: pageKey, block_key: 'guide_intro', block_type: 'text', title: 'Guide Intro', content: 'This guide supports anyone exploring foster care, from first-time carers to families comparing agencies. No pressure. No rushing. Just helpful, grounded information.', metadata: {}, display_order: 71, is_active: true },

            // Glossary
            { page_key: pageKey, block_key: 'glossary_title', block_type: 'text', title: 'Glossary Title', content: `${name} Foster Care Glossary`, metadata: {}, display_order: 80, is_active: true },
            { page_key: pageKey, block_key: 'glossary_intro', block_type: 'text', title: 'Glossary Intro', content: 'A few simple terms to keep things clear:', metadata: {}, display_order: 81, is_active: true },

            // FAQ
            { page_key: pageKey, block_key: 'faq_title', block_type: 'text', title: 'FAQ Title', content: `${name} Foster Care FAQ`, metadata: {}, display_order: 90, is_active: true },

            // Safeguarding
            { page_key: pageKey, block_key: 'safeguarding_title', block_type: 'text', title: 'Safeguarding Title', content: 'Safeguarding and Responsibility', metadata: {}, display_order: 100, is_active: true },
            { page_key: pageKey, block_key: 'safeguarding_content', block_type: 'text', title: 'Safeguarding Content', content: 'We are an independent information platform that helps families explore fostering options. We do not approve carers or place children. All agencies listed must meet current Ofsted standards and follow UK fostering regulations. Your safety, and each child’s safety, always comes first.', metadata: {}, display_order: 101, is_active: true },
        ];
    }

    if (pageType === 'region') {
        return [
            ...base,
            { page_key: pageKey, block_key: 'region_unique_image', block_type: 'image', title: 'Region Image', content: '', metadata: { url: '/images/locations/generic-hero.png', alt: `Fostering in ${name}` }, display_order: 10, is_active: true },
            { page_key: pageKey, block_key: 'process_title', block_type: 'text', title: 'Process Section Title', content: 'The Process', metadata: {}, display_order: 20, is_active: true },
        ];
    }

    if (pageType === 'county' || pageType === 'city') {
        return [
            ...base,
            { page_key: pageKey, block_key: 'local_priority_content', block_type: 'text', title: 'Local Priority Content', content: `Fostering in ${name} is critical right now.`, metadata: {}, display_order: 10, is_active: true },
            { page_key: pageKey, block_key: 'local_benefit_content', block_type: 'text', title: 'Local Benefit Content', content: 'You receive local support and training.', metadata: {}, display_order: 11, is_active: true },
        ];
    }

    // Static pages
    return [
        ...base,
        { page_key: pageKey, block_key: 'main_content', block_type: 'text', title: 'Main Content', content: 'Edit this content via CMS.', metadata: {}, display_order: 10, is_active: true },
    ];
}

function getDefaultFaqs(pageKey: string, pageType: string, name: string) {
    if (pageType === 'country') {
        const weeklyAllowance = "£400"; // Fallback value, typically handled dynamically in frontend but good for default content
        return [
            {
                page_key: pageKey,
                question: `What are the basic eligibility requirements to foster in ${name}?`,
                answer: `To foster in ${name}, you typically need to be over 21, have a spare bedroom, and be a full-time UK resident. Your marital status, gender, or sexual orientation does not affect your eligibility. What matters most is your ability to provide a safe, nurturing environment. For more details, visit our <a href="/become-a-foster" class="text-primary font-bold hover:underline">eligibility page</a>.`,
                display_order: 1,
                is_active: true
            },
            {
                page_key: pageKey,
                question: "How long does the fostering application process take?",
                answer: "On average, the process from initial enquiry to approval takes between 4 and 6 months. This includes training, background checks, and a comprehensive assessment (Form F) to ensure you're fully prepared for the role.",
                display_order: 2,
                is_active: true
            },
            {
                page_key: pageKey,
                question: `What financial support will I receive as a foster carer in ${name}?`,
                answer: `All foster carers receive a weekly allowance to cover the costs of caring for a child. In ${name}, this typically ranges start from around ${weeklyAllowance} per child, per week. This allowance is often tax-free. More details can be found on our <a href="/policy/funding" class="text-primary font-bold hover:underline">financial support page</a>.`,
                display_order: 3,
                is_active: true
            },
            {
                page_key: pageKey,
                question: "Can I foster if I work full-time?",
                answer: "Yes, many foster carers work. However, you must have the flexibility to attend meetings, training, and support your foster child's needs (like school runs). Some types of fostering, such as respite or short-term, may be more compatible with full-time work.",
                display_order: 4,
                is_active: true
            },
            {
                page_key: pageKey,
                question: "What support is available if I'm struggling?",
                answer: "You will have a dedicated supervising social worker and access to a 24/7 support hotline. Many agencies also offer peer support groups and ongoing therapeutic training to help you navigate challenges.",
                display_order: 5,
                is_active: true
            },
            {
                page_key: pageKey,
                question: "Do I need to own my own home to foster?",
                answer: "No. Whether you own or rent, as long as your home is stable and has a spare bedroom, you can apply to foster.",
                display_order: 6,
                is_active: true
            }
        ];
    }

    if (pageType === 'region') {
        return [
            { page_key: pageKey, question: `How many children need fostering in ${name}?`, answer: `There is a significant need for foster homes in ${name}. Local authorities are always looking for safe, loving homes.`, display_order: 1, is_active: true },
        ];
    }

    return [];
}
