import { Metadata } from 'next';
import AgenciesListing from "@/_pages/AgenciesListing";
import { getAgencies } from "@/services/dataService";

export const metadata: Metadata = {
  title: 'Find Foster Care Agencies | Foster Care UK',
  description: 'Browse our comprehensive directory of verified foster care agencies across the UK. Compare services, read reviews, and start your fostering journey.',
};

export default async function Page() {
  const agencies = await getAgencies({ limit: 50 });

  return <AgenciesListing initialAgencies={agencies} />;
}
