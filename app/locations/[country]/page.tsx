
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

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
    const location = await getLocationBySlug(params.country);

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
            canonical: `https://www.foster-care.co.uk/locations/${params.country}`,
        },
    };
}

export default async function CountryPage({ params }: { params: { country: string } }) {
    const locationData = await getLocationBySlug(params.country);

    if (!locationData) {
        notFound();
    }

    const location = locationData as Location;

    // Verify strictly that this is a country if you have a type field, 
    // but for now relying on slug existence and dataService returning it.
    // Optional: check location.type === 'country'

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
