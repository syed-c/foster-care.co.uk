
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
}

export async function generateMetadata({ params }: { params: { country: string; region: string } }): Promise<Metadata> {
    if (SERVICE_SLUGS.includes(params.region)) {
        const countryData = await getLocationBySlug(params.country);
        const countryName = countryData?.name || params.country;
        const serviceName = params.region.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        
        return {
            title: `${serviceName} Fostering in ${countryName} | Foster Care UK`,
            description: `Learn about ${serviceName.toLowerCase()} fostering in ${countryName}. Find agencies and support available.`,
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}`,
            },
        };
    }

    const locationSlug = params.region;
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
            canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}`,
        },
    };
}

export default async function RegionPage({ params }: { params: { country: string; region: string } }) {
    if (SERVICE_SLUGS.includes(params.region)) {
        const countryData = await getLocationBySlug(params.country);
        const locationName = countryData?.name || params.country;
        
        return (
            <ServiceTemplate
                locationSlug={params.country}
                serviceSlug={params.region}
                locationName={locationName}
            />
        );
    }

    if (params.country === params.region) {
        notFound();
    }

    const locationSlug = params.region;
    const contentSlug = `${params.country}/${params.region}`;

    const [locationData, locationAgencies, initialContent] = await Promise.all([
        getLocationBySlug(locationSlug),
        null,
        getLocationContent(contentSlug)
    ]);

    if (!locationData || !initialContent) {
        notFound();
    }

    const location = locationData as Location;

    return (
        <RegionPageContent
            initialLocation={location}
            initialContent={initialContent}
            agencies={locationAgencies || []}
            contentSlug={contentSlug}
        />
    );
}
