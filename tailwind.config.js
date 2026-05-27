const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        sans: ["Peyda", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
