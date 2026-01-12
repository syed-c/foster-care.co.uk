import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useRegionPage } from '@/hooks/useRegionPage';
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
import { useAgenciesByRegion } from '@/hooks/useAgenciesByRegion';

const RegionPageContent = ({ regionSlug }: { regionSlug: string }) => {
  const { data: regionData, isLoading, error } = useRegionPage(regionSlug);
  const { data: agencies } = useAgenciesByRegion(regionSlug, 8);

  if (isLoading) {
    return <CountryPageSkeleton />;
  }

  if (error || !regionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-2xl font-black text-white mb-2">Page Not Found</h1>
          <p className="text-white/60">The requested region page does not exist.</p>
        </div>
      </div>
    );
  }

  const content = regionData.content;
  const regionName = content.title || regionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: "England", href: "/locations/england" },
    { label: regionName },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <LocationHero
          title={content.title || `Fostering Agencies in ${regionName}`}
          description={content.intro?.paragraphs?.[0]}
          locationType="region"
          agencyCount={agencies?.length || 0}
          breadcrumbs={breadcrumbs}
        />

        {/* Agency Listings - Horizontal Line Format */}
        {agencies && agencies.length > 0 && (
          <AgencyListings
            agencies={agencies}
            title={`Agencies in ${regionName}`}
            subtitle={`${agencies.length} fostering agencies serving ${regionName}`}
          />
        )}

        {/* Page Sections */}
        {content.intro && content.intro.paragraphs && content.intro.paragraphs.length > 1 && (
          <IntroSection 
            heading={(content.intro as any).heading || 'About Fostering in ' + regionName}
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
            independent={content.agency_types.independent ? {
              title: content.agency_types.independent.title,
              description: content.agency_types.independent.description || '',
              benefits: content.agency_types.independent.benefits
            } : undefined}
            local_authority={content.agency_types.local_authority ? {
              title: content.agency_types.local_authority.title,
              description: content.agency_types.local_authority.description || '',
              benefits: content.agency_types.local_authority.benefits
            } : undefined}
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
          locationName={regionName}
          locationSlug={regionSlug}
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
          <LocationCTA locationName={regionName} />
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

const RegionPage = () => {
  const { country, region } = useParams<{ country: string; region: string }>();
  
  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center px-4">
          <h1 className="text-2xl font-black text-white mb-2">Region not specified</h1>
          <p className="text-white/60">Please provide a region slug.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CountryPageSkeleton />}>
      <RegionPageContent regionSlug={region} />
    </Suspense>
  );
};

export default RegionPage;
