
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables are expected to be available at runtime.
// For local development, define SUPABASE_URL and SUPABASE_ANON_KEY on window.
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
