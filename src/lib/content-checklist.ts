// Content Optimization Checklist for Foster Care UK

export interface ContentChecklistItem {
  id: string;
  category: 'technical' | 'content' | 'seo' | 'accessibility' | 'performance';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'complete' | 'in-progress' | 'pending';
  tools?: string[];
}

export const CONTENT_CHECKLIST: ContentChecklistItem[] = [
  // Technical SEO
  {
    id: 'meta-title',
    category: 'technical',
    title: 'Optimized Meta Title',
    description: 'Title tag under 60 characters with primary keyword at the beginning',
    priority: 'critical',
    status: 'pending',
    tools: ['Google Search Console', 'Ahrefs']
  },
  {
    id: 'meta-description',
    category: 'technical',
    title: 'Compelling Meta Description',
    description: 'Meta description between 150-160 characters with clear call-to-action',
    priority: 'critical',
    status: 'pending',
    tools: ['Google Search Console', 'SEMrush']
  },
  {
    id: 'canonical-tags',
    category: 'technical',
    title: 'Canonical Tags',
    description: 'Proper canonical tags to prevent duplicate content issues',
    priority: 'high',
    status: 'pending',
    tools: ['Screaming Frog', 'Google Search Console']
  },
  {
    id: 'schema-markup',
    category: 'technical',
    title: 'Schema Markup Implementation',
    description: 'Organization, LocalBusiness, and FAQ schema markup deployed',
    priority: 'high',
    status: 'pending',
    tools: ['Google Rich Results Test', 'Schema.org']
  },
  {
    id: 'structured-data',
    category: 'technical',
    title: 'Structured Data Validation',
    description: 'All structured data validates without errors in Google Testing Tool',
    priority: 'high',
    status: 'pending',
    tools: ['Google Rich Results Test', 'Schema Markup Validator']
  },

  // Content Quality
  {
    id: 'keyword-optimization',
    category: 'content',
    title: 'Primary Keyword Usage',
    description: 'Primary keyword used naturally 1-2% density in content',
    priority: 'high',
    status: 'pending',
    tools: ['Yoast SEO', 'Surfer SEO']
  },
  {
    id: 'semantic-keywords',
    category: 'content',
    title: 'Semantic/LST Keywords',
    description: 'LSI keywords and related terms naturally integrated throughout content',
    priority: 'medium',
    status: 'pending',
    tools: ['LSI Graph', 'AnswerThePublic']
  },
  {
    id: 'content-depth',
    category: 'content',
    title: 'Content Depth & Comprehensiveness',
    description: 'Content covers topic comprehensively (1,500+ words for main pages)',
    priority: 'high',
    status: 'pending',
    tools: ['Surfer SEO', 'Content Analyzer']
  },
  {
    id: 'heading-structure',
    category: 'content',
    title: 'Proper Heading Hierarchy',
    description: 'H1, H2, H3 tags used properly with keywords in headings',
    priority: 'medium',
    status: 'pending',
    tools: ['WAVE', 'HeadingsMap']
  },
  {
    id: 'content-freshness',
    category: 'content',
    title: 'Content Freshness',
    description: 'Content updated within last 12 months with current information',
    priority: 'medium',
    status: 'pending',
    tools: ['Google Search Console', 'Content Audit']
  },

  // SEO Elements
  {
    id: 'internal-linking',
    category: 'seo',
    title: 'Strategic Internal Linking',
    description: '3-5 relevant internal links to related content and main topic pages',
    priority: 'high',
    status: 'pending',
    tools: ['Ahrefs', 'Screaming Frog']
  },
  {
    id: 'external-links',
    category: 'seo',
    title: 'Authoritative External Links',
    description: '2-3 high-quality external links to authoritative sources',
    priority: 'medium',
    status: 'pending',
    tools: ['Ahrefs', 'Moz Link Explorer']
  },
  {
    id: 'image-optimization',
    category: 'seo',
    title: 'Image SEO Optimization',
    description: 'All images have descriptive alt text and optimized filenames',
    priority: 'high',
    status: 'pending',
    tools: ['Google Images', 'Image Optimizer']
  },
  {
    id: 'url-structure',
    category: 'seo',
    title: 'SEO-Friendly URLs',
    description: 'Clean URLs with keywords, hyphens, and no unnecessary parameters',
    priority: 'medium',
    status: 'pending',
    tools: ['Google Search Console', 'Screaming Frog']
  },
  {
    id: 'content-clustering',
    category: 'seo',
    title: 'Content Clustering',
    description: 'Topic clusters linking to pillar content with clear information architecture',
    priority: 'high',
    status: 'pending',
    tools: ['TopicCluster.io', 'Ahrefs']
  },

  // Accessibility
  {
    id: 'alt-text',
    category: 'accessibility',
    title: 'Complete Alt Text Coverage',
    description: 'All images have descriptive, keyword-rich alt text attributes',
    priority: 'critical',
    status: 'pending',
    tools: ['WAVE', 'axe DevTools']
  },
  {
    id: 'aria-labels',
    category: 'accessibility',
    title: 'ARIA Labels & Landmarks',
    description: 'Proper ARIA labels for interactive elements and navigation',
    priority: 'high',
    status: 'pending',
    tools: ['axe DevTools', 'WAVE']
  },
  {
    id: 'color-contrast',
    category: 'accessibility',
    title: 'Color Contrast Compliance',
    description: 'Text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)',
    priority: 'high',
    status: 'pending',
    tools: ['WebAIM Contrast Checker', 'axe DevTools']
  },
  {
    id: 'keyboard-navigation',
    category: 'accessibility',
    title: 'Keyboard Accessibility',
    description: 'All functionality accessible via keyboard navigation',
    priority: 'high',
    status: 'pending',
    tools: ['axe DevTools', 'Keyboard Testing']
  },
  {
    id: 'screen-reader',
    category: 'accessibility',
    title: 'Screen Reader Compatibility',
    description: 'Content properly structured for screen reader navigation',
    priority: 'medium',
    status: 'pending',
    tools: ['NVDA', 'JAWS', 'VoiceOver']
  },

  // Performance
  {
    id: 'page-speed',
    category: 'performance',
    title: 'Page Speed Optimization',
    description: 'Page loads in under 3 seconds on desktop and mobile',
    priority: 'critical',
    status: 'pending',
    tools: ['Google PageSpeed Insights', 'GTmetrix']
  },
  {
    id: 'core-web-vitals',
    category: 'performance',
    title: 'Core Web Vitals Compliance',
    description: 'Meets Google\'s Core Web Vitals thresholds for all metrics',
    priority: 'critical',
    status: 'pending',
    tools: ['Google PageSpeed Insights', 'Web.dev']
  },
  {
    id: 'image-compression',
    category: 'performance',
    title: 'Image Compression',
    description: 'All images compressed and served in modern formats (WebP/AVIF)',
    priority: 'high',
    status: 'pending',
    tools: ['Squoosh', 'ImageOptim']
  },
  {
    id: 'code-splitting',
    category: 'performance',
    title: 'Code Splitting & Lazy Loading',
    description: 'JavaScript and components loaded only when needed',
    priority: 'medium',
    status: 'pending',
    tools: ['Lighthouse', 'Bundle Analyzer']
  },
  {
    id: 'caching-strategy',
    category: 'performance',
    title: 'Caching Strategy',
    description: 'Proper browser caching headers for static assets',
    priority: 'medium',
    status: 'pending',
    tools: ['Lighthouse', 'WebPageTest']
  }
];

export function generateContentScore(checklist: ContentChecklistItem[]): number {
  const completedItems = checklist.filter(item => item.status === 'complete');
  const totalWeight = checklist.reduce((sum, item) => {
    const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
    return sum + priorityWeights[item.priority];
  }, 0);
  
  const completedWeight = completedItems.reduce((sum, item) => {
    const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
    return sum + priorityWeights[item.priority];
  }, 0);
  
  return Math.round((completedWeight / totalWeight) * 100);
}

export function getPriorityItems(checklist: ContentChecklistItem[]): ContentChecklistItem[] {
  return checklist
    .filter(item => item.priority === 'critical' || item.priority === 'high')
    .filter(item => item.status !== 'complete')
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

export function getCategoryProgress(checklist: ContentChecklistItem[]): Record<string, number> {
  const categories = ['technical', 'content', 'seo', 'accessibility', 'performance'];
  const progress: Record<string, number> = {};
  
  categories.forEach(category => {
    const categoryItems = checklist.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.status === 'complete').length;
    progress[category] = Math.round((completed / categoryItems.length) * 100);
  });
  
  return progress;
}