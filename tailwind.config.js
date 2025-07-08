/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to tell Tailwind where to look for your JSX files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#08579F',
        secondary: '#064882',
        'primary-light': '#E6F0F9',
      },
    },
  },
  plugins: [],
};
