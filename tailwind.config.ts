import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0DC',
          300: '#FFE4C0',
        },
        ember: {
          400: '#FF8C5A',
          500: '#FF6B35',
          600: '#E85D20',
          700: '#D04F15',
          800: '#B84010',
        },
        bark: {
          700: '#5C3D30',
          800: '#3D2014',
          900: '#2C1810',
        },
        gold: {
          300: '#FFD9A0',
          400: '#F4A261',
          500: '#E08030',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #FF6B35 0%, #E85D20 50%, #F4A261 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFF8F0 0%, #FFE4C0 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2C1810 0%, #3D2014 100%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'scale-in': 'scaleIn 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.4s ease forwards',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,53,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,107,53,0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(44,24,16,0.12)',
        'warm-lg': '0 8px 40px rgba(44,24,16,0.18)',
        'ember': '0 4px 20px rgba(255,107,53,0.35)',
        'ember-lg': '0 8px 40px rgba(255,107,53,0.5)',
        'card': '0 2px 16px rgba(44,24,16,0.08)',
        'card-hover': '0 8px 40px rgba(44,24,16,0.16)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
