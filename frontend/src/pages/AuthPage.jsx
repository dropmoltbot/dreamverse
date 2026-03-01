/**
 * 🧑‍💻 Auth Pages - Login/Register
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../hooks/useStore';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage({ mode = 'login' }) {
  const { login, register, isLoading } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(mode === 'register');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const promise = isRegister 
      ? register(email, password, username)
      : login(email, password);
    
    toast.promise(promise, {
      loading: 'Processing...',
      success: () => {
        window.location.href = '/';
        return isRegister ? 'Account created!' : 'Welcome back!';
      },
      error: (err) => err.message || 'Something went wrong'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-animate mb-2">
              {isRegister ? 'Join DreamVerse' : 'Welcome Back'}
            </h1>
            <p className="text-white/60">
              {isRegister 
                ? 'Create your account to start generating music'
                : 'Sign in to your account'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  required={isRegister}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-dream-purple focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-dream-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-dream-purple focus:outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full glow-btn py-4 text-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-white/60 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-dream-purple hover:text-dream-pink transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {/* Demo Mode */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl text-center">
            <p className="text-white/60 text-sm mb-2">Want to try first?</p>
            <button
              onClick={() => {
                localStorage.setItem('dreamverse_token', 'demo');
                window.location.href = '/';
              }}
              className="text-dream-cyan hover:text-dream-purple transition-colors text-sm font-medium"
            >
              Continue in Demo Mode →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
