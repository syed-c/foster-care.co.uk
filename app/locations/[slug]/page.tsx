import { Metadata } from 'next';
import UnifiedLocationPage from '@/_pages/UnifiedLocationPage';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Foster Care Agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} | Foster Care UK`,
    description: `Find the best foster care agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}. Compare services, read reviews, and connect with verified fostering agencies in your area.`,
    openGraph: {
      title: `Foster Care Agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} | Foster Care UK`,
      description: `Find the best foster care agencies in ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}. Compare services and read reviews.`,
    },
    alternates: {
      canonical: `https://www.foster-care.co.uk/locations/${params.slug}`,
    },
  };
}

export default function Page() {
  return <UnifiedLocationPage />;
}