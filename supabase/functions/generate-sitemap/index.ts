import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Site constants
const SITE_URL = "https://www.foster-care.co.uk";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Fetch all locations
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('id, slug, type, parent_id, updated_at, name')
      .eq('is_active', true);

    if (locError) {
      console.error('Error fetching locations:', locError);
    }

    // Fetch all agencies
    const { data: agencies, error: agencyError } = await supabase
      .from('agencies')
      .select('slug, updated_at, name')
      .eq('is_active', true);

    if (agencyError) {
      console.error('Error fetching agencies:', agencyError);
    }

    // Fetch all specialisms
    const { data: specialisms, error: specError } = await supabase
      .from('specialisms')
      .select('slug, updated_at, name')
      .eq('is_active', true);

    if (specError) {
      console.error('Error fetching specialisms:', specError);
    }

    // Fetch all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, title')
      .eq('status', 'published');

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
    }

    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

    // Static pages with high priority
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/agencies", priority: "0.9", changefreq: "daily" },
      { url: "/locations", priority: "0.9", changefreq: "daily" },
      { url: "/compare", priority: "0.7", changefreq: "weekly" },
      { url: "/guides", priority: "0.8", changefreq: "weekly" },
      { url: "/guides/how-to-become-foster-carer", priority: "0.8", changefreq: "monthly" },
      { url: "/guides/fostering-allowances", priority: "0.8", changefreq: "monthly" },
      { url: "/guides/types-of-fostering", priority: "0.8", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "daily" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
      { url: "/trust-verification", priority: "0.7", changefreq: "monthly" },
      { url: "/how-listings-work", priority: "0.7", changefreq: "monthly" },
      { url: "/editorial-policy", priority: "0.5", changefreq: "monthly" },
      { url: "/pricing", priority: "0.7", changefreq: "weekly" },
    ];

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    // Build location path map for hierarchical URLs
    const locationMap = new Map();
    if (locations) {
      locations.forEach(loc => locationMap.set(loc.id, loc));
    }

    const buildFullLocationPath = (location: any): string => {
      const segments: string[] = [];
      let current = location;

      while (current) {
        segments.unshift(current.slug);
        if (!current.parent_id) break;
        current = locationMap.get(current.parent_id);
      }

      // Ensure 'england' is prepended if not a country and no country parent
      const validCountries = ['england', 'scotland', 'wales', 'northern-ireland'];
      if (segments.length > 0 && !validCountries.includes(segments[0].toLowerCase())) {
        segments.unshift('england');
      }

      return `/locations/${segments.join('/')}`;
    };

    // Add location pages with proper hierarchy
    if (locations) {
      for (const location of locations) {
        const urlPath = buildFullLocationPath(location);
        let priority = "0.6";

        // Set priority based on type
        if (location.type === 'country') {
          priority = "0.9";
        } else if (location.type === 'region') {
          priority = "0.8";
        } else if (location.type === 'city') {
          priority = "0.7";
        } else if (location.type === 'county') {
          priority = "0.65";
        }

        const lastmod = location.updated_at
          ? new Date(location.updated_at).toISOString().split('T')[0]
          : today;

        xml += `  <url>
    <loc>${SITE_URL}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
      }
    }

    // Add agency profile pages
    if (agencies) {
      for (const agency of agencies) {
        const lastmod = agency.updated_at
          ? new Date(agency.updated_at).toISOString().split('T')[0]
          : today;

        xml += `  <url>
    <loc>${SITE_URL}/agencies/${agency.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      }
    }

    // Blog post pages
    if (blogPosts) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : today;

        xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
      }
    }

    xml += '</urlset>';

    // Log stats
    const urlCount = (xml.match(/<url>/g) || []).length;
    console.log(`Generated sitemap with ${urlCount} URLs`);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "noindex"
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return a minimal fallback sitemap
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/agencies</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/locations</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/locations/england</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
});
