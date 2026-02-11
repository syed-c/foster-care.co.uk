import { Metadata } from 'next';
import UnifiedLocationPage from '@/_pages/UnifiedLocationPage';
import {
  getLocationFromPath,
  getChildLocations,
  getLocationPath,
  getFaqsByLocation,
  getAgenciesByLocation,
  getCmsContentByPage,
  getSpecialismBySlug,
  getAgenciesByLocationAndSpecialism,
  Location,
  Specialism,
  Agency
} from '@/services/dataService';
import { STATIC_SPECIALISMS } from "@/constants/specialisms";

const SPECIALISM_SLUGS = new Set(STATIC_SPECIALISMS.map(s => s.slug));

export async function generateMetadata({ params }: { params: { segments: string[] } }): Promise<Metadata> {
  const { segments } = params;
  const lastSegment = segments[segments.length - 1];
  const isSpecialism = SPECIALISM_SLUGS.has(lastSegment);

  const targetSegments = isSpecialism ? segments.slice(0, -1) : segments;
  const location = await getLocationFromPath(targetSegments);

  const locationName = location?.name || targetSegments[targetSegments.length - 1].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const specialismName = isSpecialism ? STATIC_SPECIALISMS.find(s => s.slug === lastSegment)?.name : '';

  const title = isSpecialism
    ? `${specialismName} Foster Care in ${locationName} | Foster Care UK`
    : `Foster Care Agencies in ${locationName} | Foster Care UK`;

  return {
    title,
    description: `Find verified foster care agencies in ${locationName}. Compare services and read reviews.`,
    alternates: {
      canonical: `https://www.foster-care.co.uk/locations/${segments.join('/')}`,
    },
  };
}

export default async function Page({ params }: { params: { segments: string[] } }) {
  const { segments } = params;
  const lastSegment = segments[segments.length - 1];
  const isSpecialism = SPECIALISM_SLUGS.has(lastSegment);

  const targetSegments = isSpecialism ? segments.slice(0, -1) : segments;
  const location = await getLocationFromPath(targetSegments);

  if (!location) {
    return <UnifiedLocationPage initialLocation={null} />;
  }

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
    getCmsContentByPage(`location_${targetSegments[targetSegments.length - 1]}`)
  ]);

  let specialism = null;
  let specialismAgencies = [];

  if (isSpecialism) {
    [specialism, specialismAgencies] = await Promise.all([
      getSpecialismBySlug(lastSegment),
      getAgenciesByLocationAndSpecialism(location.id, lastSegment)
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
