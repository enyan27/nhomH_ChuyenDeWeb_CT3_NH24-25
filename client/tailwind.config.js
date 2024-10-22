module.exports = {
  important: true,
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins", "sans-serif;"],
      },
      colors: {
        primary: "#000",
        secondary: "#000",
        thirdColor: "#000",
        heartColor: "#808080",

        darkLite: "#000", // bg all
        darkSecondary: "#1C1C24",
        darkSoft: "#202327", // bg post
        darkSoft2: "#202327", // search
        darkRed: "#422C32",
        iconColor: "#A2A2A8", // icon
        whiteSoft: "#EFF1F1",
        whiteSoft2: "#EFF3F4",
        graySoft: "#E7E7E8",
        strock: "#ddd",
        darkStroke: "#2C3640",
        lite: "#f9f9f9",
        text1: "#171725",
        text2: "#4B5264",
        text3: "#808191",
        text4: "#B2B3BD",
        errorColor: "#EB5757",
        successColor: "#4AC860",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
