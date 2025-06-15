import { supabase } from '../supabaseClient.js';

export async function fetchVideosFromSupabase() {
  try {
    const { data, error } = await supabase.from('videos').select('*');
    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Supabase fetch failed:', err);
    return null;
  }
}
