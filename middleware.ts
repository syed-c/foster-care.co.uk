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

            // 1. Remove service slugs
            pathSegments = pathSegments.filter(s => !serviceSlugs.includes(s.toLowerCase()));

            // 2. Remove consecutive duplicates
            let normalized: string[] = [];
            for (const s of pathSegments) {
                if (normalized.length === 0 || s.toLowerCase() !== normalized[normalized.length - 1].toLowerCase()) {
                    normalized.push(s);
                }
            }

            // 3. Ensure starts with valid country
            if (normalized.length > 0 && !validCountries.includes(normalized[0].toLowerCase())) {
                normalized.unshift('england');
            }

            // 4. Limit to 3 segments max
            if (normalized.length > 3) {
                normalized = normalized.slice(0, 3);
            }

            const newPathname = `/locations/${normalized.join('/')}`;
            const targetUrl = new URL(newPathname, request.url);

            // Normalize current path for comparison (remove trailing slashes, lowercase)
            const currentPathNormalized = pathname.toLowerCase().replace(/\/+$/, '');
            const newPathNormalized = targetUrl.pathname.toLowerCase().replace(/\/+$/, '');

            if (newPathNormalized !== currentPathNormalized && newPathNormalized !== "") {
                // Only redirect if the path actually changed structurally
                return NextResponse.redirect(targetUrl, { status: 301 });
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
