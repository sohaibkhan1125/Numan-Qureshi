/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1ea5ed',
          orange: '#ff9248',
          pink: '#ef497e',
          teal: '#00d2b4',
          dark: '#1e3a8a',
          purple: '#8b5cf6',
          yellow: '#ffcc00',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'search': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}