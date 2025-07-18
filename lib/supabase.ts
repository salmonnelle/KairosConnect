// Re-export Supabase client under a simpler path so both `@/lib/supabase` and `@/lib/supabaseClient` work.
// This avoids module-not-found errors when legacy imports still reference `@/lib/supabase`.

export { supabase } from "./supabaseClient";
