/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Leave unset to run without cloud sync. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Safe in the browser: row level security protects the data. */
  readonly VITE_SUPABASE_KEY?: string;
}
