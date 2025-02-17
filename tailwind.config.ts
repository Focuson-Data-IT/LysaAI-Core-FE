import type { Config } from "tailwindcss";
export default {
  darkMode: "class", // Tambahkan ini untuk mengisolasi tema dari sistem
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      sm: '640px', // Layar kecil (mobile)
      md: '768px', // Tablet
      lg: '1024px', // Desktop
      xl: '1280px', // Layar besar
    },

  },
  plugins: [],
} satisfies Config;
