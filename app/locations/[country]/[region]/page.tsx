
import { Metadata } from 'next';
import UnifiedLocationPage from '@/_pages/UnifiedLocationPage';
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

export async function generateMetadata({ params }: { params: { country: string; region: string } }): Promise<Metadata> {
    const locationSlug = params.region;

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
            canonical: `https://www.foster-care.co.uk/locations/${params.country}/${params.region}`,
        },
    };
}

export default async function RegionPage({ params }: { params: { country: string; region: string } }) {
    const serviceSlugs = ['parent-child', 'short-term', 'respite', 'emergency', 'therapeutic', 'long-term', 'sibling-groups', 'teenagers', 'asylum-seekers', 'disabilities', 'short-term-fostering', 'long-term-fostering', 'emergency-fostering', 'respite-fostering', 'therapeutic-fostering', 'parent-child-fostering', 'sibling-groups-fostering', 'teenagers-fostering', 'asylum-seekers-fostering', 'disabilities-fostering'];

    if (params.country === params.region || serviceSlugs.includes(params.region)) {
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
