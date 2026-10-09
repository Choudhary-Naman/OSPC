import { createClient } from '@supabase/supabase-js';

// Accept the URL with or without a trailing "/rest/v1/" so a common copy-paste mistake doesn't break the site.
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const url = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function configProblem() {
  if (!url && !key) return 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set.';
  if (!url) return 'VITE_SUPABASE_URL is not set.';
  if (!key) return 'VITE_SUPABASE_ANON_KEY is not set.';
  if (!/^https:\/\/[^\s/]+$/.test(url)) return 'VITE_SUPABASE_URL should look like https://YOUR_PROJECT.supabase.co';
  return null;
}

export const supabaseConfigError = configProblem();

export const supabase = supabaseConfigError
  ? null
  : createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

/** Translate a Supabase/PostgREST error into something a visitor can act on. */
export function describeError(error, context = 'insert') {
  const code = error?.code || '';
  const msg = (error?.message || '').toLowerCase();
  if (!code && (msg.includes('fetch') || msg.includes('network'))) {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  if (code === 'PGRST204' || (msg.includes('column') && msg.includes('publish_consent'))) {
    return 'Publishing to the fan wall needs a one-time database update (supabase/migrations/001_fan_wall.sql). Untick "Feature my message" to send privately.';
  }
  if (code === 'PGRST205' || code === '42P01') {
    return context === 'read' ? 'The fan wall has not been set up yet.' : 'The messages table is missing. Run supabase/schema.sql in Supabase.';
  }
  if (code === '42501') return 'The database refused this request because of its security rules.';
  if (code === '23514') return 'One of the fields was rejected by the database. Please check the lengths and try again.';
  return context === 'read' ? "Couldn't load messages right now." : "Couldn't send your message right now. Please try again in a moment.";
}
