/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        ct: "2rem",
        ctx: "3rem",
        cts: "1.5rem",
      },
      colors: {
        primary: {
          "50": "#faffb3",
          "100": "#f6ff66",
          "200": "#f3ff1a",
          "300": "#ecf500",
          "400": "#DC8605",
          "500": "#F59709",
          "600": "#cad000",
          "700": "#BC7304",
          "800": "#818000",
          "900": "#666600",
        },
        secondary: {
          "50": "#e6e6e6",
          "100": "#cccccc",
          "200": "#999999",
          "300": "#4E4E4E",
          "400": "#202020",
          "500": "#F2F2F2",
        },
      },
      fontSize: {},
      inset: {
        dot: "0.2rem",
      },
      scale: {
        "102": "1.02",
      },
      maxWidth: {
        "2xs": "17rem",
      },
    },
  },
  plugins: [],
  daisyui: {
    themes: [],
  },
};
