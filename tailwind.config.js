/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pickle: {
          50: '#f4fbf0',
          100: '#e6f7de',
          200: '#ceefbe',
          300: '#aae194',
          400: '#7ece64',
          500: '#5ab340',
          600: '#43912e',
          700: '#357227',
          800: '#2d5b22',
          900: '#274b1e',
          accent: '#ccff00', // Neon Lime pickleball ball
          court: '#0f766e',  // Court teal green
          courtblue: '#1e40af' // Blue court zone
        }
      }
    },
  },
  plugins: [],
}
