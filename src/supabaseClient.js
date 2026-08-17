import { createClient } from "@supabase/supabase-js";

// Kedua value ini diambil dari environment variable, JANGAN di-hardcode.
// - Waktu develop di laptop: taruh di file .env (lihat .env.example)
// - Waktu di-deploy: set di Netlify dashboard > Site settings > Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
