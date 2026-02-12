import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Handle legacy location redirects (e.g. /locations/london -> /locations/england/london)
    if (pathname.startsWith('/locations/')) {
        const segments = pathname.split('/').filter(Boolean);
        // segments[0] is 'locations'
        // segments[1] is the country or region
        if (segments.length >= 2) {
            const firstSegment = segments[1].toLowerCase();
            const validCountries = ['england', 'scotland', 'wales', 'northern-ireland'];

            // If the first segment is NOT a country, prepend 'england'
            // Exclude static assets or other known paths if necessary (though matcher handles assets)
            if (!validCountries.includes(firstSegment)) {
                // Construct new URL: /locations/england/{rest of path}
                const newPath = `/locations/england/${segments.slice(1).join('/')}`;
                return NextResponse.redirect(new URL(newPath, request.url));
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
