import { Agency } from '@/types';

interface SchemaGeneratorProps {
  type: 'organization' | 'website' | 'localBusiness' | 'breadcrumb' | 'faq' | 'article';
  data?: any;
  agencies?: Agency[];
}

export function generateSchemaMarkup({ type, data, agencies = [] }: SchemaGeneratorProps): string {
  switch (type) {
    case 'organization':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Foster Care UK",
        "url": "https://fostercare.uk",
        "logo": "https://fostercare.uk/logo.png",
        "sameAs": [
          "https://www.facebook.com/fostercareuk",
          "https://twitter.com/fostercareuk",
          "https://www.linkedin.com/company/fostercareuk"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-800-123-4567",
          "contactType": "customer service",
          "availableLanguage": "English"
        }
      });

    case 'website':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Foster Care UK",
        "url": "https://fostercare.uk",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://fostercare.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      });

    case 'localBusiness':
      if (!data) return '';
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": data.name,
        "image": data.logo || "https://fostercare.uk/default-agency.png",
        "telephone": data.phone,
        "email": data.email,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.address?.street,
          "addressLocality": data.address?.city,
          "postalCode": data.address?.postcode,
          "addressCountry": "GB"
        },
        "url": `https://fostercare.uk/agencies/${data.slug}`,
        "priceRange": "£££",
        "review": agencies.slice(0, 5).map((agency: Agency) => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": agency.averageRating || 4.5,
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Verified Foster Carer"
          }
        }))
      });

    case 'breadcrumb':
      if (!data?.breadcrumbs) return '';
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.breadcrumbs.map((crumb: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      });

    case 'faq':
      if (!data?.questions) return '';
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.questions.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });

    case 'article':
      if (!data) return '';
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "author": {
          "@type": "Organization",
          "name": "Foster Care UK"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Foster Care UK",
          "logo": {
            "@type": "ImageObject",
            "url": "https://fostercare.uk/logo.png"
          }
        },
        "datePublished": data.publishedAt,
        "dateModified": data.updatedAt,
        "image": data.image || "https://fostercare.uk/default-blog.png"
      });

    default:
      return '';
  }
}