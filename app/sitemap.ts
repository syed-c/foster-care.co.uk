import { createClient } from '@/lib/supabase/server';
import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.foster-care.co.uk';

const SPECIALISM_SLUGS = [
  "short-term-fostering",
  "long-term-fostering",
  "emergency-fostering",
  "respite-fostering",
  "therapeutic-fostering",
  "parent-child-fostering",
  "sibling-groups-fostering",
  "teenagers-fostering",
  "asylum-seekers-fostering",
  "disabilities-fostering",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

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
  const [
    { data: locations },
    { data: agencies },
    { data: specialisms },
    { data: blogPosts }
  ] = await Promise.all([
    supabase.from('locations').select('slug, type, updated_at').eq('is_active', true),
    supabase.from('agencies').select('slug, updated_at').eq('is_active', true),
    supabase.from('specialisms').select('slug, updated_at').eq('is_active', true),
    supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published')
  ]);

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
      if (['country', 'region', 'city'].includes(loc.type)) {
        SPECIALISM_SLUGS.forEach(spec => {
          locationPages.push({
            url: `${SITE_URL}/locations/${loc.slug}/${spec}`,
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

  return [
    ...staticPages,
    ...locationPages,
    ...agencyPages,
    ...specialismPages,
    ...blogPages,
    ...guidePages
  ];
}