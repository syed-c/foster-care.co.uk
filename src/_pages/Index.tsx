"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
        canonicalUrl="https://foster-care.co.uk"
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
        {/* SEO-optimized hidden content for search engines */}
        <div className="sr-only">
          <h1>Foster Care Agencies Directory UK - Find Trusted Fostering Services</h1>
          <p>
            Welcome to the UK's most comprehensive foster care agency directory. We connect prospective foster carers 
            with over 500 verified fostering agencies across England, Scotland, Wales, and Northern Ireland. 
            Whether you're considering becoming a foster carer for the first time or looking to transfer to a new agency, 
            our platform helps you find the right match based on your location, preferences, and the type of fostering you're interested in.
          </p>
          <h2>Why Choose Our Foster Care Directory?</h2>
          <p>
            All agencies listed on our platform undergo verification checks. We display Ofsted ratings, genuine reviews 
            from foster carers, and detailed information about each agency's specialisms including emergency fostering, 
            therapeutic care, sibling groups, teenagers, parent and child placements, and support for unaccompanied asylum seekers.
          </p>
          <h2>Types of Fostering Available</h2>
          <ul>
            <li>Short-term foster care - temporary placements while long-term plans are made</li>
            <li>Long-term foster care - providing a permanent family home until adulthood</li>
            <li>Emergency foster care - immediate placements for children in crisis</li>
            <li>Respite foster care - short breaks to support other foster families</li>
            <li>Therapeutic foster care - specialized support for children with complex needs</li>
            <li>Parent and child fostering - supporting young parents alongside their babies</li>
          </ul>
          <h2>Fostering in England</h2>
          <p>
            There are over 65,000 children in care in England, and the demand for foster carers continues to grow. 
            Our directory covers all regions including London, the South East, North West, West Midlands, Yorkshire, 
            and every city and county across the country. Find local fostering agencies in Birmingham, Manchester, 
            Leeds, Liverpool, Bristol, Sheffield, Newcastle, Nottingham, and more.
          </p>
        </div>

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
      <Footer />
    </div>
  );
};

export default Index;
