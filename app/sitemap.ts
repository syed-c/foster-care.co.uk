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
    supabase.from('locations').select('slug, type, updated_at'),
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

  const locationPages: MetadataRoute.Sitemap = [];
  if (locations) {
    locations.forEach((loc: any) => {
      const lastModified = loc.updated_at ? new Date(loc.updated_at) : new Date();

      // Base location page
      locationPages.push({
        url: `${SITE_URL}/locations/${loc.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: loc.type === 'country' ? 0.9 : loc.type === 'region' ? 0.8 : 0.7,
      });

      // Location + Specialism combos for main types
      if (['country', 'region', 'city', 'county'].includes(loc.type)) {
        specialismSlugsFromDb.forEach(specSlug => {
          locationPages.push({
            url: `${SITE_URL}/locations/${loc.slug}/${specSlug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      }
    });
  }

  const agencyPages: MetadataRoute.Sitemap = (agencies || []).map((agency: any) => ({
    url: `${SITE_URL}/agencies/${agency.slug}`,
    lastModified: agency.updated_at ? new Date(agency.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const specialismPages: MetadataRoute.Sitemap = (specialisms || []).map((spec: any) => ({
    url: `${SITE_URL}/specialisms/${spec.slug}`,
    lastModified: spec.updated_at ? new Date(spec.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

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
    ...agencyPages,
    ...specialismPages,
    ...blogPages,
    ...guidePages
  ];

  console.log(`Sitemap: Generated ${allPages.length} URLs`);
  return allPages;
}