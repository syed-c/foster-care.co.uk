"use client";
import { Header } from "@/components/layout/Header";

import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { LocationDiscoverySection } from "@/components/home/LocationDiscoverySection";
import { FeaturedAgenciesSection } from "@/components/home/FeaturedAgenciesSection";
import { LeadCTASection } from "@/components/home/LeadCTASection";
import { AgencyCTASection } from "@/components/home/AgencyCTASection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SEOHead, getOrganizationSchema, getFaqSchema } from "@/components/seo/SEOHead";
import { FaqSection } from "@/components/shared/FaqSection";
import { useFaqs } from "@/hooks/useFaqs";

const Index = () => {
  const { data: faqs = [] } = useFaqs("home");

  // Structured FAQ data for schema
  const faqSchemaData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Foster Care Agencies UK | Compare 500+ Verified Fostering Services"
        description="Discover trusted foster care agencies across England. Compare Ofsted-rated services, read genuine reviews from foster carers, and find the right agency to start your fostering journey. Free directory with 500+ verified agencies."
        canonicalUrl="https://www.foster-care.co.uk"
        keywords={[
          "foster care agencies UK",
          "fostering agencies near me",
          "become a foster carer",
          "foster care services England",
          "Ofsted rated fostering agencies",
          "independent fostering agencies",
          "local authority fostering",
          "foster care directory UK",
          "fostering allowances",
          "emergency foster care"
        ]}
        structuredData={{
          ...getOrganizationSchema(),
          ...(faqSchemaData.length > 0 ? getFaqSchema(faqSchemaData) : {})
        }}
      />
      <Header />
      <main className="flex-1">


        <HeroSection />
        <TrustSection />
        <LocationDiscoverySection />
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
