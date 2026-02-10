/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: '0.525rem', // ~70% of 0.75rem
      sm: '0.6125rem', // ~70% of 0.875rem
      base: '0.7rem', // ~70% of 1rem
      lg: '0.7875rem', // ~70% of 1.125rem
      xl: '0.875rem', // ~70% of 1.25rem
      '2xl': '1.05rem', // ~70% of 1.5rem
      '3xl': '1.3125rem', // ~70% of 1.875rem
      '4xl': '1.575rem', // ~70% of 2.25rem
      '5xl': '2.1rem', // ~70% of 3rem
      '6xl': '2.625rem', // ~70% of 3.75rem
      '7xl': '3.15rem', // ~70% of 4.5rem
      '8xl': '4.2rem', // ~70% of 6rem
      '9xl': '5.6rem', // ~70% of 8rem
    },
    extend: {
      colors: {
        'lusion-black': '#0a0a0a',
        'lusion-purple': '#c20023', // Mapped to Red
        'brand-dark': '#331019',
        'brand-red': '#c20023',
        'brand-orange': '#ff6600',
        'brand-yellow': '#fffb00',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right top, #000000, #331019, #620f24, #920728, #c20023, #d82d1e, #ed4b15, #ff6600, #ff8d00, #ffb300, #ffd700, #fffb00)',
        'text-safe-gradient': 'linear-gradient(to right, #c20023, #ff6600, #fffb00)',
      },
      fontFamily: {
        sans: ['Kode Mono', 'monospace'],
        heading: ['Anta', 'sans-serif'],
        mono: ['Kode Mono', 'monospace'],
        tech: ['Unica One', 'sans-serif'],
        pixel: ['Pixelify Sans', 'cursive'],
      }
    },
  },
  plugins: [],
}
