import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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
    { url: `${SITE_URL}/locations/england`, priority: 0.9, changeFrequency: 'weekly' },
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
    { url: `${SITE_URL}/become-a-foster`, priority: 0.8, changeFrequency: 'weekly' },
  ];

  // Guides subdirectory pages
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

  // Policy pages
  const policyPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/policy`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/policy/safeguarding`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/policy/funding`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/policy/training`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/policy/placement`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/policy/support`, priority: 0.7, changeFrequency: 'monthly' },
  ];

  // Blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post: any) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch locations and location_content to determine which regions have content
  const [{ data: locations }, { data: locationContent }] = await Promise.all([
    supabase.from('locations').select('id, parent_id, slug, type, updated_at'),
    supabase.from('location_content').select('slug, updated_at')
  ]);

  // Get slugs that have content in location_content table
  const contentSlugs = new Set(
    (locationContent || []).map(item => item.slug.replace(/^loc_/, ''))
  );

  // Build location map for path resolution
  const locMap = new Map<string, any>();
  (locations || []).forEach((loc: any) => {
    locMap.set(loc.id, loc);
  });

  // Helper to get full path slug
  const getPathSlug = (loc: any): string | null => {
    const parts = [loc.slug];
    let current = loc;
    let depth = 0;
    while (current.parent_id && depth < 5) {
      const parent = locMap.get(current.parent_id);
      if (!parent) break;
      parts.unshift(parent.slug);
      current = parent;
      depth++;
    }
    return parts.join('/');
  };

  // Build location pages - only include regions with content
  const locationPages: MetadataRoute.Sitemap = [];

  if (locations) {
    for (const loc of locations) {
      // Only include country and region types
      if (!['country', 'region'].includes(loc.type)) continue;

      const pathSlug = getPathSlug(loc);
      if (!pathSlug) continue;

      // Check if this location has content in location_content table
      const fullSlug = pathSlug;
      const hasContent = contentSlugs.has(fullSlug) || 
                        contentSlugs.has(`loc_${fullSlug}`) ||
                        contentSlugs.has(`england/${loc.slug}`) ||
                        contentSlugs.has(loc.slug);

      // Include country page always, regions only if they have content
      if (loc.type === 'country') {
        locationPages.push({
          url: `${SITE_URL}/locations/${pathSlug}`,
          lastModified: loc.updated_at ? new Date(loc.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        });
      } else if (hasContent) {
        // Only include regions that have content
        locationPages.push({
          url: `${SITE_URL}/locations/${pathSlug}`,
          lastModified: loc.updated_at ? new Date(loc.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      }
    }
  }

  const allPages = [
    ...staticPages,
    ...policyPages,
    ...guidePages,
    ...locationPages,
    ...blogPages,
  ];

  console.log(`Sitemap: Generated ${allPages.length} URLs (${locationPages.length} location pages with content)`);
  return allPages;
}
