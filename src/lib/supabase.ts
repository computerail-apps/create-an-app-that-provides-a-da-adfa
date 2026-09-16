import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);

let cachedUserId: string | null = null;

/**
 * Ensures we have a signed-in (anonymous) Supabase user so RLS-protected
 * inserts (article_bookmarks, series_watchlist) can attach user_id.
 */
export async function getUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId;
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) {
    cachedUserId = sessionData.session.user.id;
    return cachedUserId;
  }
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('Could not establish a session.');
  cachedUserId = data.user.id;
  return cachedUserId;
}

export const BOOKMARKS_TABLE = 'create_an_app_that_p_article_bookmarks';
export const WATCHLIST_TABLE = 'create_an_app_that_p_series_watchlist';
