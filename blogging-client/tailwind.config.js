/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,jsx,js}"], //remove unused styles in production
  theme: {
    extend: {},
  },
  plugins: [],
}

