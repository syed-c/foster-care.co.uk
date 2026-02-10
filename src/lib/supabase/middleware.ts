import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // IMPORTANT: Do NOT run any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could lead to users
    // being un-authenticatable for very hard-to-debug reasons.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected route checks
    const pathname = request.nextUrl.pathname;

    // Admin routes require authentication
    if (pathname.startsWith('/admin') && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Agency workspace routes require authentication
    if (pathname.startsWith('/workspace') && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Dashboard requires authentication
    if (pathname === '/dashboard' && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
