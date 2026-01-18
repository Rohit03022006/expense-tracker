/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        border: '#E2E8F0',
       
        income: {
          DEFAULT: '#16A34A',
          light: '#22C55E',
          dark: '#15803D',
        },
        expense: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          dark: '#B91C1C',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#3B82F6',
          dark: '#0284C7',
        },
        button: {
          primary: '#0EA5E9',
          secondary: '#E2E8F0',
        },
        
        dark: {
          background: '#1E293B',
          card: '#334155',
          'text-primary': '#F8FAFC',
          'text-secondary': '#94A3B8',
        },
      },
    },
  },
  plugins: [],
}
