'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/integrations/supabase/types';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
    if (client) return client;

    client = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    return client;
}

// Default export for backward compatibility with existing hooks/components
// that import { supabase } from "@/integrations/supabase/client"
// During migration, we also re-export from the old path
export const supabase = createClient();
