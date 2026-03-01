/**
 * 🗄️ Supabase Client - DreamVerse
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client (will work in demo mode if no credentials)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo mode flag
export const isDemoMode = !supabase;

// ==================== PROFILES ====================

export const profiles = {
  async get(username) {
    if (!supabase) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    return data;
  },

  async update(id, updates) {
    if (!supabase) return { data: updates };
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return data;
  },
};

// ==================== TRACKS ====================

export const tracks = {
  async getPublic(limit = 50) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .eq('status', 'completed')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getTrending(limit = 50) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .eq('status', 'completed')
      .eq('is_public', true)
      .order('likes_count', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getByUser(userId) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async like(trackId) {
    if (!supabase) return { data: null };
    const { data } = await supabase.from('likes').insert({ track_id: trackId });
    return data;
  },

  async unlike(trackId) {
    if (!supabase) return { data: null };
    const { data } = await supabase.from('likes').delete().eq('track_id', trackId);
    return data;
  },
};

// ==================== GALLERY ====================

export const gallery = {
  async getFeatured() {
    if (!supabase) return [];
    const { data } = await supabase
      .from('gallery')
      .select('*, tracks(*)')
      .eq('featured', true)
      .order('featured_at', { ascending: false })
      .limit(20);
    return data?.map(g => g.tracks) || [];
  },
};

export default supabase;
