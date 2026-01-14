
import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to null if not configured yet, to prevent app crash during initial dev
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export default supabase;
