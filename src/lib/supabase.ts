import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** True only when both env vars are present, so the app can degrade gracefully. */
export const isSupabaseConfigured = Boolean(url && publishableKey)

/**
 * The Supabase client, or `null` when env vars are missing. We never call
 * createClient() with empty values (that would throw / produce a broken client).
 * Consumers must null-check (the AuthContext does this and surfaces a clear
 * "Auth is not configured" error).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, publishableKey as string)
  : null
