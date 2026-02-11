
import { Metadata } from 'next';
import UnifiedLocationPage from '@/_pages/UnifiedLocationPage';
import {
    getLocationBySlug,
    getChildLocations,
    getLocationPath,
    getFaqsByLocation,
    getAgenciesByLocation,
    getCmsContentByPage,
    getSpecialismBySlug,
    getAgenciesByLocationAndSpecialism,
    Location,
} from '@/services/dataService';
import { notFound } from 'next/navigation';
import { STATIC_SPECIALISMS } from "@/constants/specialisms";

const SPECIALISM_SLUGS = new Set(STATIC_SPECIALISMS.map(s => s.slug));

export async function generateMetadata({ params }: { params: { country: string; region: string } }): Promise<Metadata> {
    const isSpecialism = SPECIALISM_SLUGS.has(params.region);
    const locationSlug = isSpecialism ? params.country : params.region;

    const location = await getLocationBySlug(locationSlug);

    if (!location) {
        return {};
    }

    const name = location.name;

    if (isSpecialism) {
        const specialismName = STATIC_SPECIALISMS.find(s => s.slug === params.region)?.name || '';
        return {
            title: `${specialismName} Foster Care in ${name} | Foster Care UK`,
            description: `Looking for ${specialismName} in ${name}? Connect with verified agencies specializing in ${specialismName} across ${name}.`,
            alternates: {
                canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}`,
            },
        };
    }

    return {
        title: `Foster Care in ${name} | Start Your Fostering Journey | Foster Care UK`,
        description: `Discover how you can make a life-changing difference. Become a foster carer in ${name}. Compare local agencies, access 24/7 support, and start your journey today.`,
        openGraph: {
            title: `Foster Care in ${name} | Start Your Fostering Journey`,
            description: `Become a foster carer in ${name}. Search verified local agencies and start your journey today.`,
        },
        alternates: {
            canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}`,
        },
    };
}

export default async function RegionPage({ params }: { params: { country: string; region: string } }) {
    const isSpecialism = SPECIALISM_SLUGS.has(params.region);
    const locationSlug = isSpecialism ? params.country : params.region;

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

    let specialism = null;
    let specialismAgencies: any[] = [];

    if (isSpecialism) {
        [specialism, specialismAgencies] = await Promise.all([
            getSpecialismBySlug(params.region),
            getAgenciesByLocationAndSpecialism(location.id, params.region)
        ]);
    }

    return (
        <UnifiedLocationPage
            initialLocation={location}
            initialChildLocations={childLocations}
            initialLocationPath={locationPath}
            initialLocationFaqs={locationFaqs}
            initialLocationAgencies={locationAgencies}
            initialCmsContent={cmsContent}
            initialSpecialism={specialism}
            initialSpecialismAgencies={specialismAgencies}
        />
    );
}
