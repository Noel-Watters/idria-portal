/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // App Router files
    "./components/**/*.{js,ts,jsx,tsx}",  // Your components
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: "#007796",
        secondary: "#0cbff0",

        // Backgrounds
        background: "#000000",
        backgroundSecondary: "#121420",
        surface: "#1B2432",
        surfaceElevated: "#2C2B3C",

        // Text & UI
        border: "#403F4C",
        muted: "#838194",

        // Specific use-cases
        textPrimary: "#ffffff",
        textSecondary: "#838194",
        textDisabled: "#403F4C",
      },
      fontFamily: {
        title: ["'New Rocker'", "cursive"],
        sans: ["Inter", "sans-serif"], 
      },
    },
  },
  plugins: [],
};

