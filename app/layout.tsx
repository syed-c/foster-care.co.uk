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
    metadataBase: new URL('https://fostercare.uk'),
    title: {
        default: 'Foster Care UK — Find Trusted Foster Care Agencies Near You',
        template: '%s | Foster Care UK',
    },
    description:
        'Compare 500+ verified foster care agencies across the UK. Read real reviews, compare services, and find the right fostering agency for your journey.',
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
        type: 'website',
        locale: 'en_GB',
        url: 'https://fostercare.uk',
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
        canonical: 'https://fostercare.uk',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
