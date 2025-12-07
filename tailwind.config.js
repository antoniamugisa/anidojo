/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom Colors - Manga/Editorial Palette
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          light: '#141414',
          lighter: '#1a1a1a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          muted: '#c9c4bc',
          dark: '#8a8580',
        },
        crimson: {
          DEFAULT: '#B91C1C',
          bright: '#DC2626',
          dark: '#7F1D1D',
        },
        jade: {
          DEFAULT: '#059669',
          bright: '#10B981',
          dark: '#064E3B',
        },
        gold: {
          DEFAULT: '#D97706',
          bright: '#F59E0B',
        },
      },
      
      // Custom Font Families
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      
      // Custom Font Sizes
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1', letterSpacing: '0.05em' }],
        'display-lg': ['3rem', { lineHeight: '1', letterSpacing: '0.05em' }],
        'display-md': ['2rem', { lineHeight: '1.1', letterSpacing: '0.05em' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.05em' }],
      },
      
      // Custom Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom Border Radius
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
      },
      
      // Custom Box Shadows
      boxShadow: {
        'ink': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'crimson': '0 4px 20px rgba(185, 28, 28, 0.3)',
        'jade': '0 4px 20px rgba(5, 150, 105, 0.3)',
        'glow-crimson': '0 0 40px rgba(185, 28, 28, 0.4)',
        'glow-jade': '0 0 40px rgba(5, 150, 105, 0.4)',
      },
      
      // Custom Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'halftone': 'radial-gradient(circle, #f5f0e8 1px, transparent 1px)',
        'speed-lines': 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245, 240, 232, 0.03) 2px, rgba(245, 240, 232, 0.03) 4px)',
        'gradient-editorial': 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
      },
      
      // Custom Background Size
      backgroundSize: {
        'halftone': '4px 4px',
      },
      
      // Custom Animations
      animation: {
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'ink-spread': 'ink-spread 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // Custom Keyframes
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ink-spread': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      
      // Custom Transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      // Custom Z-Index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
