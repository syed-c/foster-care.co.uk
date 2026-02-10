import { Metadata } from 'next';
import { generateSchemaMarkup } from '@/lib/schema';
import { Agency } from '@/types';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
  agencies?: Agency[];
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
  ogImage = '/og-image.png',
  structuredData,
  agencies = [],
  breadcrumbs,
  faqData,
  articleData,
}: SEOHeadProps) {
  // Generate all schema markup
  const organizationSchema = generateSchemaMarkup({ type: 'organization' });
  const websiteSchema = generateSchemaMarkup({ type: 'website' });
  const breadcrumbSchema = breadcrumbs ? generateSchemaMarkup({ 
    type: 'breadcrumb', 
    data: { breadcrumbs } 
  }) : '';
  const faqSchema = faqData ? generateSchemaMarkup({ 
    type: 'faq', 
    data: { questions: faqData } 
  }) : '';
  const articleSchema = articleData ? generateSchemaMarkup({ 
    type: 'article', 
    data: articleData 
  }) : '';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || 'https://fostercare.uk'} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="Foster Care UK" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

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
export function generateAgencySchema(agency: Agency) {
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