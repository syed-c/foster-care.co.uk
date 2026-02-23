"use client";
import { useParams } from "next/navigation";
import { useLocationFromPath, useChildLocations, useLocationPath, buildLocationUrl } from "@/hooks/useLocations";
import { useAgenciesByLocation } from "@/hooks/useAgencies";
import { useLocationContent } from "@/hooks/useLocationContent";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { CountyTemplate } from "@/components/locations/CountyTemplate";
import { Location, Agency, FAQ } from "@/services/dataService";

interface CountyPageContentProps {
    initialLocation?: Location | null;
    initialChildLocations?: Location[];
    initialLocationPath?: Location[];
    initialLocationFaqs?: FAQ[];
    initialLocationAgencies?: Agency[];
    contentSlug?: string;
}

export default function CountyPageContent({
    initialLocation,
    initialChildLocations,
    initialLocationPath,
    initialLocationAgencies,
    contentSlug,
}: CountyPageContentProps) {
    const params = useParams();
    const pathSegments = params?.country && params?.region && params?.county
        ? [params.country as string, params.region as string, params.county as string]
        : [];

    const { data: location, isLoading: locationLoading } = useLocationFromPath(pathSegments);
    const { data: childLocations } = useChildLocations(location?.id);
    const { data: locationPath } = useLocationPath(location?.id);
    const { data: locationAgencies } = useAgenciesByLocation(location?.id, 50);
    const { data: locationContent, isLoading: contentLoading } = useLocationContent(contentSlug || location?.slug);

    const effectiveLocation = location || initialLocation;
    const effectiveChildLocations = childLocations || initialChildLocations || [];
    const effectiveLocationPath = locationPath || initialLocationPath || [];
    const effectiveLocationAgencies = locationAgencies || initialLocationAgencies || [];
    
    const isLoading = !initialLocation && !location;
    const isContentLoading = !contentSlug && !locationContent;

    if (isLoading || isContentLoading) {
        return (
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1117' }}>
                <Header />
                <main className="flex-1 pt-20">
                    <section className="relative py-20 md:py-28" style={{ backgroundColor: '#0f1117' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <Skeleton className="h-6 w-64 mb-6 bg-white/10" />
                            <Skeleton className="h-16 w-[500px] mb-4 bg-white/10" />
                            <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    if (!effectiveLocation || !locationContent) {
        return (
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1117' }}>
                <Header />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <MapPin className="w-10 h-10" style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                        <h1 className="text-2xl font-extrabold mb-3" style={{ color: '#ffffff' }}>Page Not Found</h1>
                        <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>The page you're looking for doesn't exist or may have been moved.</p>
                        <Button asChild style={{ backgroundColor: '#22c55e', color: '#fff', borderRadius: '8px', padding: '12px 24px' }}>
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

    const currentPath = effectiveLocationPath ? buildLocationUrl(effectiveLocationPath) : `/locations/${effectiveLocation.slug}`;

    const getSeoTitle = () => {
        if (effectiveLocation.seo_title) return effectiveLocation.seo_title;
        return `Foster Care in ${effectiveLocation.name} | County Fostering Agencies`;
    };

    const getSeoDescription = () => {
        if (effectiveLocation.seo_description) return effectiveLocation.seo_description;
        return `Discover trusted foster care agencies in ${effectiveLocation.name}. Compare ${totalAgencies || 'local'}+ verified fostering agencies, read reviews, and start your fostering journey today.`;
    };

    const richStats = {
        childrenInCare: (totalAgencies || 25) * 12,
        boroughs: effectiveChildLocations.length || 1,
        agenciesCount: totalAgencies || 25,
    };

    const seoTitle = getSeoTitle();
    const seoDescription = getSeoDescription();

    const getPlaceSchema = () => {
        return {
            "@context": "https://schema.org",
            "@type": "AdministrativeArea",
            "name": effectiveLocation.name,
            "description": `Foster care services and information for ${effectiveLocation.name}`,
            "url": `https://www.foster-care.co.uk${currentPath}`,
        };
    };

    const placeSchema = getPlaceSchema();

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            <SEOHead
                title={seoTitle}
                description={seoDescription}
                canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
                breadcrumbs={breadcrumbItems}
                structuredData={placeSchema}
            />
            <Header />

            <main className="flex-1">
                <CountyTemplate
                    location={effectiveLocation}
                    childLocations={effectiveChildLocations}
                    path={effectiveLocationPath}
                    agencies={effectiveLocationAgencies}
                    stats={richStats}
                    contentSlug={contentSlug}
                />
            </main>

            <BackToTop />
        </div>
    );
}
