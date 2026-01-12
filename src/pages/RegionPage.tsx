import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegionPage } from '@/hooks/useRegionPage';
import { SectionWrapper } from '@/components/country/SectionWrapper';
import { IntroSection } from '@/components/country/IntroSection';
import { RegionsGrid } from '@/components/country/RegionsGrid';
import { WhyFosteringMattersSection } from '@/components/country/WhyFosteringMattersSection';
import { AgencyTypesSection } from '@/components/country/AgencyTypesSection';
import { TypesOfFosteringSection } from '@/components/country/TypesOfFosteringSection';
import { HowToBecomeSection } from '@/components/country/HowToBecomeSection';
import { SupportSection } from '@/components/country/SupportSection';
import { ResponsibilitySection } from '@/components/country/ResponsibilitySection';
import { GlossarySection } from '@/components/country/GlossarySection';
import { FAQSection } from '@/components/country/FAQSection';
import { CTASection } from '@/components/country/CTASection';
import { AgenciesSection } from '@/components/country/AgenciesSection';
import { OfstedSection } from '@/components/country/OfstedSection';
import { HeroSection } from '@/components/country/HeroSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const RegionPageContent = ({ regionSlug }: { regionSlug: string }) => {
  const { data: regionData, isLoading, error } = useRegionPage(regionSlug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !regionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Page Not Found</h1>
          <p className="text-gray-500">The requested region page does not exist.</p>
        </div>
      </div>
    );
  }

  const content = regionData.content;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - white, large spacing */}
      <SectionWrapper variant="white" spacing="large">
        <HeroSection
          title={content.title}
          paragraphs={content.intro?.paragraphs ?? []}
          cta={content.cta}
        />
      </SectionWrapper>

      {/* Intro - tint, small spacing */}
      {content.intro && content.intro.paragraphs && content.intro.paragraphs.length > 0 && (
        <SectionWrapper variant="tint" spacing="small">
          <IntroSection 
            heading={content.intro.heading || 'Introduction'}
            paragraphs={content.intro.paragraphs}
          />
        </SectionWrapper>
      )}
      
      {/* Regions - white, large spacing */}
      {content.regions && (
        <SectionWrapper variant="white" spacing="large">
          <RegionsGrid 
            heading={content.regions.heading}
            list={content.regions.list}
          />
        </SectionWrapper>
      )}

      {/* Why Fostering Matters - tint, small spacing */}
      {content.why_fostering_matters && (
        <SectionWrapper variant="tint" spacing="small">
          <WhyFosteringMattersSection 
            heading={content.why_fostering_matters.heading}
            paragraphs={content.why_fostering_matters.paragraphs}
          />
        </SectionWrapper>
      )}

      {/* Agency Types - white, large spacing */}
      {content.agency_types && (
        <SectionWrapper variant="white" spacing="large">
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
        </SectionWrapper>
      )}

      {/* Ofsted - tint, small spacing */}
      {content.ofsted && (
        <SectionWrapper variant="tint" spacing="small">
          <OfstedSection 
            heading={content.ofsted.heading}
            description={content.ofsted.description}
          />
        </SectionWrapper>
      )}

      {/* Types of Fostering - white, large spacing */}
      {content.types_of_fostering && (
        <SectionWrapper variant="white" spacing="large">
          <TypesOfFosteringSection 
            heading={content.types_of_fostering.heading}
            intro={content.types_of_fostering.intro}
            categories={content.types_of_fostering.categories}
          />
        </SectionWrapper>
      )}

      {/* How to Become - tint, small spacing */}
      {content.how_to_become && (
        <SectionWrapper variant="tint" spacing="small">
          <HowToBecomeSection 
            heading={content.how_to_become.heading}
            note={content.how_to_become.note}
            steps={content.how_to_become.steps}
          />
        </SectionWrapper>
      )}

      {/* Support - white, large spacing */}
      {content.support && (
        <SectionWrapper variant="white" spacing="large">
          <SupportSection 
            heading={content.support.heading}
            categories={content.support.categories}
          />
        </SectionWrapper>
      )}

      {/* Responsibility - tint, small spacing */}
      {content.responsibility && (
        <SectionWrapper variant="tint" spacing="small">
          <ResponsibilitySection 
            heading={content.responsibility.heading}
            paragraph={content.responsibility.paragraph}
          />
        </SectionWrapper>
      )}

      {/* Glossary - white, large spacing */}
      {content.glossary && content.glossary.items && Object.keys(content.glossary.items || {}).length > 0 && (
        <SectionWrapper variant="white" spacing="large">
          <GlossarySection 
            heading={content.glossary.heading}
            items={content.glossary.items}
          />
        </SectionWrapper>
      )}

      {/* FAQ - tint, small spacing */}
      {content.faq && content.faq.questions && content.faq.questions.length > 0 && (
        <SectionWrapper variant="tint" spacing="small">
          <FAQSection 
            heading={content.faq.heading}
            questions={content.faq.questions}
          />
        </SectionWrapper>
      )}

      {/* Agencies - white, large spacing */}
      <SectionWrapper variant="white" spacing="large">
        <AgenciesSection id="agencies" />
      </SectionWrapper>

      {/* CTA - gradient, small spacing */}
      {content.cta && (
        <SectionWrapper variant="gradient" spacing="small">
          <CTASection 
            heading={content.cta.heading}
            paragraph={content.cta.paragraph}
            button_text={content.cta.button_text}
          />
        </SectionWrapper>
      )}

      <Footer />
    </div>
  );
};

const RegionPage = () => {
  const { country, region } = useParams<{ country: string; region: string }>();
  
  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Region not specified</h1>
          <p className="text-gray-500">Please provide a region slug.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    }>
      <RegionPageContent regionSlug={region} />
    </Suspense>
  );
};

export default RegionPage;