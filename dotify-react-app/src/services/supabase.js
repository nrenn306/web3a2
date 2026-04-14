/**
 * supabase.js - this file connects to Supabase using the URL and API key stored in environment variables
 * used throughout the app to connect to the database and auth
 */

//https://www.mintlify.com/joaoelian204/Portal-Ciudadano-Manta-web/deployment/environment-variables

import { createClient } from "@supabase/supabase-js";

/**
 * createClient takes in the URL and API key to connect to our Supabase project
 */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

