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
    title: `Foster Care in ${name} | Start Your Fostering Journey | Foster Care UK`,
    description: `Discover how you can make a life-changing difference. Become a foster carer in ${name}. Compare local agencies, access 24/7 support, and start your journey today.`,
    openGraph: {
      title: `Foster Care in ${name} | Start Your Fostering Journey`,
      description: `Become a foster carer in ${name}. Search verified local agencies and start your journey today.`,
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