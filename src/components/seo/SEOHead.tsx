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

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords.join(", "));
    
    if (noIndex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      updateMeta("robots", "index, follow");
    }

    // Open Graph tags
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "Foster Care UK", true);
    
    if (canonicalUrl) {
      updateMeta("og:url", canonicalUrl, true);
      
      // Canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);

    // Structured data
    if (structuredData) {
      let script = document.querySelector('script[data-seo="structured-data"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-seo", "structured-data");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      const ldScript = document.querySelector('script[data-seo="structured-data"]');
      if (ldScript) {
        ldScript.remove();
      }
    };
  }, [fullTitle, description, canonicalUrl, ogImage, ogType, structuredData, keywords, noIndex]);

  return null;
}

// Helper function to create Organization structured data
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Foster Care UK",
    description: "The UK's leading directory of foster care agencies",
    url: "https://fostercare.uk",
    logo: "https://fostercare.uk/logo.png",
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
    "@id": `https://fostercare.uk/agencies/${agency.name.toLowerCase().replace(/\s+/g, "-")}`,
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
        url: "https://fostercare.uk/logo.png",
      },
    },
  };
}
