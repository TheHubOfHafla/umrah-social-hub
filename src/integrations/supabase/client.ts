
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://annunwfjlsgrrcqfkykd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnVud2ZqbHNncnJjcWZreWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjM2NTIsImV4cCI6MjA1Njc5OTY1Mn0._Is_Kgi8wTHsQ3Z1h87JkrliCtj8lWijCJaRBJBPBCU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
