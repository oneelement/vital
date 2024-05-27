/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vital-green': '#03a588',
        'vital-green-hover': '#075144'
      }
    },
  },
  plugins: [],
}

