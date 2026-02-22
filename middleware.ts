import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Location URL Cleanups & Redirects
    if (pathname.startsWith('/locations/')) {
        const segments = pathname.split('/').filter(Boolean);
        // segments[0] is 'locations'

        if (segments.length >= 2) {
            const validCountries = ['england', 'scotland', 'wales', 'northern-ireland'];
            const serviceSlugs = [
                'parent-child', 'short-term', 'respite', 'emergency', 'therapeutic', 'long-term',
                'sibling-groups', 'teenagers', 'asylum-seekers', 'disabilities',
                'short-term-fostering', 'long-term-fostering', 'emergency-fostering',
                'respite-fostering', 'therapeutic-fostering', 'parent-child-fostering',
                'sibling-groups-fostering', 'teenagers-fostering', 'asylum-seekers-fostering',
                'disabilities-fostering'
            ];

            // Get segments after 'locations'
            let pathSegments = segments.slice(1);

            // Check if this is a service-only URL (e.g., /locations/england/short-term)
            // If so, don't modify it - let it through to the service page
            if (pathSegments.length === 2 && validCountries.includes(pathSegments[0].toLowerCase()) && serviceSlugs.includes(pathSegments[1].toLowerCase())) {
                return await updateSession(request);
            }

            // Check if this is region+service URL (e.g., /locations/england/london/short-term)
            // If so, don't modify it - let it through to the service page
            if (pathSegments.length === 3 && validCountries.includes(pathSegments[0].toLowerCase()) && serviceSlugs.includes(pathSegments[2].toLowerCase())) {
                return await updateSession(request);
            }

            // Remove service slugs from other paths
            pathSegments = pathSegments.filter(s => !serviceSlugs.includes(s.toLowerCase()));

            // Remove consecutive duplicates
            let normalized: string[] = [];
            for (const s of pathSegments) {
                if (normalized.length === 0 || s.toLowerCase() !== normalized[normalized.length - 1].toLowerCase()) {
                    normalized.push(s);
                }
            }

            // Ensure starts with valid country
            if (normalized.length > 0 && !validCountries.includes(normalized[0].toLowerCase())) {
                normalized.unshift('england');
            }

            // Limit to 3 segments max
            if (normalized.length > 3) {
                normalized = normalized.slice(0, 3);
            }

            const newPathname = `/locations/${normalized.join('/')}`;
            const targetUrl = new URL(newPathname, request.url);

            // Normalize current path for comparison
            const currentPathNormalized = pathname.toLowerCase().replace(/\/+$/, '');
            const newPathNormalized = targetUrl.pathname.toLowerCase().replace(/\/+$/, '');

            if (newPathNormalized !== currentPathNormalized && newPathNormalized !== "") {
                return NextResponse.redirect(targetUrl, { status: 301 });
            }
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
    ],
};
