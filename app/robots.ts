import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/workspace/', '/api/'],
    },
    sitemap: 'https://www.foster-care.co.uk/sitemap.xml',
  };
}