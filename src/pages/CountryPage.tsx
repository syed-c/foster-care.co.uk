import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useCountryPage } from '@/hooks/useCountryPage';
import { RegionsGrid } from '@/components/country/RegionsGrid';
import { IntroSection } from '@/components/country/IntroSection';
import { WhyFosteringMattersSection } from '@/components/country/WhyFosteringMattersSection';
import { AgencyTypesSection } from '@/components/country/AgencyTypesSection';
import { TypesOfFosteringSection } from '@/components/country/TypesOfFosteringSection';
import { HowToBecomeSection } from '@/components/country/HowToBecomeSection';
import { SupportSection } from '@/components/country/SupportSection';
import { ResponsibilitySection } from '@/components/country/ResponsibilitySection';
import { GlossarySection } from '@/components/country/GlossarySection';
import { FAQSection } from '@/components/country/FAQSection';
import { CTASection } from '@/components/country/CTASection';
import { OfstedSection } from '@/components/country/OfstedSection';
import { CountryPageSkeleton } from '@/components/country/CountryPageSkeleton';
import { BackToTop } from '@/components/shared/BackToTop';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocationHero } from '@/components/location/LocationHero';
import { AgencyListings } from '@/components/location/AgencyListings';
import { EnquirySection } from '@/components/location/EnquirySection';
import { LocationCTA } from '@/components/location/LocationCTA';
import { useAgenciesByCountry } from '@/hooks/useAgenciesByCountry';

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "northern-ireland": "🇬🇧",
};

const CountryPageContent = ({ slug }: { slug: string }) => {
  const { data: countryPage, isLoading, error } = useCountryPage(slug);
  const { data: agencies } = useAgenciesByCountry(slug, 8);

  if (isLoading) {
    return <CountryPageSkeleton />;
  }

  if (error || !countryPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-2xl font-black text-white mb-2">Page Not Found</h1>
          <p className="text-white/60">The requested country page does not exist.</p>
        </div>
      </div>
    );
  }

  const content = countryPage.content;
  const countryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const flag = countryFlags[slug];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: countryName },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <LocationHero
          title={content.title || `Fostering Agencies in ${countryName}`}
          description={content.intro?.paragraphs?.[0]}
          flag={flag}
          locationType="country"
          agencyCount={500}
          breadcrumbs={breadcrumbs}
        />

        {/* Agency Listings - Horizontal Line Format */}
        {agencies && agencies.length > 0 && (
          <AgencyListings
            agencies={agencies}
            title={`Top Agencies in ${countryName}`}
            subtitle={`Featured fostering agencies serving ${countryName}`}
            showFeaturedLabel
          />
        )}

        {/* Page Sections */}
        {content.intro && content.intro.paragraphs && content.intro.paragraphs.length > 1 && (
          <IntroSection 
            heading={(content.intro as any).heading || 'About Fostering in ' + countryName}
            paragraphs={content.intro.paragraphs.slice(1)}
          />
        )}
        
        {content.regions && (
          <RegionsGrid 
            heading={content.regions.heading}
            list={content.regions.list}
          />
        )}

        {content.why_fostering_matters && (
          <WhyFosteringMattersSection 
            heading={content.why_fostering_matters.heading}
            paragraphs={content.why_fostering_matters.paragraphs}
          />
        )}

        {content.agency_types && (
          <AgencyTypesSection 
            heading={content.agency_types.heading}
            intro={content.agency_types.intro}
            independent={content.agency_types.independent}
            local_authority={content.agency_types.local_authority}
          />
        )}

        {content.ofsted && (
          <OfstedSection 
            heading={content.ofsted.heading}
            description={content.ofsted.description}
          />
        )}

        {content.types_of_fostering && (
          <TypesOfFosteringSection 
            heading={content.types_of_fostering.heading}
            intro={content.types_of_fostering.intro}
            categories={content.types_of_fostering.categories}
          />
        )}

        {content.how_to_become && (
          <HowToBecomeSection 
            heading={content.how_to_become.heading}
            note={content.how_to_become.note}
            steps={content.how_to_become.steps}
          />
        )}

        {content.support && (
          <SupportSection 
            heading={content.support.heading}
            categories={content.support.categories}
          />
        )}

        {content.responsibility && (
          <ResponsibilitySection 
            heading={content.responsibility.heading}
            paragraph={content.responsibility.paragraph}
          />
        )}

        {content.glossary && content.glossary.items && Object.keys(content.glossary.items || {}).length > 0 && (
          <GlossarySection 
            heading={content.glossary.heading}
            items={content.glossary.items}
          />
        )}

        {/* Lead Form Section */}
        <EnquirySection
          locationName={countryName}
          locationSlug={slug}
        />

        {content.faq && content.faq.questions && content.faq.questions.length > 0 && (
          <FAQSection 
            heading={content.faq.heading}
            questions={content.faq.questions}
          />
        )}

        {content.cta ? (
          <CTASection 
            heading={content.cta.heading}
            paragraph={content.cta.paragraph}
            button_text={content.cta.button_text}
          />
        ) : (
          <LocationCTA locationName={countryName} />
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

const CountryPage = () => {
  const { country } = useParams<{ country: string }>();
  
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-2xl font-black text-white mb-2">Country not specified</h1>
          <p className="text-white/60">Please provide a country slug.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CountryPageSkeleton />}>
      <CountryPageContent slug={country} />
    </Suspense>
  );
};

export default CountryPage;
