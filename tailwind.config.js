/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {
      container: {
        center: true
      },
      fontFamily: {
        medium: ["med"],
        bold: ["bol"],
        regular: ["reg"],
        semibold: ["semibol"]
      },
    },
  },
  plugins: [],
}

