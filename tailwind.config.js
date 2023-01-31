/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "grey-1": "#2C3E50",
        "grey-2": "#586472",
        "grey-3": "#90979E",
        "grey-4": "#AAB2BD",
        "grey-5": "#EAEDEE",
        "grey-6": "#F1F3F4",
        pink: "#FF91A3",
        "pink-light": "#FFB0B5",
        "pink-bg": "#FFE7E7",
        "pink-bg-light": "#FFF5F5",
        purple: "#859AFF",
        "purple-bg": "#B6C0ED",
        "purple-bg-light": "#F3F5FF",
        red: "#FF5D5D",
        green: "#64D1CB",
      },
      fontSize: {
        "3xl": ["1.5rem", "2.25rem"],
        "2xl": ["1.375rem", "2.125rem"],
        xl: ["1.25rem", "2rem"],
        base: ["1rem", "1.625rem"],
        "2sm": ["0.875rem", "1.5rem"],
        sm: ["0.875rem", "0.875rem"],
        xs: ["0.75rem", "1.25rem"],
      },
      borderRadius: {
        extreme: "999px",
        cl: "50%",
      },
      maxWidth: {
        "max-screen": "45.5rem",
      },
      minWidth: {
        "min-screen": "20rem",
      },
      spacing: {
        stretch: "stretch",
      },
      backgroundImage: {
        "pink-button": "linear-gradient(270deg, #FF91A3 0%, #FFB0B5 100%)",
      },
      boxShadow: {
        card: "0 4px 10px 0 rgba(67, 74, 84, 0.14)",
      },
    },
  },
  plugins: [],
};
