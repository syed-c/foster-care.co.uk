import { Metadata } from 'next';
import LocationPage from '@/_pages/LocationPage';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Foster Care Agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} | Foster Care UK`,
    description: `Find the best foster care agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}. Compare services, read reviews, and connect with verified fostering agencies in your area.`,
    openGraph: {
      title: `Foster Care Agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} | Foster Care UK`,
      description: `Find the best foster care agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}. Compare services and read reviews.`,
    },
    alternates: {
      canonical: `https://fostercare.uk/locations/${params.slug}`,
    },
  };
}

export default function Page() {
  return <LocationPage />;
}