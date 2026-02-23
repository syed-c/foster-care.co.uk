
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
import { CountryPageClient } from './CountryPageClient';

const SERVICE_SLUGS = ['short-term', 'long-term', 'emergency', 'respite', 'parent-child', 'therapeutic'];

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
    if (SERVICE_SLUGS.includes(params.country)) {
        const serviceName = params.country.charAt(0).toUpperCase() + params.country.slice(1);
        
        return {
            title: `${serviceName} Fostering in England | Foster Care UK`,
            description: `Learn about ${serviceName.toLowerCase()} fostering in England. Find agencies and support available.`,
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/england/${params.country}`,
            },
        };
    }

    const location = await getLocationBySlug(params.country);

    if (!location) {
        return {};
    }

    const name = location.name;

    if (location.slug === "england") {
        return {
            title: "Fostering Agencies in England | Find Trusted Foster Care",
            description: "Explore trusted fostering agencies in England. Compare support, training, and Ofsted-rated services to find the right match for your fostering journey.",
            openGraph: {
                title: "Fostering Agencies in England | Find Trusted Foster Care",
                description: "Explore trusted fostering agencies in England. Compare support, training, and Ofsted-rated services to find the right match for your fostering journey.",
            },
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/${params.country}`,
            },
        };
    }

    return {
        title: `Foster Care in ${name} | Start Your Fostering Journey | Foster Care UK`,
        description: `Discover how you can make a life-changing difference. Become a foster carrier in ${name}. Search verified local agencies and start your journey today.`,
        openGraph: {
            title: `Foster Care in ${name} | Start Your Fostering Journey`,
            description: `Become a foster carrier in ${name}. Search verified local agencies and start your journey today.`,
        },
        alternates: {
            canonical: `https://www.foster-care.co.uk/locations/${params.country}`,
        },
    };
}

interface Props {
    params: { country: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CountryPage({ params, searchParams }: Props) {
    if (SERVICE_SLUGS.includes(params.country)) {
        return (
            <ServiceTemplate
                locationSlug="england"
                serviceSlug={params.country}
                locationName="England"
            />
        );
    }

    const locationData = await getLocationBySlug(params.country);

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
        getCmsContentByPage(`location_${params.country}`)
    ]);

    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
    const service = typeof searchParams.service === 'string' ? searchParams.service : undefined;
    const locationFilter = typeof searchParams.location === 'string' ? searchParams.location : undefined;

    const hasFilters = !!(type && service && locationFilter);

    return (
        <CountryPageClient
            location={location}
            childLocations={childLocations}
            locationPath={locationPath}
            locationFaqs={locationFaqs}
            locationAgencies={locationAgencies}
            cmsContent={cmsContent}
            filterType={type}
            filterService={service}
            filterLocation={locationFilter}
            showFilteredAgencies={hasFilters}
        />
    );
}
