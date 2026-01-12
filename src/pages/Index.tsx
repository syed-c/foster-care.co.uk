import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { LocationDiscoverySection } from "@/components/home/LocationDiscoverySection";
import { FeaturedAgenciesSection } from "@/components/home/FeaturedAgenciesSection";
import { LeadCTASection } from "@/components/home/LeadCTASection";
import { AgencyCTASection } from "@/components/home/AgencyCTASection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SEOHead, getOrganizationSchema } from "@/components/seo/SEOHead";
import { FaqSection } from "@/components/shared/FaqSection";
import { useFaqs } from "@/hooks/useFaqs";

const Index = () => {
  const { data: faqs = [] } = useFaqs("home");

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Foster Care UK - Find Trusted Foster Care Agencies"
        description="The UK's leading directory of foster care agencies. Find verified agencies, compare services, read reviews, and start your fostering journey today."
        canonicalUrl="https://fostercare.uk"
        keywords={["foster care", "fostering agencies", "UK fostering", "become a foster carer", "foster care directory"]}
        structuredData={getOrganizationSchema()}
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
            title="Frequently Asked Questions"
            subtitle="Common questions about fostering in the UK"
          />
        )}
        <AgencyCTASection />
        <LeadCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
