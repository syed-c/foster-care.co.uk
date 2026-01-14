import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Fetch country pages
    const { data: countryPages, error: countryError } = await supabase
      .from('country_pages')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (countryError) {
      console.error('Error fetching country pages:', countryError);
    }

    // Fetch location content (regions)
    const { data: locationContent, error: locationError } = await supabase
      .from('location_content')
      .select('slug, updated_at')
      .not('title', 'is', null);

    if (locationError) {
      console.error('Error fetching location content:', locationError);
    }

    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    const staticPages = [
      'https://foster-care.co.uk/',
      'https://foster-care.co.uk/about',
      'https://foster-care.co.uk/contact',
    ];

    staticPages.forEach(page => {
      xml += `  <url><loc>${page}</loc><lastmod>${new Date().toISOString()}</lastmod></url>\n`;
    });

    // Add country pages
    if (countryPages) {
      countryPages.forEach((page: { slug: string; updated_at: string | null }) => {
        const url = `https://foster-care.co.uk/fostering-agencies/${page.slug}`;
        const lastmod = page.updated_at ? new Date(page.updated_at).toISOString() : new Date().toISOString();
        xml += `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>\n`;
      });
    }

    // Add location content (regions)
    if (locationContent) {
      locationContent.forEach((location: { slug: string; updated_at: string | null }) => {
        const url = `https://foster-care.co.uk/locations/${location.slug}`;
        const lastmod = location.updated_at ? new Date(location.updated_at).toISOString() : new Date().toISOString();
        xml += `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>\n`;
      });
    }

    xml += '</urlset>';

    return new Response(xml, {
      headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=86400" // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal sitemap in case of error
    const fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      '  <url><loc>https://foster-care.co.uk/</loc><lastmod>' + new Date().toISOString() + '</lastmod></url>\n' +
      '</urlset>';
    
    return new Response(fallbackXml, {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
});