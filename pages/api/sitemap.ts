import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Set XML response headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=86400'); // Cache for 24 hours

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
      countryPages.forEach(page => {
        const url = `https://foster-care.co.uk/fostering-agencies/${page.slug}`;
        const lastmod = page.updated_at ? new Date(page.updated_at).toISOString() : new Date().toISOString();
        xml += `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>\n`;
      });
    }

    // Add location content (regions)
    if (locationContent) {
      locationContent.forEach(location => {
        const url = `https://foster-care.co.uk/locations/${location.slug}`;
        const lastmod = location.updated_at ? new Date(location.updated_at).toISOString() : new Date().toISOString();
        xml += `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>\n`;
      });
    }

    xml += '</urlset>';

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal sitemap in case of error
    const fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      '  <url><loc>https://foster-care.co.uk/</loc><lastmod>' + new Date().toISOString() + '</lastmod></url>\n' +
      '</urlset>';
    
    res.status(500).send(fallbackXml);
  }
}