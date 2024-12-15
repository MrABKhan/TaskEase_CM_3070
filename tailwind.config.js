/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00D2D3',
        accent: '#FD79A8',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#FF7675',
        background: {
          light: '#FFFFFF',
          dark: '#1A1B1E',
        },
        text: {
          light: '#2D3436',
          dark: '#FFFFFF',
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      }
    },
  },
  plugins: [],
} 