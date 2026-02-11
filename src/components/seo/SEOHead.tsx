import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  structuredData?: Record<string, unknown>;
  keywords?: string[];
  noIndex?: boolean;
}

export function SEOHead({
  structuredData,
}: SEOHeadProps) {
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          data-seo="structured-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
}

// Helper function to create Organization structured data
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Foster Care UK",
    description: "The UK's leading directory of foster care agencies",
    url: "https://www.foster-care.co.uk",
    logo: "https://www.foster-care.co.uk/logo.png",
    sameAs: [
      "https://facebook.com/fostercareuk",
      "https://twitter.com/fostercareuk",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-800-123-4567",
      contactType: "customer service",
      areaServed: "GB",
      availableLanguage: "English",
    },
  };
}

// Helper function to create Local Business structured data for agencies
export function getAgencySchema(agency: {
  name: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  city?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  website?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.foster-care.co.uk/agencies/${agency.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: agency.name,
    description: agency.description,
    telephone: agency.phone,
    email: agency.email,
    url: agency.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.address,
      addressLocality: agency.city,
      postalCode: agency.postcode,
      addressCountry: "GB",
    },
    ...(agency.rating && agency.reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: agency.rating,
        reviewCount: agency.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// Helper function to create Breadcrumb structured data
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper function to create FAQ structured data
export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Helper function to create Article structured data
export function getArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: article.imageUrl,
    url: article.url,
    publisher: {
      "@type": "Organization",
      name: "Foster Care UK",
      logo: {
        "@type": "ImageObject",
        url: "https://www.foster-care.co.uk/logo.png",
      },
    },
  };
}
