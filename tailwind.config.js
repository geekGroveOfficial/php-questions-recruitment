/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
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

