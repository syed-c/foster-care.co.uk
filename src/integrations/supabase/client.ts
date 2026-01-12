import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zncoqlwqkbhigusmulmr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuY29xbHdxa2JoaWd1c211bG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTEyNDQsImV4cCI6MjA4MjEyNzI0NH0.X0QhuYE15NaKBnnvT3aMLiVSURNGaR1J3EDHWSGSbYs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
