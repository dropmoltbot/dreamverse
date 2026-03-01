/**
 * 🔌 API Client - DreamVerse (Demo Mode)
 * Works without backend - uses mock data
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const DEMO_MODE = true; // Force demo mode

// Demo tracks for showcase
const DEMO_TRACKS = [
  { id: '1', title: 'Cosmic Drift', prompt: 'cosmic ambient space synth', duration: 32, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', likes_count: 142, plays_count: 892 },
  { id: '2', title: 'Digital Dreams', prompt: 'electronic ambient drone', duration: 28, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', likes_count: 98, plays_count: 654 },
  { id: '3', title: 'Neural Flow', prompt: 'lo-fi beats chillhop', duration: 45, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', likes_count: 76, plays_count: 432 },
  { id: '4', title: 'Quantum State', prompt: 'electronic ambient', duration: 38, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', likes_count: 64, plays_count: 321 },
  { id: '5', title: 'Infinite Loop', prompt: 'ambient meditation', duration: 52, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', likes_count: 53, plays_count: 287 },
];

const DEMO_PRESETS = [
  { id: 'lofi', name: '🎧 Lo-Fi Chill', prompt: 'lo-fi chill beats with piano and guitar, relaxing vibe' },
  { id: 'edm', name: '🎹 EDM', prompt: 'energetic electronic dance music with heavy bass and synths' },
  { id: 'classical', name: '🎻 Classical', prompt: 'orchestral symphony with strings and brass' },
  { id: 'jazz', name: '🎷 Jazz', prompt: 'smooth jazz with saxophone and piano' },
  { id: 'rock', name: '🎸 Rock', prompt: 'guitar rock with drums and bass' },
  { id: 'ambient', name: '🌙 Ambient', prompt: 'atmospheric ambient soundscapes with nature sounds' },
  { id: 'hiphop', name: '🎤 Hip Hop', prompt: 'hip hop beat with 808 and rap verses' },
  { id: 'synthwave', name: '🌆 Synthwave', prompt: 'retro synthwave with neon sounds and 80s vibes' },
];

const DEMO_MODELS = [
  { id: 'musicgen-small', name: 'MusicGen Small ⚡', description: 'Fast generation, lower quality', max_duration: 15 },
  { id: 'musicgen-medium', name: 'MusicGen Medium', description: 'Balanced quality and speed', max_duration: 30 },
  { id: 'musicgen-large', name: 'MusicGen Large 🎵', description: 'Highest quality, slower', max_duration: 60 },
  { id: 'musicgen-melody', name: 'MusicGen Melody', description: 'Generate from audio melody', max_duration: 30 },
];

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ==================== AUTH ====================

export const auth = {
  register: async (email, password, username) => {
    if (DEMO_MODE) {
      return { id: 'demo-user', email, username, created_at: new Date().toISOString() };
    }
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  },

  login: async (email, password) => {
    if (DEMO_MODE) {
      localStorage.setItem('dreamverse_token', 'demo-token');
      return { 
        access_token: 'demo-token', 
        token_type: 'bearer', 
        user: { id: 'demo-user', email, username: 'demo_user' } 
      };
    }
    const response = await api.post('/auth/login', null, { params: { email, password } });
    if (response.data.access_token) {
      localStorage.setItem('dreamverse_token', response.data.access_token);
    }
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('dreamverse_token');
  },

  me: async () => {
    if (DEMO_MODE || localStorage.getItem('dreamverse_token')) {
      return { id: 'demo-user', email: 'demo@dreamverse.ai', username: 'demo_user', created_at: new Date().toISOString() };
    }
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => DEMO_MODE || !!localStorage.getItem('dreamverse_token'),
};

// ==================== MUSIC ====================

export const music = {
  generate: async (prompt, duration = 30, model = 'musicgen-medium') => {
    if (DEMO_MODE) {
      // Simulate generation
      return new Promise((resolve) => {
        setTimeout(() => {
          const trackId = 'track-' + Date.now();
          resolve({
            id: trackId,
            prompt,
            status: 'completed',
            audio_url: DEMO_TRACKS[Math.floor(Math.random() * DEMO_TRACKS.length)].audio_url,
            created_at: new Date().toISOString()
          });
        }, 3000);
      });
    }
    const response = await api.post('/music/generate', { prompt, duration, model });
    return response.data;
  },

  getStatus: async (trackId) => {
    if (DEMO_MODE) {
      return {
        id: trackId,
        status: 'completed',
        audio_url: DEMO_TRACKS[0].audio_url,
        created_at: new Date().toISOString()
      };
    }
    const response = await api.get(`/music/generate/${trackId}`);
    return response.data;
  },

  getTracks: async () => {
    if (DEMO_MODE) {
      return DEMO_TRACKS;
    }
    const response = await api.get('/music/tracks');
    return response.data;
  },

  deleteTrack: async (trackId) => {
    if (DEMO_MODE) {
      return { message: 'Track deleted' };
    }
    const response = await api.delete(`/music/tracks/${trackId}`);
    return response.data;
  },

  getPresets: async () => {
    if (DEMO_MODE) {
      return DEMO_PRESETS;
    }
    const response = await api.get('/music/presets');
    return response.data;
  },

  getModels: async () => {
    if (DEMO_MODE) {
      return DEMO_MODELS;
    }
    const response = await api.get('/music/models');
    return response.data;
  },
};

// ==================== PUBLIC ====================

export const gallery = {
  getPublic: async () => {
    if (DEMO_MODE) {
      return DEMO_TRACKS;
    }
    const response = await api.get('/gallery/public');
    return response.data;
  },

  getTrending: async () => {
    if (DEMO_MODE) {
      return DEMO_TRACKS.sort((a, b) => b.likes_count - a.likes_count);
    }
    const response = await api.get('/gallery/trending');
    return response.data;
  },
};

export default api;
