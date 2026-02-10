// Supabase client — updated for Next.js migration
// This file maintains backward compatibility for existing hooks/components
// that import { supabase } from "@/integrations/supabase/client"
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);