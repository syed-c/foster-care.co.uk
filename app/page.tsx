import { Metadata } from 'next';
import Index from '@/_pages/Index';

export const metadata: Metadata = {
  title: 'Foster Care UK — Find Trusted Foster Care Agencies Near You',
  description: 'Compare 500+ verified foster care agencies across the UK. Read real reviews, compare services, and find the right fostering agency for your journey.',
  keywords: [
    'foster care',
    'foster care agencies',
    'fostering agencies UK',
    'become a foster carer',
    'foster care near me',
    'fostering services',
    'foster carer',
    'foster agency reviews',
    'independent fostering agency',
    'UK fostering',
  ],
  openGraph: {
    title: 'Foster Care UK — Find Trusted Foster Care Agencies',
    description: 'Compare 500+ verified foster care agencies across the UK. Read real reviews and find the right fostering agency for your journey.',
    url: 'https://www.foster-care.co.uk',
    siteName: 'Foster Care UK',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foster Care UK — Find Trusted Foster Care Agencies',
    description: 'Compare 500+ verified foster care agencies across the UK.',
  },
  alternates: {
    canonical: 'https://www.foster-care.co.uk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  return <Index />;
}