/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fff0f7",
          100: "#ffe4f3",
          200: "#ffc2e4",
          300: "#ff8dd0",
          400: "#ff57b6",
          500: "#ff1493", // Our primary color
          600: "#f70081",
          700: "#db006f",
          800: "#b8005c",
          900: "#93004a",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
