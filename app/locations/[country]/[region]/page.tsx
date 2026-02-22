
import { Metadata } from 'next';
import UnifiedLocationPage from '@/_pages/UnifiedLocationPage';
import { ServiceTemplate } from '@/components/locations/ServiceTemplate';
import {
    getLocationBySlug,
    getChildLocations,
    getLocationPath,
    getFaqsByLocation,
    getAgenciesByLocation,
    getCmsContentByPage,
    Location,
} from '@/services/dataService';
import { notFound } from 'next/navigation';

const SERVICE_SLUGS = ['short-term', 'long-term', 'emergency', 'respite', 'parent-child', 'therapeutic'];

export async function generateMetadata({ params }: { params: { country: string; region: string } }): Promise<Metadata> {
    if (SERVICE_SLUGS.includes(params.region)) {
        const countryData = await getLocationBySlug(params.country);
        const countryName = countryData?.name || params.country;
        const serviceName = params.region.charAt(0).toUpperCase() + params.region.slice(1);
        
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
    // Check if it's a service slug
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

    // Otherwise, render as a region page
    if (params.country === params.region) {
        notFound();
    }

    const locationSlug = params.region;
    const locationData = await getLocationBySlug(locationSlug);

    if (!locationData) {
        notFound();
    }

    const location = locationData as Location;

    const [
        childLocations,
        locationPath,
        locationFaqs,
        locationAgencies,
        cmsContent
    ] = await Promise.all([
        getChildLocations(location.id),
        getLocationPath(location.id),
        getFaqsByLocation(location.id),
        getAgenciesByLocation(location.id, 50),
        getCmsContentByPage(`location_${locationSlug}`)
    ]);

    return (
        <UnifiedLocationPage
            initialLocation={location}
            initialChildLocations={childLocations}
            initialLocationPath={locationPath}
            initialLocationFaqs={locationFaqs}
            initialLocationAgencies={locationAgencies}
            initialCmsContent={cmsContent}
        />
    );
}
