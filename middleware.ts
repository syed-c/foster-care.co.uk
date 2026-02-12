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

            let newSegments = segments.slice(1); // everything after 'locations'

            // 1. Remove service slugs
            newSegments = newSegments.filter(s => !serviceSlugs.includes(s.toLowerCase()));

            // 2. Remove consecutive duplicates (e.g., england/england -> england)
            newSegments = newSegments.filter((s, i) => s.toLowerCase() !== newSegments[i - 1]?.toLowerCase());

            // 3. Ensure starts with valid country
            if (newSegments.length > 0 && !validCountries.includes(newSegments[0].toLowerCase())) {
                newSegments.unshift('england');
            }

            // 4. Limit to 3 segments max (country/region/county)
            if (newSegments.length > 3) {
                newSegments = newSegments.slice(0, 3);
            }

            const newPath = `/locations/${newSegments.join('/')}`;
            const currentPath = `/${segments.join('/')}`;

            if (newPath.toLowerCase() !== currentPath.toLowerCase()) {
                // Redirect to the cleaned path
                return NextResponse.redirect(new URL(newPath, request.url), { status: 301 });
            }
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon)
         * - Static assets (svg, png, jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
    ],
};
