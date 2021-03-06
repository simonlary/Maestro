/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        top: "0 -10px 15px 0 rgb(0 0 0 / 0.2)",
        bottom: "0 10px 15px 0 rgb(0 0 0 / 0.1)",
        "inner-bottom": "inset  0 -10px 15px 0 rgb(0 0 0 / 0.1)",
      },
      animation: {
        fadein: "fadein 0.3s ease-in-out",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
    colors: {
      blue: "#5865f2",
      "blue-hover": "#4752c4",
      green: "#44be6b",
      white: "#e4e4e4",
      "soft-white": "#909090",
      code: "#121314",
      "gray-1": "#202225",
      "gray-2": "#2f3136",
      "gray-3": "#36393f",
      "gray-4": "#40444b",
      "gray-5": "#42464d",
      yellow: "#f0a119",
      red: "#d3302c",
      "red-hover": "#a12d2f",
      icon: "#b9bbbe",
      "icon-selected": "#dcddde",
      hover: "#3c3f45",
      selected: "#34373d",
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
