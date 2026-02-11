"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";

import { motion } from "framer-motion";
import { useLocationBySlug, useChildLocations, useLocationPath, buildLocationUrl, Location } from "@/hooks/useLocations";
import { useAgenciesByLocation, useFeaturedAgencies } from "@/hooks/useAgencies";
import { useCmsContentByPage, useFaqsByPage, getContentBySection } from "@/hooks/useCmsContent";
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

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "northern-ireland": "🇬🇧",
};

export default function LocationPage() {
  const params = useParams();
  const rawSlug = params.city || params.county || params.region || params.country;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) as string;

  const { data: location, isLoading: locationLoading } = useLocationBySlug(slug);
  const { data: childLocations, isLoading: childrenLoading } = useChildLocations(location?.id);
  const { data: locationPath } = useLocationPath(location?.id);
  const { data: locationFaqs } = useFaqsByLocation(location?.id);
  const { data: locationAgencies } = useAgenciesByLocation(location?.id, 12);
  const { data: featuredAgencies } = useFeaturedAgencies(12);

  const cmsPageKey = slug ? `location_${slug}` : undefined;
  const { data: cmsContent } = useCmsContentByPage(cmsPageKey);
  const { data: pageFaqs } = useFaqsByPage(cmsPageKey);

  const isLoading = locationLoading || childrenLoading;
  const heroContent = getContentBySection(cmsContent, 'hero');
  const whyFosteringContent = getContentBySection(cmsContent, 'why_fostering');
  const allFaqs = [...(locationFaqs || []), ...(pageFaqs || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary">
        <Header />
        <main className="flex-1 pt-20">
          <section className="relative py-20 md:py-28 bg-secondary">
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
      <div className="min-h-screen flex flex-col bg-secondary">
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
            <h1 className="text-2xl font-extrabold mb-3 text-white">Location Not Found</h1>
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

  // Build breadcrumbs
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
      case "region": return "Counties";
      case "county": return "Cities & Towns";
      default: return "Areas";
    }
  };

  const currentPath = locationPath ? buildLocationUrl(locationPath) : `/locations/${location.slug}`;
  const agencies = locationAgencies && locationAgencies.length > 0 ? locationAgencies : featuredAgencies;
  const isShowingFeatured = !locationAgencies || locationAgencies.length === 0;
  const flag = location.type === 'country' ? countryFlags[location.slug] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={heroContent?.title || location.seo_title || `Foster Care Agencies in ${location.name} | Find Local Fostering Support`}
        description={heroContent?.content?.slice(0, 160) || location.seo_description || `Discover trusted foster care agencies in ${location.name}. Compare ${totalAgencies}+ verified fostering agencies and start your journey today.`}
        canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
        keywords={[`foster care ${location.name}`, `fostering agencies ${location.name}`, `become foster carer ${location.name}`, location.name]}
        structuredData={{
          ...getBreadcrumbSchema(breadcrumbItems),
          ...(faqsForSchema.length > 0 ? getFaqSchema(faqsForSchema) : {}),
        }}
      />
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <LocationHero
          title={heroContent?.title || `Fostering Agencies in ${location.name}`}
          subtitle={location.type === 'country' ? `${location.type.charAt(0).toUpperCase() + location.type.slice(1)} Directory` : undefined}
          description={heroContent?.content || location.description || `Discover verified foster care agencies across ${location.name}. Compare services, read reviews, and find the right agency for your fostering journey.`}
          badge={location.type}
          flag={flag || undefined}
          locationType={location.type}
          agencyCount={totalAgencies}
          breadcrumbs={breadcrumbs}
        />

        {/* Agency Listings - Horizontal Line Format */}
        {agencies && agencies.length > 0 && (
          <AgencyListings
            agencies={agencies}
            title={isShowingFeatured ? "Featured Agencies" : `Agencies in ${location.name}`}
            subtitle={isShowingFeatured
              ? "Top-rated fostering agencies across England"
              : `${agencies.length} agencies serving ${location.name}`}
            showFeaturedLabel={isShowingFeatured}
            locationName={location.name}
          />
        )}

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
        <FosteringTypesSection />

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
          <section className="py-14 md:py-20 bg-secondary/95">
            <div className="container-main">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
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
        <LocationCTA locationName={location.name} />
      </main>

    </div>
  );
}
