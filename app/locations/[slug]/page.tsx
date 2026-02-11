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
  Agency,
  FAQ,
  CmsContent
} from '@/services/dataService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const location = await getLocationBySlug(params.slug);
  const name = location?.name || params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `Foster Care Agencies in ${name} | Foster Care UK`,
    description: `Find the best foster care agencies in ${name}. Compare services, read reviews, and connect with verified fostering agencies in your area.`,
    openGraph: {
      title: `Foster Care Agencies in ${name} | Foster Care UK`,
      description: `Find the best foster care agencies in ${name}. Compare services and read reviews.`,
    },
    alternates: {
      canonical: `https://www.foster-care.co.uk/locations/${params.slug}`,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const locationData = await getLocationBySlug(params.slug);

  if (!locationData) {
    return <UnifiedLocationPage initialLocation={null} />;
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
    getCmsContentByPage(`location_${params.slug}`)
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