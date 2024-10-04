/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx,css}', './components/**/*.{ts,tsx,css}', './app/**/*.{ts,tsx,css}', './src/**/*.{ts,tsx,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      screens: {
        '3xl': '1600px'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary-500))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary-pink-500))',
          foreground: 'hsl(var(--secondary-foreground))',
          pink: {
            DEFAULT: 'hsl(var(--secondary-pink-500))',
            50: 'hsl(var(--secondary-pink-50))',
            100: 'hsl(var(--secondary-pink-100))',
            200: 'hsl(var(--secondary-pink-200))',
            300: 'hsl(var(--secondary-pink-300))',
            400: 'hsl(var(--secondary-pink-400))',
            500: 'hsl(var(--secondary-pink-500))',
            600: 'hsl(var(--secondary-pink-600))',
            700: 'hsl(var(--secondary-pink-700))',
            800: 'hsl(var(--secondary-pink-800))',
            900: 'hsl(var(--secondary-pink-900))',
            950: 'hsl(var(--secondary-pink-950))'
          },
          orange: {
            DEFAULT: 'hsl(var(--secondary-orange-500))',
            50: 'hsl(var(--secondary-orange-50))',
            100: 'hsl(var(--secondary-orange-100))',
            200: 'hsl(var(--secondary-orange-200))',
            300: 'hsl(var(--secondary-orange-300))',
            400: 'hsl(var(--secondary-orange-400))',
            500: 'hsl(var(--secondary-orange-500))',
            600: 'hsl(var(--secondary-orange-600))',
            700: 'hsl(var(--secondary-orange-700))',
            800: 'hsl(var(--secondary-orange-800))',
            900: 'hsl(var(--secondary-orange-900))',
            950: 'hsl(var(--secondary-orange-950))'
          }
        },
        neutrals: {
          DEFAULT: 'hsl(var(--neutrals-500))',
          50: 'hsl(var(--neutrals-50))',
          100: 'hsl(var(--neutrals-100))',
          200: 'hsl(var(--neutrals-200))',
          300: 'hsl(var(--neutrals-300))',
          400: 'hsl(var(--neutrals-400))',
          500: 'hsl(var(--neutrals-500))',
          600: 'hsl(var(--neutrals-600))',
          700: 'hsl(var(--neutrals-700))',
          800: 'hsl(var(--neutrals-800))',
          900: 'hsl(var(--neutrals-900))',
          950: 'hsl(var(--neutrals-950))'
        },
        positive: {
          DEFAULT: 'hsl(var(--positive))',
          50: 'hsl(var(--positive-50))',
          100: 'hsl(var(--positive-100))',
          200: 'hsl(var(--positive-200))',
          300: 'hsl(var(--positive-300))',
          400: 'hsl(var(--positive-400))',
          500: 'hsl(var(--positive-500))',
          600: 'hsl(var(--positive-600))',
          700: 'hsl(var(--positive-700))',
          800: 'hsl(var(--positive-800))',
          900: 'hsl(var(--positive-900))',
          950: 'hsl(var(--positive-950))',
          foreground: 'hsl(var(--positive-foreground))'
        },
        warming: {
          DEFAULT: 'hsl(var(--warming-500))',
          50: 'hsl(var(--warming-50))',
          100: 'hsl(var(--warming-100))',
          200: 'hsl(var(--warming-200))',
          300: 'hsl(var(--warming-300))',
          400: 'hsl(var(--warming-400))',
          500: 'hsl(var(--warming-500))',
          600: 'hsl(var(--warming-600))',
          700: 'hsl(var(--warming-700))',
          800: 'hsl(var(--warming-800))',
          900: 'hsl(var(--warming-900))',
          950: 'hsl(var(--warming-950))'
        },
        negative: {
          DEFAULT: 'hsl(var(--negative))',
          50: 'hsl(var(--negative-50))',
          100: 'hsl(var(--negative-100))',
          200: 'hsl(var(--negative-200))',
          300: 'hsl(var(--negative-300))',
          400: 'hsl(var(--negative-400))',
          500: 'hsl(var(--negative-500))',
          600: 'hsl(var(--negative-600))',
          700: 'hsl(var(--negative-700))',
          800: 'hsl(var(--negative-800))',
          900: 'hsl(var(--negative-900))',
          950: 'hsl(var(--negative-950))',
          foreground: 'hsl(var(--negative-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          secondary: 'hsl(var(--accent-secondary))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        subjectivity: ['Subjectivity', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        opacity: 'opacity'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
