/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dream-dark': '#09090b',
        'dream-purple': '#7c3aed',
        'dream-pink': '#ec4899',
        'dream-cyan': '#06b6d4',
      },
      fontFamily: {
        display: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        pixel: ['Silkscreen', 'cursive'],
      },
      animation: {
        'rainbow': 'rainbow-move 4s linear infinite',
      },
      keyframes: {
        'rainbow-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '300% 50%' },
        },
      },
    },
  },
  plugins: [],
}
