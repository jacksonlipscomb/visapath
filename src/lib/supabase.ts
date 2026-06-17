import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** Synchronous, SDK-free check so the UI can degrade gracefully without loading Supabase. */
export const isSupabaseConfigured = Boolean(url && publishableKey)

let clientPromise: Promise<SupabaseClient | null> | null = null

/**
 * Lazily import the Supabase SDK and create the client (memoized), so the SDK is
 * code-split out of the initial bundle and only loaded once auth actually runs.
 * Resolves to `null` when env vars are missing (callers must null-check).
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url as string, publishableKey as string)
    )
  }
  return clientPromise
}
