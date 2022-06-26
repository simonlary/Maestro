/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'top': '0 -10px 15px 0 rgb(0 0 0 / 0.2)',
        'bottom': '0 10px 15px 0 rgb(0 0 0 / 0.1)',
        'inner-bottom': 'inset  0 -10px 15px 0 rgb(0 0 0 / 0.1)',
      },
    },
    colors: {
      blue: "#5865f2",
      "blue-hover": "#4752c4",
      green: "#44be6b",
      white: "#e4e4e4",
      "soft-white": "#c0c0c0",
      code: "#121314",
      "gray-1": "#202225",
      "gray-2": "#2f3136",
      "gray-3": "#36393f",
      "gray-4": "#40444b",
      "gray-5": "#42464d",
      "gray-text": "#8c9095",
      red: "#d83c3e",
      "red-hover": "#a12d2f",
      icon: "#b9bbbe",
      "icon-selected": "#dcddde",
      hover: "#3c3f45",
      selected: "#34373d",
    },
  },
  plugins: [],
};
