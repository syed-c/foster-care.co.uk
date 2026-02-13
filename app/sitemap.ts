import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

const SITE_URL = 'https://www.foster-care.co.uk';



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Sitemap: Supabase credentials missing');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/agencies`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/locations`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/specialisms`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/compare`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/guides`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/blog`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${SITE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/trust-verification`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/how-listings-work`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/editorial-policy`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/pricing`, priority: 0.7, changeFrequency: 'weekly' },
  ];

  // Fetch dynamic data
  console.log('Sitemap: Fetching dynamic data...');
  const [
    { data: locations, error: locError },
    { data: agencies, error: agError },
    { data: specialisms, error: specError },
    { data: blogPosts, error: blogError }
  ] = await Promise.all([
    supabase.from('locations').select('id, parent_id, slug, type, updated_at'),
    supabase.from('agencies').select('slug, updated_at'),
    supabase.from('specialisms').select('slug, updated_at').eq('is_active', true),
    supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published')
  ]);

  if (locError) console.error('Sitemap: Error fetching locations:', locError);
  if (agError) console.error('Sitemap: Error fetching agencies:', agError);
  if (specError) console.error('Sitemap: Error fetching specialisms:', specError);
  if (blogError) console.error('Sitemap: Error fetching blog posts:', blogError);

  console.log('Sitemap Counts:', {
    locations: locations?.length || 0,
    agencies: agencies?.length || 0,
    specialisms: specialisms?.length || 0,
    blogPosts: blogPosts?.length || 0
  });

  // Create specialism combo slugs from DB data
  const specialismSlugsFromDb = (specialisms || []).map((s: any) => s.slug);

  /* 
   * NEW HIERARCHICAL SITEMAP LOGIC 
   * We need to build paths like: /locations/england/london/barnet
   * Fetch all locations and build a tree/map to traverse parents.
   */
  const locationPages: MetadataRoute.Sitemap = [];

  if (locations) {
    // 1. Build a map of id -> location for O(1) lookup
    const locMap = new Map<string, any>();
    locations.forEach((loc: any) => {
      locMap.set(loc.id, loc);
    });

    // 2. Helper to resolve full path slug
    const getPathSlug = (loc: any): string | null => {
      const parts = [loc.slug];
      let current = loc;

      // Safety break to prevent infinite loops
      let depth = 0;
      while (current.parent_id && depth < 5) {
        const parent = locMap.get(current.parent_id);
        if (!parent) break; // Orphaned relationship
        parts.unshift(parent.slug);
        current = parent;
        depth++;
      }

      // Optional: If top level is not a country, strict hierarchy validation?
      // User requested: /locations/:country/:region/:county
      // So checking type hierarchy:
      // If original loc is county, parent should be region, grandparent country.

      return parts.join('/');
    };

    locations.forEach((loc: any) => {
      // Only include specific types in sitemap as per user request
      // "Only include routes under: /locations/:country..."
      if (!['country', 'region', 'county'].includes(loc.type)) return;

      const pathSlug = getPathSlug(loc);
      if (!pathSlug) return;

      const lastModified = loc.updated_at ? new Date(loc.updated_at) : new Date();

      locationPages.push({
        url: `${SITE_URL}/locations/${pathSlug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: loc.type === 'country' ? 0.9 : loc.type === 'region' ? 0.8 : 0.7,
      });
    });
  }

  // Agencies removed as per user request
  // const agencyPages: MetadataRoute.Sitemap = (agencies || []).map((agency: any) => ({ ... }));

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post: any) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Guides subdirectory pages (hardcoded as they might not be in DB)
  const guidePages: MetadataRoute.Sitemap = [
    'how-to-become-foster-carer',
    'fostering-allowances',
    'types-of-fostering'
  ].map(guide => ({
    url: `${SITE_URL}/guides/${guide}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const allPages = [
    ...staticPages,
    ...locationPages,
    // ...agencyPages, // Removed
    ...blogPages,
    ...guidePages
  ];

  console.log(`Sitemap: Generated ${allPages.length} URLs`);
  return allPages;
}