import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // In a real implementation, this would call the Supabase function
    // For now, we'll generate the sitemap server-side in the Vercel function
    
    // Since this is a Vite/React app without Next.js, we need to handle this differently
    // In a real deployment, this would need to be a proper Next.js app or the sitemap
    // would be served directly from Supabase functions
    
    // For the purpose of this implementation, let's redirect to the Supabase function
    // You would need to replace this with the actual Supabase function URL
    const supabaseFunctionUrl = `${process.env.SUPABASE_URL}/functions/v1/generate-sitemap`;
    
    if (process.env.SUPABASE_URL) {
      // Redirect to the Supabase function
      res.redirect(307, supabaseFunctionUrl);
    } else {
      // Fallback: generate a basic sitemap in case environment variables aren't set
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 's-maxage=86400');
      
      const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://foster-care.co.uk/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://foster-care.co.uk/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://foster-care.co.uk/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`;
      
      res.status(200).send(staticSitemap);
    }
  } catch (error) {
    console.error('Error in sitemap handler:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}