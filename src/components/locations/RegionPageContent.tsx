"use client";
import { Header } from "@/components/layout/Header";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { RegionTemplate } from "@/components/locations/RegionTemplate";
import { Location, Agency } from "@/services/dataService";

interface RegionPageContentProps {
    initialLocation?: Location | null;
    initialContent?: any;
    agencies?: Agency[];
    contentSlug?: string;
}

export default function RegionPageContent({
    initialLocation,
    initialContent,
    agencies = [],
    contentSlug,
}: RegionPageContentProps) {
    const effectiveLocation = initialLocation;
    const effectiveContent = initialContent;

    if (!effectiveLocation || !effectiveContent) {
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

    const currentPath = `/locations/${effectiveLocation.slug}`;

    const getSeoTitle = () => {
        if (effectiveLocation.seo_title) return effectiveLocation.seo_title;
        return `Foster Care in ${effectiveLocation.name} | Regional Fostering Agencies`;
    };

    const getSeoDescription = () => {
        if (effectiveLocation.seo_description) return effectiveLocation.seo_description;
        return `Discover trusted foster care agencies in ${effectiveLocation.name}. Compare local fostering agencies and start your journey today.`;
    };

    const seoTitle = getSeoTitle();
    const seoDescription = getSeoDescription();

    const placeSchema = {
        "@context": "https://schema.org",
        "@type": "AdministrativeArea",
        "name": effectiveLocation.name,
        "description": `Foster care services and information for ${effectiveLocation.name}`,
        "url": `https://www.foster-care.co.uk${currentPath}`,
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            <SEOHead
                title={seoTitle}
                description={seoDescription}
                canonicalUrl={`https://www.foster-care.co.uk${currentPath}`}
                structuredData={placeSchema}
            />
            <Header />

            <main className="flex-1">
                <RegionTemplate
                    location={effectiveLocation}
                    agencies={agencies}
                    stats={{ childrenInCare: 0, boroughs: 0, agenciesCount: 0 }}
                    path={[]}
                    initialContent={effectiveContent}
                />
            </main>

            <BackToTop />
        </div>
    );
}
