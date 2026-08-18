/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        linen: '#E9ECE6',
        card: '#FFFDF8',
        ink: '#20323C',
        'ink-light': '#5B6B72',
        stamp: {
          red: '#B23A1F',
          amber: '#C68A1D',
          green: '#2F6F4E',
        },
        rule: '#C9CFC7',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};