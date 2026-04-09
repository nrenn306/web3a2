//https://www.mintlify.com/joaoelian204/Portal-Ciudadano-Manta-web/deployment/environment-variables

import { createClient } from "@supabase/supabase-js";

//Vite environment variables are accessed via import.meta.env
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

