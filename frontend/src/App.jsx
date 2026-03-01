/**
 * 🎵 DreamVerse - AI Music Generation
 * Open Source Edition
 * 
 * Status: DEMO MODE (frontend fully functional)
 * 
 * To connect real AI:
 * 1. Deploy backend to Render/Railway
 * 2. Deploy AI to HuggingFace Spaces
 * 3. Update VITE_API_URL in .env
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo data
const DEMO_TRACKS = [
  { id: '1', title: 'Cosmic Drift', prompt: 'cosmic ambient space synth', duration: 32, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', likes_count: 142 },
  { id: '2', title: 'Digital Dreams', prompt: 'electronic ambient drone', duration: 28, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', likes_count: 98 },
  { id: '3', title: 'Neural Flow', prompt: 'lo-fi beats chillhop', duration: 45, audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', likes_count: 76 },
];

const DEMO_PRESETS = [
  { id: 'lofi', name: '🎧 Lo-Fi', prompt: 'lo-fi chill beats with piano and guitar' },
  { id: 'edm', name: '🎹 EDM', prompt: 'energetic electronic dance music with heavy bass' },
  { id: 'classical', name: '🎻 Classical', prompt: 'orchestral symphony with strings' },
  { id: 'jazz', name: '🎷 Jazz', prompt: 'smooth jazz with saxophone and piano' },
  { id: 'rock', name: '🎸 Rock', prompt: 'guitar rock with drums and bass' },
  { id: 'ambient', name: '🌙 Ambient', prompt: 'atmospheric ambient soundscapes' },
  { id: 'hiphop', name: '🎤 Hip Hop', prompt: 'hip hop beat with 808' },
  { id: 'synthwave', name: '🌆 Synthwave', prompt: 'retro synthwave with neon sounds' },
];

// Music Generator Component
function MusicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    setResult(null);
    
    // Simulate generation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(i);
    }
    
    // Random demo track
    const track = DEMO_TRACKS[Math.floor(Math.random() * DEMO_TRACKS.length)];
    setResult({ ...track, prompt, duration });
    setIsGenerating(false);
  };

  const selectPreset = (presetPrompt) => setPrompt(presetPrompt);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 gradient-text">🎵 AI Music Generator</h2>
        <p className="text-white/60">Powered by Meta MusicGen • Open Source</p>
      </motion.div>

      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-card p-6 mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your music... lo-fi chill beats with piano and guitar"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-purple-500 mb-4"
          rows={3}
          disabled={isGenerating}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {DEMO_PRESETS.map((preset) => (
            <button key={preset.id} onClick={() => selectPreset(preset.prompt)} disabled={isGenerating} className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-full border border-white/10">
              {preset.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-white/60 text-sm">Duration: {duration}s</span>
          <input type="range" min="10" max="60" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={isGenerating} className="flex-1 accent-purple-500" />
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50">
          {isGenerating ? `🎵 Generating... ${progress}%` : '🚀 Generate Music'}
        </motion.button>

        {isGenerating && (
          <div className="mt-4">
            <div className="h-2 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">🎉 Your Track is Ready!</h3>
            <audio controls className="w-full mb-4" src={result.audio_url} />
            <div className="flex justify-between text-sm text-white/60">
              <span>❤️ {result.likes_count} likes</span>
              <button className="text-purple-400">Download</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main App
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 fixed top-0 left-0" style={{ width: `${scrollProgress}%`, zIndex: 100 }} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-gray-950/80 backdrop-blur-lg border-b border-white/5 flex justify-between items-center">
        <span className="text-xl font-bold gradient-text">DreamVerse</span>
        <div className="flex gap-4 text-sm">
          <a href="#generate" className="text-white/60 hover:text-white">Generate</a>
          <a href="https://github.com/dropmoltbot/dreamverse" target="_blank" className="text-white/60 hover:text-white">GitHub ⭐</a>
        </div>
      </nav>

      <main className="pt-16">
        <section className="min-h-screen flex flex-col justify-center items-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm">✨ Open Source AI Music</span>
            <h1 className="text-6xl font-bold mt-6 mb-4"><span className="gradient-text">Dream</span><span className="text-white">Verse</span></h1>
            <p className="text-white/60 max-w-xl mx-auto mb-8">Generate unique music with AI. Open source, free to use, self-hostable.</p>
            <a href="#generate" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold">🎵 Start Generating</a>
          </motion.div>
        </section>

        <section id="generate" className="min-h-screen py-20 px-4">
          <MusicGenerator />
        </section>
      </main>

      <footer className="py-8 text-center text-white/40 border-t border-white/5">
        <p>© 2026 DreamVerse • <a href="https://github.com/dropmoltbot/dreamverse" className="text-purple-400">Open Source</a></p>
      </footer>
    </div>
  );
}
