"use client";
import { useParams } from "next/navigation";
import { useCountyContent } from "@/hooks/useCountyContent";
import { useLocationFromPath, useChildLocations, useLocationPath, buildLocationUrl } from "@/hooks/useLocations";
import { useAgenciesByLocation, useFeaturedAgencies } from "@/hooks/useAgencies";
import { useFaqsByLocation } from "@/hooks/useFaqs";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { CountyTemplate } from "@/components/locations/CountyTemplate";
import UnifiedLocationPage from "@/_pages/UnifiedLocationPage";
import { Location, Agency, FAQ } from "@/services/dataService";

interface CountyPageContentProps {
    initialLocation?: Location | null;
    initialChildLocations?: Location[];
    initialLocationPath?: Location[];
    initialLocationFaqs?: FAQ[];
    initialLocationAgencies?: Agency[];
    initialCountyContent?: any;
}

export default function CountyPageContent({
    initialLocation,
    initialChildLocations,
    initialLocationPath,
    initialLocationFaqs,
    initialLocationAgencies,
    initialCountyContent,
}: CountyPageContentProps) {
    const params = useParams();
    const pathSegments = params?.country && params?.region && params?.county
        ? [params.country as string, params.region as string, params.county as string]
        : [];

    const fullSlug = pathSegments.join('/');
    
    const { data: location } = useLocationFromPath(pathSegments);
    const { data: childLocations } = useChildLocations(location?.id);
    const { data: locationPath } = useLocationPath(location?.id);
    const { data: locationFaqs } = useFaqsByLocation(location?.id);
    const { data: locationAgencies } = useAgenciesByLocation(location?.id, 50);
    const { data: fallbackAgencies } = useFeaturedAgencies(12);
    const { data: countyContent } = useCountyContent(fullSlug);

    const effectiveLocation = location || initialLocation;
    const effectiveChildLocations = childLocations || initialChildLocations || [];
    const effectiveLocationPath = locationPath || initialLocationPath || [];
    const effectiveLocationFaqs = locationFaqs || initialLocationFaqs || [];
    const effectiveCountyContent = countyContent || initialCountyContent;

    const effectiveLocationAgencies = (locationAgencies && locationAgencies.length > 0)
        ? locationAgencies
        : (location?.type === 'country' && fallbackAgencies && fallbackAgencies.length > 0)
            ? fallbackAgencies
            : initialLocationAgencies || [];

    const isLoading = !initialLocation && !location;
    const allFaqs = effectiveLocationFaqs;

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

    if (!effectiveLocation) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-950">
                <Header />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-white/60" />
                        </div>
                        <h1 className="text-2xl font-black mb-3 text-white">Location Not Found</h1>
                        <p className="text-white/60 mb-8">The location you're looking for doesn't exist or may have been moved.</p>
                        <Button asChild className="rounded-xl">
                            <a href="/locations">Browse All Locations</a>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const hasChildLocations = effectiveChildLocations && effectiveChildLocations.length > 0;
    const totalAgencies = hasChildLocations
        ? effectiveChildLocations.reduce((sum, loc) => sum + (loc.agency_count || 0), 0)
        : effectiveLocation.agency_count || 0;

    const breadcrumbItems = [
        { name: "Home", url: "https://www.foster-care.co.uk" },
        { name: "Locations", url: "https://www.foster-care.co.uk/locations" },
    ];

    if (effectiveLocationPath) {
        effectiveLocationPath.forEach((loc, index) => {
            const pathToLoc = effectiveLocationPath.slice(0, index + 1);
            breadcrumbItems.push({
                name: loc.name,
                url: `https://www.foster-care.co.uk${buildLocationUrl(pathToLoc)}`,
            });
        });
    }

    const faqsForSchema = allFaqs?.map(f => ({ question: f.question, answer: f.answer })) || [];
    const currentPath = effectiveLocationPath ? buildLocationUrl(effectiveLocationPath) : `/locations/${effectiveLocation.slug}`;

    const getSeoTitle = () => {
        if (effectiveLocation.seo_title) return effectiveLocation.seo_title;

        switch (effectiveLocation.type) {
            case "country":
                return `Foster Care Agencies in ${effectiveLocation.name} | Find Local Fostering Services`;
            case "region":
                return `Fostering Agencies in ${effectiveLocation.name} | Regional Foster Care Directory`;
            case "county":
                return `Foster Care in ${effectiveLocation.name} | County Fostering Agencies`;
            case "city":
                return `Fostering Agencies in ${effectiveLocation.name} | Local Foster Care Services`;
            case "area":
                return `Foster Care Services in ${effectiveLocation.name} | Find Fostering Agencies Near You`;
            default:
                return `Foster Care Agencies in ${effectiveLocation.name} | Find Local Fostering Support`;
        }
    };

    const getSeoDescription = () => {
        if (effectiveLocation.seo_description) return effectiveLocation.seo_description;

        return `Discover trusted foster care agencies in ${effectiveLocation.name}. Compare ${totalAgencies || 'local'}+ verified fostering agencies, read reviews, and start your fostering journey today.`;
    };

    const getRichStats = () => {
        const baseAgencies = totalAgencies || 25;
        return {
            childrenInCare: baseAgencies * 12,
            boroughs: effectiveChildLocations.length || 1,
            agenciesCount: baseAgencies,
            totalCarers: baseAgencies * 45,
            weeklyAllowance: "£450 - £650",
        };
    };

    const richStats = getRichStats();
    const seoTitle = getSeoTitle();
    const seoDescription = getSeoDescription();

    const getPlaceSchema = () => {
        const schemaType = effectiveLocation.type === 'country' ? 'Country' :
            effectiveLocation.type === 'city' ? 'City' :
                'AdministrativeArea';

        return {
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": effectiveLocation.name,
            "description": `Foster care services and information for ${effectiveLocation.name}`,
            "url": `https://www.foster-care.co.uk${currentPath}`,
            "containsPlace": effectiveChildLocations.map(child => ({
                "@type": "Place",
                "name": child.name,
                "url": `https://www.foster-care.co.uk${currentPath}/${child.slug}`
            }))
        };
    };

    const placeSchema = getPlaceSchema();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <SEOHead
                title={seoTitle}
                description={seoDescription}
                canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
                breadcrumbs={breadcrumbItems}
                faqData={faqsForSchema.length > 0 ? faqsForSchema : undefined}
                structuredData={placeSchema}
            />
            <Header />

            <main className="flex-1">
                {effectiveCountyContent ? (
                    <CountyTemplate
                        location={effectiveLocation}
                        childLocations={effectiveChildLocations}
                        path={effectiveLocationPath}
                        faqs={allFaqs}
                        agencies={effectiveLocationAgencies}
                        stats={richStats}
                        countyContent={effectiveCountyContent}
                    />
                ) : (
                    <UnifiedLocationPage
                        initialLocation={effectiveLocation}
                        initialChildLocations={effectiveChildLocations}
                        initialLocationPath={effectiveLocationPath}
                        initialLocationFaqs={effectiveLocationFaqs}
                        initialLocationAgencies={effectiveLocationAgencies}
                    />
                )}
            </main>

            <BackToTop />
        </div>
    );
}
