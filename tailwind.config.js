/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Tambahkan ini untuk mengisolasi tema dari sistem
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fill": "fillAnim 1s ease forwards",
        "fill-delay-1": "fillAnim 1s ease forwards 0.2s",
        "fill-delay-2": "fillAnim 1s ease forwards 0.4s",
        "fill-delay-3": "fillAnim 1s ease forwards 0.6s",
      },
      keyframes: {
        fillAnim: {
          from: { fillOpacity: "0" },
          to: { fillOpacity: "1" },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
