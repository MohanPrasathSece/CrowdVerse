/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0a0a0a',
        'secondary-black': '#1a1a1a',
        'off-white': '#f5f5f5',
        'light-gray': '#e0e0e0',
        'dark-gray': '#2a2a2a',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
