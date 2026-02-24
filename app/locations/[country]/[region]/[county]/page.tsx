
import { Metadata } from 'next';
import { ServiceTemplate } from '@/components/locations/ServiceTemplate';
import CountyPageContent from '@/_pages/CountyPageContent';
import {
    getLocationBySlug,
    getChildLocations,
    getLocationPath,
    getFaqsByLocation,
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

export async function generateMetadata({ params }: { params: { country: string; region: string; county: string } }): Promise<Metadata> {
    if (SERVICE_SLUGS.includes(params.county)) {
        const countryData = await getLocationBySlug(params.country);
        const regionData = await getLocationBySlug(params.region);
        
        const countryName = countryData?.name || params.country;
        const regionName = regionData?.name || params.region;
        const serviceName = params.county.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        
        return {
            title: `${serviceName} Fostering in ${regionName}, ${countryName} | Foster Care UK`,
            description: `Learn about ${serviceName.toLowerCase()} fostering in ${regionName}, ${countryName}. Find agencies and support available.`,
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}/${params.county}`,
            },
        };
    }

    const locationSlug = params.county;
    const location = await getLocationBySlug(locationSlug);

    if (!location) {
        return {};
    }

    const name = location.name;

    return {
        title: `Foster Care in ${name} | Start Your Fostering Journey | Foster Care UK`,
        description: `Discover how you can make a life-changing difference. Become a foster carer in ${name}. Compare local agencies, access 24/7 support, and start your journey today.`,
        openGraph: {
            title: `Foster Care in ${name} | Start Your Fostering Journey`,
            description: `Become a foster carer in ${name}. Search verified local agencies and start your journey today.`,
        },
        alternates: {
            canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}/${params.county}`,
        },
    };
}

export default async function CountyPage({ params }: { params: { country: string; region: string; county: string } }) {
    if (SERVICE_SLUGS.includes(params.county)) {
        const countryData = await getLocationBySlug(params.country);
        const regionData = await getLocationBySlug(params.region);
        
        const locationName = regionData?.name || params.region;
        
        return (
            <ServiceTemplate
                locationSlug={`${params.country}/${params.region}`}
                serviceSlug={params.county}
                locationName={locationName}
            />
        );
    }

    if (
        params.country === params.county ||
        params.region === params.county ||
        params.country === params.region
    ) {
        notFound();
    }

    const locationSlug = params.county;
    const contentSlug = `${params.country}/${params.region}/${params.county}`;

    const [locationData, childLocations, locationPath, locationAgencies, initialContent] = await Promise.all([
        getLocationBySlug(locationSlug),
        null,
        null,
        null,
        getLocationContent(contentSlug)
    ]);

    if (!locationData || !initialContent) {
        notFound();
    }

    const location = locationData as Location;

    return (
        <CountyPageContent
            initialLocation={location}
            initialContent={initialContent}
            contentSlug={contentSlug}
        />
    );
}
