import type { Config } from 'tailwindcss'

// Extract a simple style guide based off the provided screenshots.
// Primary purple used throughout the UI and accent colors for status chips.
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#6C63FF',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#EDEBFD',
          foreground: '#6C63FF'
        },
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#6B7280'
        },
        success: {
          DEFAULT: '#34D399',
          foreground: '#FFFFFF'
        },
        warning: {
          DEFAULT: '#FBBF24',
          foreground: '#FFFFFF'
        },
        danger: {
          DEFAULT: '#F87171',
          foreground: '#FFFFFF'
        },
        border: '#E5E7EB',
        input: '#E5E7EB'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config