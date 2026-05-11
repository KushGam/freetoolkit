import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#7f1d1d",
          600: "#991b1b",
          700: "#7a1414"
        }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
