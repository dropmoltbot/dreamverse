/**
 * 🎯 Global Store - DreamVerse
 * State management with Zustand
 */

import { create } from 'zustand';
import { auth, music } from '../lib/api';

export const useStore = create((set, get) => ({
  // User state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Music state
  tracks: [],
  currentTrack: null,
  isGenerating: false,
  generationProgress: 0,
  presets: [],
  models: [],

  // UI state
  activeSection: 'home',

  // Actions
  setActiveSection: (section) => set({ activeSection: section }),

  // Auth actions
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, access_token } = await auth.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true });
    try {
      const user = await auth.register(email, password, username);
      set({ user, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    await auth.logout();
    set({ user: null, isAuthenticated: false, tracks: [] });
  },

  checkAuth: async () => {
    if (!auth.isAuthenticated()) return;
    try {
      const user = await auth.me();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Music actions
  loadPresets: async () => {
    try {
      const presets = await music.getPresets();
      set({ presets });
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  },

  loadModels: async () => {
    try {
      const models = await music.getModels();
      set({ models });
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  },

  loadTracks: async () => {
    if (!get().isAuthenticated) return;
    try {
      const tracks = await music.getTracks();
      set({ tracks });
    } catch (error) {
      console.error('Failed to load tracks:', error);
    }
  },

  generateMusic: async (prompt, duration = 30, model = 'musicgen-medium') => {
    set({ isGenerating: true, generationProgress: 0 });
    
    try {
      // Start generation
      const result = await music.generate(prompt, duration, model);
      
      // Poll for status
      let status = result.status;
      let progress = 0;
      
      while (status === 'generating') {
        await new Promise(r => setTimeout(r, 2000));
        const statusResult = await music.getStatus(result.id);
        status = statusResult.status;
        progress = Math.min(progress + 20, 90);
        set({ generationProgress: progress });
        
        if (status === 'completed') {
          set({ 
            isGenerating: false, 
            generationProgress: 100,
            currentTrack: statusResult 
          });
          // Reload tracks
          get().loadTracks();
        }
      }
      
      if (status === 'failed') {
        set({ isGenerating: false, generationProgress: 0 });
        throw new Error('Generation failed');
      }
      
      return { success: true, track: result };
    } catch (error) {
      set({ isGenerating: false, generationProgress: 0 });
      return { success: false, error: error.message };
    }
  },

  deleteTrack: async (trackId) => {
    try {
      await music.deleteTrack(trackId);
      set({ tracks: get().tracks.filter(t => t.id !== trackId) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Initialize
  initialize: async () => {
    await get().checkAuth();
    await get().loadPresets();
    await get().loadModels();
    if (get().isAuthenticated) {
      await get().loadTracks();
    }
  },
}));

export default useStore;
