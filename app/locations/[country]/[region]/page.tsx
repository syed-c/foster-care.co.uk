
import { Metadata } from 'next';
import { ServiceTemplate } from '@/components/locations/ServiceTemplate';
import RegionPageContent from '@/components/locations/RegionPageContent';
import {
    getLocationBySlug,
    getAgenciesByLocation,
    Location,
} from '@/services/dataService';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';

const SERVICE_SLUGS = ['short-term', 'long-term', 'emergency', 'respite', 'parent-child', 'therapeutic', 'sibling-groups', 'teenagers', 'asylum-seekers', 'disabilities', 'short-term-fostering', 'long-term-fostering', 'emergency-fostering', 'respite-fostering', 'therapeutic-fostering', 'parent-child-fostering', 'sibling-groups-fostering', 'teenagers-fostering', 'asylum-seekers-fostering', 'disabilities-fostering'];

async function getLocationContent(slug: string) {
    try {
        const { data } = await supabase
            .from("location_content")
            .select("*")
            .eq("slug", slug.toLowerCase())
            .maybeSingle();
        
        if (!data?.content) return null;
        
        if (typeof data.content === 'string') {
            try {
                return JSON.parse(data.content);
            } catch {
                return null;
            }
        }
        
        return data.content;
    } catch (error) {
        console.error('Error fetching location content:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; region: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { country: countryParam, region: regionParam } = resolvedParams;
    
    if (SERVICE_SLUGS.includes(regionParam)) {
        const countryData = await getLocationBySlug(countryParam);
        const countryName = countryData?.name || countryParam;
        const serviceName = regionParam.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        
        return {
            title: `${serviceName} Fostering in ${countryName} | Foster Care UK`,
            description: `Learn about ${serviceName.toLowerCase()} fostering in ${countryName}. Find agencies and support available.`,
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/${countryParam}/${regionParam}`,
            },
        };
    }

    const locationSlug = regionParam;
    const location = await getLocationBySlug(locationSlug);

    if (!location) {
        return {};
    }

    const name = location.name;

    return {
        title: `Foster Care in ${name} | Start Your Fostering Journey | Foster Care UK`,
        description: `Discover how you can make a life-changing difference. Become a foster carrier in ${name}. Compare local agencies, access 24/7 support, and start your journey today.`,
        openGraph: {
            title: `Foster Care in ${name} | Start Your Fostering Journey`,
            description: `Become a foster carrier in ${name}. Search verified local agencies and start your journey today.`,
        },
        alternates: {
            canonical: `https://www.foster-care.co.uk/locations/${countryParam}/${regionParam}`,
        },
    };
}

export default async function RegionPage({ params }: { params: Promise<{ country: string; region: string }> }) {
    const resolvedParams = await params;
    const { country: countryParam, region: regionParam } = resolvedParams;
    
    if (SERVICE_SLUGS.includes(regionParam)) {
        const countryData = await getLocationBySlug(countryParam);
        const locationName = countryData?.name || countryParam;
        
        return (
            <ServiceTemplate
                locationSlug={countryParam}
                serviceSlug={regionParam}
                locationName={locationName}
            />
        );
    }

    if (countryParam === regionParam) {
        return <div>Invalid route</div>;
    }

    const locationSlug = regionParam;
    const contentSlug = `${countryParam}/${regionParam}`;

    let initialContent = null;
    let locationData = null;
    
    try {
        [locationData, initialContent] = await Promise.all([
            getLocationBySlug(locationSlug),
            getLocationContent(contentSlug)
        ]);
    } catch (error) {
        console.error('Error fetching region data:', error);
    }

    // If location exists but no content, show 404
    if (!locationData) {
        return <div>Location not found</div>;
    }
    
    // If no content, also show 404 (to avoid duplicate content issues)
    if (!initialContent) {
        return <div>Content not found</div>;
    }

    const location = locationData as Location;

    return (
        <RegionPageContent
            initialLocation={location}
            initialContent={initialContent}
            agencies={[]}
            contentSlug={contentSlug}
        />
    );
}
