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
  title,
  description = "Find trusted foster care agencies across the UK. Compare services, read reviews, and start your fostering journey today.",
  canonicalUrl,
  ogImage = "/og-image.jpg",
  ogType = "website",
  structuredData,
  keywords = ["foster care", "fostering", "foster agencies", "UK fostering"],
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title.includes("Foster Care UK") ? title : `${title} | Foster Care UK`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Foster Care UK" />
      {canonicalUrl && (
        <>
          <meta property="og:url" content={canonicalUrl} />
          <link rel="canonical" href={canonicalUrl} />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
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
