"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";

import { motion } from "framer-motion";
import { useLocationFromPath, useChildLocations, useLocationPath, buildLocationUrl, Location } from "@/hooks/useLocations";
import { useAgenciesByLocation } from "@/hooks/useAgencies";
import { useCmsContentByPage, getContentBySection } from "@/hooks/useCmsContent";
import { useFaqsByLocation } from "@/hooks/useFaqs";
import { FaqSection } from "@/components/shared/FaqSection";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead, getBreadcrumbSchema, getFaqSchema } from "@/components/seo/SEOHead";
import { LocationHero } from "@/components/location/LocationHero";
import { AgencyListings } from "@/components/location/AgencyListings";
import { ChildLocationsGrid } from "@/components/location/ChildLocationsGrid";
import { WhyFosteringSection } from "@/components/location/WhyFosteringSection";
import { FosteringTypesSection } from "@/components/location/FosteringTypesSection";
import { AgencyTypesCompactSection } from "@/components/location/AgencyTypesSection";
import { EnquirySection } from "@/components/location/EnquirySection";
import { LocationCTA } from "@/components/location/LocationCTA";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackToTop } from "@/components/shared/BackToTop";
import { STATIC_SPECIALISMS } from "@/hooks/useSpecialisms";
import LocationSpecialismPage from "./LocationSpecialismPage";

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "northern-ireland": "🇬🇧",
};

// Set of specialism slugs for quick lookup
const SPECIALISM_SLUGS = new Set(STATIC_SPECIALISMS.map(s => s.slug));

export default function UnifiedLocationPage() {
  // Get all possible path segments from the URL
  // Get all possible path segments from the URL
  // Handle Next.js App Router dynamic segments
  // In app/locations/[...segments]/page.tsx, the param is named "segments" (array)
  const params = useParams();

  const segmentsParam = params?.segments || params?.slug || [];
  const pathSegments = Array.isArray(segmentsParam)
    ? segmentsParam
    : typeof segmentsParam === 'string'
      ? [segmentsParam]
      : [];

  // Check if the last segment is a specialism slug
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isSpecialismPage = SPECIALISM_SLUGS.has(lastSegment);

  // If it's a specialism page, render the LocationSpecialismPage component
  if (isSpecialismPage && pathSegments.length > 1) {
    const locationSegments = pathSegments.slice(0, -1);
    return <LocationSpecialismPage locationSegments={locationSegments} specialismSlug={lastSegment} />;
  }

  // The last segment is the location we're trying to display
  const targetSlug = pathSegments[pathSegments.length - 1];

  const { data: location, isLoading: locationLoading } = useLocationFromPath(pathSegments);
  const { data: childLocations, isLoading: childrenLoading } = useChildLocations(location?.id);
  const { data: locationPath } = useLocationPath(location?.id);
  const { data: locationFaqs } = useFaqsByLocation(location?.id);
  const { data: locationAgencies } = useAgenciesByLocation(location?.id, 50);

  const cmsPageKey = targetSlug ? `location_${targetSlug}` : undefined;
  const { data: cmsContent } = useCmsContentByPage(cmsPageKey);

  const isLoading = locationLoading || childrenLoading;
  const heroContent = getContentBySection(cmsContent, 'hero');
  const whyFosteringContent = getContentBySection(cmsContent, 'why_fostering');
  const allFaqs = locationFaqs || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-20">
          <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="container-main">
              <Skeleton className="h-6 w-64 mb-6 bg-white/10" />
              <Skeleton className="h-16 w-[500px] mb-4 bg-white/10" />
              <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-white/60" />
            </div>
            <h1 className="text-2xl font-black mb-3 text-white">Location Not Found</h1>
            <p className="text-white/60 mb-8">The location you're looking for doesn't exist or may have been moved.</p>
            <Button asChild className="rounded-xl">
              <Link href="/locations">Browse All Locations</Link>
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const hasChildLocations = childLocations && childLocations.length > 0;
  const totalAgencies = hasChildLocations
    ? childLocations.reduce((sum, loc) => sum + (loc.agency_count || 0), 0)
    : location.agency_count || 0;

  // Build breadcrumbs from the location path
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
  ];

  if (locationPath) {
    locationPath.forEach((loc, index) => {
      const pathToLoc = locationPath.slice(0, index + 1);
      const isLast = index === locationPath.length - 1;
      breadcrumbs.push({
        label: loc.name,
        href: isLast ? undefined : buildLocationUrl(pathToLoc),
      });
    });
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://www.foster-care.co.uk" },
    { name: "Locations", url: "https://www.foster-care.co.uk/locations" },
  ];

  if (locationPath) {
    locationPath.forEach((loc, index) => {
      const pathToLoc = locationPath.slice(0, index + 1);
      breadcrumbItems.push({
        name: loc.name,
        url: `https://www.foster-care.co.uk${buildLocationUrl(pathToLoc)}`,
      });
    });
  }

  const getChildLocationUrl = (childLoc: Location): string => {
    if (locationPath) {
      return buildLocationUrl([...locationPath, childLoc]);
    }
    return `/locations/${childLoc.slug}`;
  };

  const faqsForSchema = allFaqs?.map(f => ({ question: f.question, answer: f.answer })) || [];

  const getChildTypeName = () => {
    switch (location.type) {
      case "country": return "Regions";
      case "region": return "Counties & Cities";
      case "county": return "Cities & Towns";
      case "city": return "Local Areas";
      default: return "Areas";
    }
  };

  const currentPath = locationPath ? buildLocationUrl(locationPath) : `/locations/${location.slug}`;
  const flag = location.type === 'country' ? countryFlags[location.slug] : null;

  // Generate unique SEO title based on location type
  const getSeoTitle = () => {
    if (heroContent?.title) return heroContent.title;
    if (location.seo_title) return location.seo_title;

    switch (location.type) {
      case "country":
        return `Foster Care Agencies in ${location.name} | Find Local Fostering Services`;
      case "region":
        return `Fostering Agencies in ${location.name} | Regional Foster Care Directory`;
      case "county":
        return `Foster Care in ${location.name} | County Fostering Agencies`;
      case "city":
        return `Fostering Agencies in ${location.name} | Local Foster Care Services`;
      case "area":
        return `Foster Care Services in ${location.name} | Find Fostering Agencies Near You`;
      default:
        return `Foster Care Agencies in ${location.name} | Find Local Fostering Support`;
    }
  };

  const getSeoDescription = () => {
    if (location.seo_description) return location.seo_description;
    return `Discover trusted foster care agencies in ${location.name}. Compare ${totalAgencies || 'local'}+ verified fostering agencies, read reviews, and start your fostering journey today.`;
  };

  // Generate unique location-specific content for SEO
  const getLocationIntro = () => {
    switch (location.type) {
      case "country":
        return `${location.name} has one of the most established foster care systems in the world, with hundreds of dedicated agencies working to provide loving homes for children in need. Whether you're in a major city or rural area, there are fostering opportunities waiting for caring individuals and families.`;
      case "region":
        return `The ${location.name} region is home to numerous foster care agencies providing vital support to children and young people. Local authorities and independent fostering agencies work together to ensure every child has access to safe, nurturing placements with trained foster carers.`;
      case "county":
        return `Foster care in ${location.name} is supported by a network of dedicated agencies offering various placement types. From emergency care to long-term fostering, local agencies provide comprehensive training, 24/7 support, and competitive allowances for foster carers.`;
      case "city":
        return `${location.name} has a diverse range of foster care agencies catering to the unique needs of urban communities. These agencies specialise in matching children with foster carers who understand local schools, healthcare facilities, and community resources.`;
      default:
        return `Foster care agencies in ${location.name} are committed to providing safe, loving homes for children who cannot live with their birth families. With full training and ongoing support, fostering in ${location.name} offers a rewarding way to make a real difference.`;
    }
  };

  const getLocationStats = () => {
    const baseStats = totalAgencies || Math.floor(Math.random() * 30) + 20;
    return {
      agencies: baseStats,
      carersNeeded: baseStats * 15,
      childrenInCare: baseStats * 8,
    };
  };

  const locationStats = getLocationStats();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <SEOHead
        title={getSeoTitle()}
        description={getSeoDescription()}
        canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
        keywords={[`foster care ${location.name}`, `fostering agencies ${location.name}`, `become foster carer ${location.name}`, location.name]}
        structuredData={{
          ...getBreadcrumbSchema(breadcrumbItems),
          ...(faqsForSchema.length > 0 ? getFaqSchema(faqsForSchema) : {}),
        }}
      />
      <Header />
      <main className="flex-1 pt-16">


        {/* Hero Section */}
        <LocationHero
          title={heroContent?.title || `Fostering in ${location.name}`}
          description={heroContent?.content || location.description || `Compare ${totalAgencies || 'trusted'} foster care agencies in ${location.name}. Find the right agency for your fostering journey.`}
          badge={location.type}
          flag={flag || undefined}
          locationType={location.type}
          agencyCount={totalAgencies}
          breadcrumbs={breadcrumbs}
          childLocations={childLocations?.map(c => ({ id: c.id, name: c.name, slug: c.slug })) || []}
          currentLocationPath={currentPath}
        />

        {/* Agency Listings - Always show, with real count */}
        <AgencyListings
          agencies={locationAgencies || []}
          title={`Agencies in ${location.name}`}
          subtitle={`${locationAgencies?.length || 0} agencies serving ${location.name}`}
          showFeaturedLabel={false}
          locationName={location.name}
        />

        {/* Child Locations Grid */}
        {hasChildLocations && (
          <ChildLocationsGrid
            locations={childLocations}
            title={`${getChildTypeName()} in ${location.name}`}
            subtitle="Explore fostering agencies in specific areas"
            getLocationUrl={getChildLocationUrl}
          />
        )}

        {/* Why Fostering Matters */}
        <WhyFosteringSection
          title={whyFosteringContent?.title}
          description={whyFosteringContent?.content}
          locationName={location.name}
        />

        {/* Types of Fostering */}
        <FosteringTypesSection currentLocationPath={currentPath} locationName={location.name} />

        {/* Agency Types Explained */}
        <AgencyTypesCompactSection />

        {/* Lead Form Section */}
        <EnquirySection
          locationName={location.name}
          locationSlug={location.slug}
          locationId={location.id}
        />

        {/* FAQ Section */}
        {allFaqs && allFaqs.length > 0 && (
          <section className="py-14 md:py-20 bg-slate-900/80">
            <div className="container-main">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-white/60 text-lg">Common questions about fostering in {location.name}</p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <FaqSection faqs={allFaqs} />
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {/* CTA Section */}
        <LocationCTA locationName={location.name} />
      </main>
      <BackToTop />
    </div>
  );
}
