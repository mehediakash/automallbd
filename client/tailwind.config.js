/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EC1A24", //oreng
        root: "#091017", //black
      },
      screens: {
        'xss': '380px',
      },
    },
  },
  plugins: [],
};
