'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/integrations/supabase/types';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
    if (client) return client;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase env vars missing. Client creation skipped.');
        return {
            auth: {
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: null }),
                        maybeSingle: () => Promise.resolve({ data: null, error: null }),
                    }),
                    order: () => Promise.resolve({ data: [], error: null }),
                }),
            }),
        } as unknown as ReturnType<typeof createBrowserClient<Database>>;
    }

    client = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    return client;
}

// Default export for backward compatibility with existing hooks/components
// that import { supabase } from "@/integrations/supabase/client"
// During migration, we also re-export from the old path
export const supabase = createClient();
