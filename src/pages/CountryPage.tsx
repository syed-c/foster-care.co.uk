import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useCountryPage } from '@/hooks/useCountryPage';
import { SectionWrapper } from '@/components/country/SectionWrapper';
import { InfoCard } from '@/components/country/InfoCard';
import { DefinitionList } from '@/components/country/DefinitionList';
import { SectionHeading } from '@/components/country/SectionHeading';
import { RegionsGrid } from '@/components/country/RegionsGrid';
import { ChecklistList } from '@/components/country/ChecklistList';
import { FAQAccordion } from '@/components/country/FAQAccordion';
import { CustomButton } from '@/components/country/CustomButton';
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
import { AgenciesSection } from '@/components/country/AgenciesSection';
import { OfstedSection } from '@/components/country/OfstedSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  MapPin, 
  Heart, 
  Star, 
  Calendar,
  Baby,
  Home,
  UserRound,
  HandHeart
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper function to render paragraphs
const renderParagraphs = (paragraphs: string[] | undefined) => {
  if (!paragraphs || paragraphs.length === 0) return null;
  
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-gray-600">{paragraph}</p>
      ))}
    </div>
  );
};

// Helper function to render list
const renderList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return null;
  
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-green-600 mt-1">•</span>
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const CountryPageContent = ({ slug }: { slug: string }) => {
  const { data: countryPage, isLoading, error } = useCountryPage(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !countryPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Page Not Found</h1>
          <p className="text-gray-500">The requested country page does not exist.</p>
        </div>
      </div>
    );
  }

  const content = countryPage.content;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      {content.title && (
        <section className="relative bg-neutral-50 bg-[url('/assets/noise-grid.svg')] bg-center bg-cover">
          <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {content.title}
            </motion.h1>
            
            {content.intro && content.intro.paragraphs && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="mt-6 text-neutral-700 text-xl max-w-3xl mx-auto leading-relaxed">{content.intro.paragraphs[0]}</p>
              </motion.div>
            )}
            
            <motion.div 
              className="mt-10 flex gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="bg-green-600 text-white rounded-full px-8 py-4 hover:bg-green-700 transition"
                onClick={() => document.getElementById('agencies')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Agencies
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border border-neutral-400 text-neutral-900 rounded-full px-8 py-4 hover:bg-neutral-100 transition"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Enquiry
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Intro */}
      {content.intro && content.intro.paragraphs && content.intro.paragraphs.length > 0 && (
        <IntroSection 
          heading={(content.intro as any).heading || 'Introduction'}
          paragraphs={content.intro.paragraphs}
        />
      )}
      
      {/* Regions */}
      {content.regions && (
        <RegionsGrid 
          heading={content.regions.heading}
          list={content.regions.list}
        />
      )}

      {/* Why Fostering Matters */}
      {content.why_fostering_matters && (
        <WhyFosteringMattersSection 
          heading={content.why_fostering_matters.heading}
          paragraphs={content.why_fostering_matters.paragraphs}
        />
      )}

      {/* Agency Types */}
      {content.agency_types && (
        <AgencyTypesSection 
          heading={content.agency_types.heading}
          intro={content.agency_types.intro}
          independent={content.agency_types.independent}
          local_authority={content.agency_types.local_authority}
        />
      )}

      {/* Ofsted */}
      {content.ofsted && (
        <OfstedSection 
          heading={content.ofsted.heading}
          description={content.ofsted.description}
        />
      )}

      {/* Types of Fostering */}
      {content.types_of_fostering && (
        <TypesOfFosteringSection 
          heading={content.types_of_fostering.heading}
          intro={content.types_of_fostering.intro}
          categories={content.types_of_fostering.categories}
        />
      )}

      {/* How to Become */}
      {content.how_to_become && (
        <HowToBecomeSection 
          heading={content.how_to_become.heading}
          note={content.how_to_become.note}
          steps={content.how_to_become.steps}
        />
      )}

      {/* Support */}
      {content.support && (
        <SupportSection 
          heading={content.support.heading}
          categories={content.support.categories}
        />
      )}

      {/* Responsibility */}
      {content.responsibility && (
        <ResponsibilitySection 
          heading={content.responsibility.heading}
          paragraph={content.responsibility.paragraph}
        />
      )}

      {/* Glossary */}
      {content.glossary && content.glossary.items && Object.keys(content.glossary.items || {}).length > 0 && (
        <GlossarySection 
          heading={content.glossary.heading}
          items={content.glossary.items}
        />
      )}

      {/* FAQ */}
      {content.faq && content.faq.questions && content.faq.questions.length > 0 && (
        <FAQSection 
          heading={content.faq.heading}
          questions={content.faq.questions}
        />
      )}

      {/* Agencies */}
      <AgenciesSection id="agencies" />

      {/* CTA */}
      {content.cta && (
        <CTASection 
          heading={content.cta.heading}
          paragraph={content.cta.paragraph}
          button_text={content.cta.button_text}
        />
      )}

      <Footer />
    </div>
  );
};

const CountryPage = () => {
  const { country } = useParams<{ country: string }>();
  
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Country not specified</h1>
          <p className="text-gray-500">Please provide a country slug.</p>
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
      <CountryPageContent slug={country} />
    </Suspense>
  );
};

export default CountryPage;