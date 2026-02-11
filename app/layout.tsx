import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.foster-care.co.uk'),
    title: {
        default: 'Foster Care Agencies UK | Compare 500+ Verified Fostering Services | Foster Care UK',
        template: '%s | Foster Care UK - Find Trusted Agencies',
    },
    description:
        'Compare 500+ verified foster care agencies across the UK. Find emergency, short-term & long-term fostering services. Read real reviews, compare allowances, and connect with trusted agencies near you.',
    keywords: [
        'foster care agencies uk',
        'foster care agencies near me',
        'fostering agencies uk',
        'become a foster carer uk',
        'emergency fostering agencies',
        'therapeutic fostering uk',
        'foster care allowance',
        'independent fostering agency',
        'uk fostering services',
        'foster agency reviews',
        'short term fostering',
        'long term fostering',
        'respite fostering uk',
        'parent and child fostering',
        'foster care england',
        'foster care scotland',
        'foster care wales',
        'foster care northern ireland'
    ],
    openGraph: {
        type: 'website',
        locale: 'en_GB',
        url: 'https://www.foster-care.co.uk',
        siteName: 'Foster Care UK',
        title: 'Foster Care UK — Find Trusted Foster Care Agencies',
        description:
            'Compare 500+ verified foster care agencies across the UK. Read real reviews and find the right fostering agency for your journey.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Foster Care UK — Find Trusted Foster Care Agencies',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Foster Care UK — Find Trusted Foster Care Agencies',
        description:
            'Compare 500+ verified foster care agencies across the UK. Read real reviews and find the right fostering agency for your journey.',
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
    verification: {
        google: 'googlee22e01f4ffca003f',
    },
    alternates: {
        canonical: 'https://www.foster-care.co.uk',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light" suppressHydrationWarning>
            <body className={`${plusJakartaSans.variable} font-sans antialiased bg-white text-black`}>
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
