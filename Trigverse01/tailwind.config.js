/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        neon: {
          cyan:    '#00f2fe',
          magenta: '#f355da',
          lime:    '#00ff87',
          amber:   '#ffb300',
          purple:  '#a855f7',
          blue:    '#3b82f6',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-18px)' },
        },
      },
      backgroundImage: {
        'grid-dark': "linear-gradient(rgba(0,242,254,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,242,254,.06) 1px,transparent 1px)",
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
};
