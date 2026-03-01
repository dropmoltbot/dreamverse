/**
 * 🎵 Music Generator Component
 * Real AI music generation with progress
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../hooks/useStore';

export default function MusicGenerator() {
  const { 
    generateMusic, 
    isGenerating, 
    generationProgress,
    currentTrack,
    presets,
    models 
  } = useStore();

  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedModel, setSelectedModel] = useState('musicgen-medium');
  const [result, setResult] = useState(null);

  // Handle generation
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const response = await generateMusic(prompt, duration, selectedModel);
    
    if (response.success) {
      setResult(response.track);
    }
  };

  // Select preset
  const selectPreset = (presetPrompt) => {
    setPrompt(presetPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-2 gradient-animate">
          🎵 AI Music Generator
        </h2>
        <p className="text-white/60">
          Create unique music with AI • Powered by Meta MusicGen
        </p>
      </motion.div>

      {/* Generator Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 mb-6"
      >
        {/* Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white/80">
            Describe your music
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="lo-fi chill beats with piano and guitar, relaxing vibe..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-dream-purple focus:outline-none focus:ring-2 focus:ring-dream-purple/50 transition-all resize-none"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white/60">
            Quick presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.prompt)}
                disabled={isGenerating}
                className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:border-dream-purple/50 disabled:opacity-50"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60">
              Duration: {duration}s
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="10"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              disabled={isGenerating}
              className="w-full accent-dream-purple"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>10s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white/60">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-dream-purple focus:outline-none"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={isGenerating ? {} : { scale: 1.02 }}
          whileTap={isGenerating ? {} : { scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            isGenerating
              ? 'bg-white/10 cursor-wait'
              : 'glow-btn hover:shadow-lg hover:shadow-dream-purple/30'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                🎵
              </motion.span>
              Generating... {generationProgress}%
            </span>
          ) : (
            <span>🚀 Generate Music</span>
          )}
        </motion.button>

        {/* Progress Bar */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-dream-purple to-dream-pink"
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-sm text-white/40 mt-2">
                AI is crafting your unique track...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-4">🎉 Your Track is Ready!</h3>
            
            {/* Audio Player */}
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <audio
                controls
                className="w-full"
                src={result.audio_url}
              />
            </div>

            {/* Track Info */}
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Prompt: {result.prompt}</span>
              <button className="text-dream-purple hover:text-dream-pink transition-colors">
                Download 🎵
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
