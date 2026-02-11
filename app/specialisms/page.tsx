import { Metadata } from 'next';
import SpecialismsIndex from "@/_pages/SpecialismsIndex";
import { getSpecialisms } from "@/services/dataService";

export const metadata: Metadata = {
  title: 'Types of Foster Care | Specialisms & Services | Foster Care UK',
  description: 'Discover different fostering specialisms in England. Find agencies matching your interests and skills.',
};

export default async function Page() {
  const specialisms = await getSpecialisms();

  return <SpecialismsIndex initialSpecialisms={specialisms} />;
}
