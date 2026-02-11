import { Metadata } from 'next';
import AgencyProfile from "@/_pages/AgencyProfile";
import {
  getAgencyBySlug,
  getAgencyReviews,
  getAgencySpecialisms,
  getAgencyLocations
} from "@/services/dataService";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const agency = await getAgencyBySlug(params.slug);

  if (!agency) {
    return {
      title: 'Agency Not Found | Foster Care UK',
    };
  }

  return {
    title: `${agency.name} | Foster Care Agency in ${agency.city || 'England'}`,
    description: agency.description || `${agency.name} is a foster care agency serving ${agency.city || 'England'}. Find reviews, contact details, and more.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const agency = await getAgencyBySlug(params.slug);

  if (!agency) {
    return <AgencyProfile initialAgency={null} />;
  }

  const [reviews, specialisms, locations] = await Promise.all([
    getAgencyReviews(agency.id),
    getAgencySpecialisms(agency.id),
    getAgencyLocations(agency.id)
  ]);

  return (
    <AgencyProfile
      initialAgency={agency}
      initialReviews={reviews}
      initialSpecialisms={specialisms}
      initialLocations={locations}
    />
  );
}
