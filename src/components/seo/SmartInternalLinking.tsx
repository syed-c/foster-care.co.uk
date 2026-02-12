'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface InternalLink {
  title: string;
  href: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'location' | 'specialism' | 'guide' | 'agency' | 'general';
}

interface SmartInternalLinkingProps {
  currentPage: string;
  currentPageType: 'location' | 'specialism' | 'guide' | 'agency' | 'blog' | 'general';
  location?: string;
  specialism?: string;
  excludePages?: string[];
}

const LINK_DATABASE: InternalLink[] = [
  // Location-based links
  { title: "Foster Care Agencies in London", href: "/locations/london", description: "Find verified foster care agencies in London", priority: "high", category: "location" },
  { title: "Foster Care Agencies in Manchester", href: "/locations/manchester", description: "Find verified foster care agencies in Manchester", priority: "high", category: "location" },
  { title: "Foster Care Agencies in Birmingham", href: "/locations/birmingham", description: "Find verified foster care agencies in Birmingham", priority: "high", category: "location" },
  { title: "Foster Care Agencies in Leeds", href: "/locations/leeds", description: "Find verified foster care agencies in Leeds", priority: "medium", category: "location" },
  { title: "Foster Care Agencies in Glasgow", href: "/locations/glasgow", description: "Find verified foster care agencies in Glasgow", priority: "medium", category: "location" },

  // Guide-based links
  { title: "How to Become a Foster Carer", href: "/guides/how-to-become-foster-carer", description: "Complete step-by-step guide to becoming a foster carer", priority: "high", category: "guide" },
  { title: "Fostering Allowance Calculator", href: "/guides/fostering-allowances", description: "Calculate potential fostering payments and allowances", priority: "high", category: "guide" },
  { title: "Types of Fostering Explained", href: "/guides/types-of-fostering", description: "Learn about different types of fostering services", priority: "high", category: "guide" },

  // General navigation
  { title: "Compare Foster Care Agencies", href: "/compare", description: "Compare multiple agencies side-by-side", priority: "high", category: "general" },
  { title: "All UK Foster Care Agencies", href: "/agencies", description: "Browse our complete directory of 500+ agencies", priority: "high", category: "general" },
  { title: "Fostering Blog & News", href: "/blog", description: "Latest news and insights from the fostering community", priority: "medium", category: "general" },
  { title: "Fostering Locations Directory", href: "/locations", description: "Find agencies by region, city, or county", priority: "high", category: "general" },
];

export function SmartInternalLinking({
  currentPage,
  currentPageType,
  location,
  specialism,
  excludePages = []
}: SmartInternalLinkingProps) {
  const [relevantLinks, setRelevantLinks] = useState<InternalLink[]>([]);

  useEffect(() => {
    // Filter and rank links based on context
    const filteredLinks = LINK_DATABASE
      .filter(link => {
        // Exclude current page and specified pages
        if (link.href === currentPage || excludePages.includes(link.href)) {
          return false;
        }

        // Location-specific filtering
        if (location && link.category === 'location') {
          return link.href.includes(location.toLowerCase());
        }

        // Specialism-specific filtering
        if (specialism && link.category === 'specialism') {
          return link.href.includes(specialism.toLowerCase());
        }

        // Page type-based relevance
        switch (currentPageType) {
          case 'location':
            return link.category === 'specialism' || link.category === 'guide' || link.category === 'general';
          case 'specialism':
            return link.category === 'location' || link.category === 'guide' || link.category === 'general';
          case 'guide':
            return link.category === 'location' || link.category === 'specialism' || link.category === 'general';
          case 'agency':
            return link.category === 'location' || link.category === 'specialism' || link.category === 'general';
          case 'blog':
            return link.category === 'guide' || link.category === 'general';
          default:
            return link.priority === 'high';
        }
      })
      .sort((a, b) => {
        // Priority ranking
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        // Category relevance
        const categoryRelevance: Record<string, number> = {
          location: currentPageType === 'location' ? 10 : 1,
          specialism: currentPageType === 'specialism' ? 10 : 1,
          guide: currentPageType === 'guide' ? 10 : 2,
          general: 1
        };

        return categoryRelevance[b.category] - categoryRelevance[a.category];
      })
      .slice(0, 8); // Limit to 8 most relevant links

    setRelevantLinks(filteredLinks);
  }, [currentPage, currentPageType, location, specialism, excludePages]);

  if (relevantLinks.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {currentPageType === 'agency' ? 'Related Agencies & Services' : 'Explore Related Topics'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relevantLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
          >
            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
              {link.title}
            </h4>
            <p className="text-sm text-gray-600">
              {link.description}
            </p>
            <span className="inline-flex items-center text-blue-600 text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
              Learn more
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Specific context components
export function LocationRelatedLinks({ location, excludePages }: { location: string; excludePages?: string[] }) {
  return (
    <SmartInternalLinking
      currentPage={`/locations/${location}`}
      currentPageType="location"
      location={location}
      excludePages={excludePages}
    />
  );
}

export function SpecialismRelatedLinks({ specialism, excludePages }: { specialism: string; excludePages?: string[] }) {
  return (
    <SmartInternalLinking
      currentPage={`/specialisms/${specialism}`}
      currentPageType="specialism"
      specialism={specialism}
      excludePages={excludePages}
    />
  );
}

export function AgencyRelatedLinks({ agencySlug, excludePages }: { agencySlug: string; excludePages?: string[] }) {
  return (
    <SmartInternalLinking
      currentPage={`/agencies/${agencySlug}`}
      currentPageType="agency"
      excludePages={[...excludePages || [], `/agencies/${agencySlug}`]}
    />
  );
}