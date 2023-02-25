/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
        minHeight: {
            '12': '3rem'
        }
    },
  },
  plugins: [],
}
