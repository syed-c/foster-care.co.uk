import { Metadata } from 'next';
import { generateSchemaMarkup } from '@/lib/schema';
interface MinimalAgency {
  name: string;
  slug: string;
  phone?: string | null;
  email?: string | null;
  address?: string | any;
  rating?: number | null;
  reviewCount?: number | null;
}

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
  structuredData?: any;
  agencies?: MinimalAgency[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqData?: Array<{ question: string; answer: string }>;
  articleData?: {
    title: string;
    description: string;
    publishedAt: string;
    updatedAt: string;
    image?: string;
  };
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  noIndex = false,
  structuredData,
  agencies = [],
  breadcrumbs,
  faqData,
  articleData,
}: SEOHeadProps) {
  // Generate all schema markup
  const organizationSchema = JSON.stringify(generateSchemaMarkup({ type: 'organization' }));
  const websiteSchema = JSON.stringify(generateSchemaMarkup({ type: 'website' }));
  const breadcrumbSchema = breadcrumbs ? JSON.stringify(generateSchemaMarkup({
    type: 'breadcrumb',
    data: { breadcrumbs }
  })) : '';
  const faqSchema = faqData ? JSON.stringify(generateSchemaMarkup({
    type: 'faq',
    data: { questions: faqData }
  })) : '';
  const articleSchema = articleData ? JSON.stringify(generateSchemaMarkup({
    type: 'article',
    data: articleData
  })) : '';

  const finalCanonical = canonicalUrl || canonical;
  const finalOgType = ogType;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={finalOgType} />
      <meta property="og:url" content={finalCanonical || 'https://www.foster-care.co.uk'} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="Foster Care UK" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteSchema }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: articleSchema }}
        />
      )}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
}

// Helper functions for common SEO patterns
export function generateAgencySchema(agency: MinimalAgency) {
  return generateSchemaMarkup({
    type: 'localBusiness',
    data: {
      name: agency.name,
      phone: agency.phone,
      email: agency.email,
      address: agency.address,
      slug: agency.slug
    }
  });
}

export function generateLocationSchema(location: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": location,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    }
  };
}

export function generateFosteringTypeSchema(type: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": type,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Foster Care UK"
    }
  };
}

export function getOrganizationSchema() {
  return generateSchemaMarkup({ type: 'organization' });
}

export function getBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return generateSchemaMarkup({
    type: 'breadcrumb',
    data: { breadcrumbs }
  });
}

export function getFaqSchema(faqData: Array<{ question: string; answer: string }>) {
  return generateSchemaMarkup({
    type: 'faq',
    data: { questions: faqData }
  });
}

export function getArticleSchema(articleData: any) {
  return generateSchemaMarkup({
    type: 'article',
    data: articleData
  });
}

export function getAgencySchema(agency: MinimalAgency) {
  return generateAgencySchema(agency);
}