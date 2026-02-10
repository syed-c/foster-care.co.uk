import fs from 'fs';
import path from 'path';

async function generateSitemap() {
  try {
    console.log('Generating static sitemap...');

    // Generate static sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/agencies", priority: "0.9", changefreq: "daily" },
      { url: "/compare", priority: "0.8", changefreq: "weekly" },
      { url: "/locations", priority: "0.9", changefreq: "daily" },
      { url: "/locations/england", priority: "0.8", changefreq: "weekly" },
      { url: "/locations/england/london", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/south-east-england", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/south-west-england", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/east-of-england", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/west-of-midlands", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/east-of-midlands", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/yorkshire", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/north-west-england", priority: "0.7", changefreq: "weekly" },
      { url: "/locations/england/north-east-england", priority: "0.7", changefreq: "weekly" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
    ];

    // Add static pages to XML
    for (const page of staticPages) {
      xml += `  <url>
    <loc>https://www.foster-care.co.uk${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    xml += '</urlset>';

    // Write sitemap to public directory so it's served at root
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log('Static sitemap generated successfully.');
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Create a fallback sitemap in case of error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      '  <url>\n' +
      '    <loc>https://www.foster-care.co.uk/</loc>\n' +
      '    <changefreq>daily</changefreq>\n' +
      '    <priority>1.0</priority>\n' +
      '  </url>\n' +
      '</urlset>';

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), fallbackSitemap);
    console.log('Error occurred, fallback sitemap generated.');
  }
}

generateSitemap().catch(console.error);