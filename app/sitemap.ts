export default async function sitemap() {
  const staticPages = [
    {
      url: 'https://www.foster-care.co.uk/',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://www.foster-care.co.uk/agencies',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.foster-care.co.uk/locations',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.foster-care.co.uk/guides',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.foster-care.co.uk/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.foster-care.co.uk/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.foster-care.co.uk/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.foster-care.co.uk/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.foster-care.co.uk/compare',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.foster-care.co.uk/trust-verification',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.foster-care.co.uk/how-listings-work',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Add location pages
  const locations = [
    'england', 'london', 'manchester', 'birmingham', 'leeds', 'glasgow',
    'edinburgh', 'cardiff', 'belfast', 'south-east', 'south-west',
    'west-midlands', 'east-midlands', 'yorkshire', 'north-west', 'north-east'
  ];

  const locationPages = locations.map(location => ({
    url: `https://www.foster-care.co.uk/locations/${location}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add specialism pages
  const specialisms = [
    'short-term-fostering', 'long-term-fostering', 'emergency-fostering',
    'respite-fostering', 'therapeutic-fostering', 'parent-child-fostering',
    'sibling-groups-fostering', 'teenagers-fostering'
  ];

  const specialismPages = specialisms.map(specialism => ({
    url: `https://www.foster-care.co.uk/specialisms/${specialism}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Add guide pages
  const guides = [
    'how-to-become-foster-carer', 'fostering-allowances', 'types-of-fostering'
  ];

  const guidePages = guides.map(guide => ({
    url: `https://www.foster-care.co.uk/guides/${guide}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...locationPages, ...specialismPages, ...guidePages];
}