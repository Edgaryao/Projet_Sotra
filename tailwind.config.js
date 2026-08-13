/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        light: {
          primary: "#0F653C",
          background: "#F5F5F5",
          btn: "#0A6C39",
        },

        dark: {
          card: "#1E1E1E",
          background: "#121212",
          border: "#3A3A3A",
          text: "#F8FAFC",
        },
      },
    },
  },

  plugins: [],
};