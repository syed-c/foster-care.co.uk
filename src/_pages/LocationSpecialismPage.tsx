"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

import { useLocationFromPath, useLocationPath, buildLocationUrl } from "@/hooks/useLocations";
import { useSpecialismBySlug, STATIC_SPECIALISMS, useAgenciesByLocationAndSpecialism } from "@/hooks/useSpecialisms";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AgencyBookingModal } from "@/components/location/AgencyBookingModal";
import {
  Heart, AlertCircle, Clock, Home, Coffee, Users,
  GraduationCap, Accessibility, Scale, ArrowRight, ArrowLeft,
  Sparkles, MapPin, Star, BadgeCheck, Phone, Globe
} from "lucide-react";
import { useState } from "react";
import { Location, Specialism, Agency } from "@/services/dataService";

const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  AlertCircle,
  Clock,
  Home,
  Coffee,
  Users,
  GraduationCap,
  Accessibility,
  Scale,
};

interface LocationSpecialismPageProps {
  locationSegments: string[];
  specialismSlug: string;
  initialLocation?: Location | null;
  initialSpecialism?: Specialism | null;
  initialLocationPath?: Location[];
  initialAgencies?: Agency[];
}

export default function LocationSpecialismPage({
  locationSegments,
  specialismSlug,
  initialLocation,
  initialSpecialism,
  initialLocationPath,
  initialAgencies
}: LocationSpecialismPageProps) {
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  const { data: locationData, isLoading: locationLoading } = useLocationFromPath(locationSegments);
  const { data: specialismData, isLoading: specialismLoading } = useSpecialismBySlug(specialismSlug);

  const location = locationData || initialLocation;
  const specialism = specialismData || initialSpecialism;

  const { data: locationPathData } = useLocationPath(location?.id);
  const { data: agenciesData, isLoading: agenciesLoading } = useAgenciesByLocationAndSpecialism(location?.id, specialismSlug, 50);

  const locationPath = locationPathData || initialLocationPath || [];
  const agencies = agenciesData || initialAgencies || [];

  const isLoading = (locationLoading && !initialLocation) || (specialismLoading && !initialSpecialism);

  // Build breadcrumbs
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
  ];

  if (locationPath) {
    locationPath.forEach((loc, index) => {
      const pathToLoc = locationPath.slice(0, index + 1);
      breadcrumbs.push({
        name: loc.name,
        url: buildLocationUrl(pathToLoc),
      });
    });
  }

  if (specialism) {
    breadcrumbs.push({
      name: specialism.name,
      url: locationPath ? `${buildLocationUrl(locationPath)}/${specialismSlug}` : `/locations/${specialismSlug}`,
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-28">
          <div className="container-main">
            <Skeleton className="h-12 w-64 mb-4 bg-white/10" />
            <Skeleton className="h-6 w-full max-w-xl mb-8 bg-white/10" />
            <Skeleton className="h-96 rounded-3xl bg-white/10" />
          </div>
        </main>
      </div>
    );
  }

  if (!location || !specialism) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-28 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Page Not Found</h1>
            <p className="text-white/60 mb-6">
              {!location ? "Location not found" : "Specialism not found"}
            </p>
            <Button asChild>
              <Link href="/locations">Browse Locations</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const IconComponent = iconMap[specialism.icon || "Heart"] || Heart;
  const currentPath = locationPath ? `${buildLocationUrl(locationPath)}/${specialismSlug}` : `/locations/${location.slug}/${specialismSlug}`;

  // Generate unique SEO content for this location+specialism combination
  const getSpecialismLocationContent = () => {
    const contents: { [key: string]: { intro: string; benefits: string[] } } = {
      "short-term-fostering": {
        intro: `Short-term fostering in ${location.name} provides temporary care for children while their families receive support or permanent arrangements are made. Foster carers in ${location.name} typically provide placements lasting from a few days to several months.`,
        benefits: ["Flexible commitment suitable for working families", "Regular placement intervals", "Opportunity to help many children", "Full agency support throughout"]
      },
      "long-term-fostering": {
        intro: `Long-term fostering in ${location.name} offers stability and permanence for children who cannot return to their birth families. These placements often last until the child reaches adulthood, providing a loving family environment throughout their formative years.`,
        benefits: ["Build lasting family bonds", "See children grow and develop", "Higher fostering allowances", "Ongoing training and support"]
      },
      "emergency-fostering": {
        intro: `Emergency fostering in ${location.name} provides crucial immediate care for children who need safe accommodation urgently, often at very short notice. These placements typically last a few days to a couple of weeks.`,
        benefits: ["Make immediate impact in children's lives", "Flexible scheduling", "Premium emergency rates", "24/7 agency support"]
      },
      "respite-fostering": {
        intro: `Respite fostering in ${location.name} provides short breaks for other foster families or birth families, typically during weekends or school holidays. It's an excellent way to experience fostering with a lighter commitment.`,
        benefits: ["Perfect for those new to fostering", "Planned, predictable placements", "Support other foster families", "Maintain work-life balance"]
      },
      "therapeutic-fostering": {
        intro: `Therapeutic fostering in ${location.name} provides specialist care for children with complex emotional, behavioural, or mental health needs. Foster carers receive enhanced training and support to help these vulnerable young people.`,
        benefits: ["Higher specialist allowances", "Intensive training provided", "Smaller caseloads", "Professional multidisciplinary support"]
      },
      "parent-child-fostering": {
        intro: `Parent and child fostering in ${location.name} supports young parents and their babies together in a nurturing environment. Foster carers help develop parenting skills while providing a safe home.`,
        benefits: ["Keep families together", "Teach vital parenting skills", "Rewarding mentoring role", "Specialist training provided"]
      },
    };

    return contents[specialismSlug] || {
      intro: `${specialism.name} in ${location.name} offers specialized foster care services for children with specific needs. Local agencies provide comprehensive training and support for foster carers.`,
      benefits: ["Specialist training provided", "Competitive allowances", "24/7 support available", "Join local carer community"]
    };
  };

  const specialismContent = getSpecialismLocationContent();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <SEOHead
        title={`${specialism.name} in ${location.name} | Foster Care Agencies`}
        description={`Find ${specialism.name.toLowerCase()} foster care agencies in ${location.name}. Compare verified agencies offering ${specialism.name.toLowerCase()} placements with Ofsted ratings and reviews.`}
        canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
        keywords={[`${specialism.name.toLowerCase()} ${location.name}`, `foster care ${location.name}`, `${specialism.name.toLowerCase()} fostering`, `fostering agencies ${location.name}`]}
        structuredData={getBreadcrumbSchema(breadcrumbs.map(b => ({ name: b.name, url: `https://www.foster-care.co.uk${b.url}` })))}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-10 md:pt-24 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
              {breadcrumbs.slice(0, -1).map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <Link href={crumb.url} className="hover:text-white transition-colors">
                    {crumb.name}
                  </Link>
                  <span>/</span>
                </span>
              ))}
              <span className="text-white">{breadcrumbs[breadcrumbs.length - 1]?.name}</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {specialism.name}
                    </Badge>
                    <Badge variant="outline" className="text-white/60 border-white/20 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location.name}
                    </Badge>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-white">
                    {specialism.name} in {location.name}
                  </h1>
                </div>
              </div>

              <p className="text-base md:text-lg text-white/70 mb-6 line-clamp-2">
                {specialism.description} Find verified agencies in {location.name} offering this type of fostering.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => document.getElementById("agencies")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Agencies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href={locationPath ? buildLocationUrl(locationPath) : `/locations/${location.slug}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to {location.name}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Agencies Section */}
        <section id="agencies" className="py-10 md:py-14 bg-slate-900">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                {specialism.name} Agencies in {location.name}
              </h2>
              <p className="text-white/60 text-sm">
                {agencies.length > 0
                  ? `${agencies.length} agencies offering ${specialism.name.toLowerCase()} in this area`
                  : `Looking for agencies offering ${specialism.name.toLowerCase()}`
                }
              </p>
            </motion.div>

            {agenciesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl bg-white/5" />
                ))}
              </div>
            ) : agencies.length > 0 ? (
              <div className="space-y-3">
                {agencies.map((agency: any, index: number) => (
                  <motion.div
                    key={agency.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {agency.logo_url ? (
                        <img
                          src={agency.logo_url}
                          alt={agency.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Home className="w-6 h-6 text-primary" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/agencies/${agency.slug}`}
                            className="font-semibold text-white group-hover:text-primary transition-colors truncate"
                          >
                            {agency.name}
                          </Link>
                          {agency.is_verified && (
                            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          {agency.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {agency.city}
                            </span>
                          )}
                          {agency.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {Number(agency.rating).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {agency.phone && (
                          <a href={`tel:${agency.phone}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Phone className="w-4 h-4 text-white/60" />
                          </a>
                        )}
                        {agency.website && (
                          <a href={agency.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Globe className="w-4 h-4 text-white/60" />
                          </a>
                        )}
                        <Button
                          size="sm"
                          className="rounded-lg bg-primary hover:bg-primary/90 text-xs"
                          onClick={() => setSelectedAgency(agency)}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Home className="w-7 h-7 text-white/40" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">No agencies listed yet</h3>
                <p className="text-white/60 mb-4 text-sm">
                  We're working on adding agencies that offer {specialism.name.toLowerCase()} in {location.name}.
                </p>
                <Button asChild size="sm">
                  <Link href={`/specialisms/${specialismSlug}`}>View All {specialism.name} Agencies</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Other Specialisms in this Location */}
        <section className="py-10 md:py-14 bg-slate-950">
          <div className="container-main">
            <h2 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-6">
              Other Fostering Types in {location.name}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {STATIC_SPECIALISMS.filter(s => s.slug !== specialismSlug).slice(0, 6).map((spec) => {
                const specPath = locationPath
                  ? `${buildLocationUrl(locationPath)}/${spec.slug}`
                  : `/locations/${location.slug}/${spec.slug}`;
                return (
                  <Link
                    key={spec.id}
                    href={specPath}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all text-sm"
                  >
                    {spec.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <BackToTop />

      {selectedAgency && (
        <AgencyBookingModal
          agency={selectedAgency}
          isOpen={!!selectedAgency}
          onClose={() => setSelectedAgency(null)}
        />
      )}
    </div>
  );
}
