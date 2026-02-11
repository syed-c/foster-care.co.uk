"use client";
import { Header } from "@/components/layout/Header";

import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { LocationDiscoverySection } from "@/components/home/LocationDiscoverySection";
import { FeaturedAgenciesSection } from "@/components/home/FeaturedAgenciesSection";
import { LeadCTASection } from "@/components/home/LeadCTASection";
import { AgencyCTASection } from "@/components/home/AgencyCTASection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { getOrganizationSchema, getFaqSchema } from "@/components/seo/SEOHead";
import { FaqSection } from "@/components/shared/FaqSection";
import { useFaqs } from "@/hooks/useFaqs";
import { CmsContent, FAQ, Location } from "@/services/dataService";

interface IndexProps {
  initialCmsContent?: CmsContent[];
  initialFaqs?: FAQ[];
  initialLocations?: Location[];
}

const Index = ({ initialCmsContent, initialFaqs, initialLocations }: IndexProps) => {
  const { data: faqs = initialFaqs || [] } = useFaqs("home");

  // Structured FAQ data for schema
  const faqSchemaData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="min-h-screen flex flex-col">


      <main className="flex-1">


        <HeroSection initialData={initialCmsContent} />
        <TrustSection initialData={initialCmsContent} />
        <LocationDiscoverySection initialData={initialCmsContent} initialLocations={initialLocations} />
        <FeaturedAgenciesSection />
        <TestimonialsSection />
        {faqs.length > 0 && (
          <FaqSection
            faqs={faqs}
            title="Frequently Asked Questions About Fostering"
            subtitle="Common questions from prospective foster carers"
          />
        )}
        <AgencyCTASection />
        <LeadCTASection />
      </main>

    </div>
  );
};

export default Index;
