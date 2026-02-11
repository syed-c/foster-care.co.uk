import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/integrations/supabase/types';

export type Location = Tables<"locations">;
export type CmsContent = Tables<"cms_content">;
export type FAQ = Tables<"faqs">;
export type Agency = Tables<"agencies">;
export type Specialism = Tables<"specialisms">;

export async function getCmsContentByPage(pageKey: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .order('section');

    if (error) return [];
    return data;
}

export async function getCmsContentSection(pageKey: string, sectionKey: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('section', sectionKey)
        .eq('is_active', true)
        .maybeSingle();

    if (error) return null;
    return data;
}

export async function getFaqsByPage(pageKey: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .order('display_order');

    if (error) return [];
    return data;
}

export async function getLocations() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

    if (error) return [];
    return data;
}

export async function getLocationBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) return null;
    return data as Location | null;
}

export async function getLocationFromPath(pathSegments: string[]) {
    if (!pathSegments || pathSegments.length === 0) return null;

    // The last segment is the target location
    const lastSegment = pathSegments[pathSegments.length - 1];
    return getLocationBySlug(lastSegment);
}

export async function getChildLocations(parentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('parent_id', parentId)
        .order('name');

    if (error) return [];
    return data;
}

export async function getLocationPath(locationId: string) {
    const supabase = await createClient();
    const path: Location[] = [];
    let currentId: string | null = locationId;

    while (currentId) {
        const { data, error } = await supabase
            .from('locations')
            .select('*')
            .eq('id', currentId)
            .single();

        if (error || !data) break;
        const loc = data as Location;
        path.unshift(loc);
        currentId = loc.parent_id;
    }

    return path;
}

export async function getAgenciesByLocation(locationId: string, limit = 50) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .limit(limit);

    if (error) return [];
    return data;
}

export async function getFaqsByLocation(locationId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .order('display_order');

    if (error) return [];
    return data;
}

export async function getSpecialismBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('specialisms')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

    if (error) return null;
    return data;
}

export async function getAgenciesByLocationAndSpecialism(
    locationId: string,
    specialismSlug: string,
    limit = 50
) {
    const supabase = await createClient();

    // First get agencies for the location
    const { data: locationAgencies, error: locError } = await supabase
        .from("agency_locations")
        .select(`
            agency_id,
            agencies (*)
        `)
        .eq("location_id", locationId)
        .limit(limit);

    if (locError || !locationAgencies || locationAgencies.length === 0) {
        return [];
    }

    // Try to get specialism ID from slug
    const { data: specialism } = await supabase
        .from("specialisms")
        .select("id")
        .eq("slug", specialismSlug)
        .maybeSingle();

    if (!specialism) {
        return locationAgencies.map((item: any) => item.agencies).filter(Boolean);
    }

    const agencyIds = locationAgencies.map(al => al.agency_id);
    const specialismId = (specialism as any).id;

    // Get agencies that also have the specialism
    const { data: specialismAgencies } = await supabase
        .from("agency_specialisms")
        .select("agency_id")
        .eq("specialism_id", specialismId)
        .in("agency_id", agencyIds);

    if (!specialismAgencies || (specialismAgencies as any[]).length === 0) {
        return locationAgencies.map((item: any) => item.agencies).filter(Boolean);
    }

    const matchingAgencyIds = new Set((specialismAgencies as any[]).map(sa => (sa as any).agency_id));
    return locationAgencies
        .filter((item: any) => matchingAgencyIds.has((item as any).agency_id))
        .map((item: any) => item.agencies)
        .filter(Boolean);
}

export async function getAgencyBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) return null;
    return data as Agency | null;
}

export async function getAgencyReviews(agencyId: string, limit = 10, onlyApproved = true) {
    const supabase = await createClient();
    let query = supabase
        .from('reviews')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (onlyApproved) {
        query = query.eq('is_approved', true);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
}

export async function getAgencySpecialisms(agencyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('agency_specialisms')
        .select('specialism_id, specialisms(id, name, slug)')
        .eq('agency_id', agencyId);

    if (error) return [];
    return data;
}

export async function getAgencyLocations(agencyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('agency_locations')
        .select('location_id, locations(id, name, slug)')
        .eq('agency_id', agencyId);

    if (error) return [];
    return data;
}

export async function getAgenciesBySpecialism(specialismId: string, limit = 50) {
    const supabase = await createClient();
    const { data: agencyIdsData, error: idError } = await supabase
        .from('agency_specialisms')
        .select('agency_id')
        .eq('specialism_id', specialismId);

    if (idError || !agencyIdsData || agencyIdsData.length === 0) return [];

    const agencyIds = agencyIdsData.map(item => item.agency_id);
    const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .in('id', agencyIds)
        .eq('is_active', true)
        .limit(limit);

    if (error) return [];
    return data;
}

export async function getAgencies(options: {
    search?: string;
    location?: string;
    minRating?: number;
    limit?: number;
} = {}) {
    const supabase = await createClient();
    let query = supabase
        .from('agencies')
        .select('*')
        .eq('is_active', true);

    if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
    }

    if (options.location) {
        query = query.ilike('city', `%${options.location}%`);
    }

    if (options.minRating) {
        query = query.gte('rating', options.minRating);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
}

export async function getSpecialisms() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('specialisms')
        .select('*')
        .order('name', { ascending: true });

    if (error) return [];
    return data as Specialism[];
}
