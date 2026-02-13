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
                const { data, error } = await db
                    .from('page_content_blocks')
                    .insert(newBlocks)
                    .select();
                if (error) throw error;
                return NextResponse.json({ data, seeded: newBlocks.length });
            }

            return NextResponse.json({ data: [], seeded: 0 });
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
            { page_key: pageKey, block_key: 'is_right_content', block_type: 'text', title: 'Is Fostering Right Content', content: `<p>Becoming a foster carer is a significant lifestyle change. It's natural to have questions about how it will affect your family, your work, and your daily routine.</p>`, metadata: {}, display_order: 20, is_active: true },
            { page_key: pageKey, block_key: 'process_title', block_type: 'text', title: 'Process Section Title', content: 'The Process', metadata: {}, display_order: 30, is_active: true },
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
