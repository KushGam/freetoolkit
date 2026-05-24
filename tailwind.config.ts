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
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        surface: {
          main: "#070A12",
          section: "#0B1020",
          card: "#111827",
          elevated: "#1A2234"
        },
        ink: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8"
        },
        brand: {
          50: "rgba(129, 140, 248, 0.08)",
          100: "rgba(129, 140, 248, 0.15)",
          200: "rgba(129, 140, 248, 0.25)",
          500: "#818CF8",
          600: "#6366F1",
          700: "#A5B4FC",
          900: "#F8FAFC"
        }
      },
      boxShadow: {
        soft: "0 8px 32px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 24px rgba(129,140,248,0.08), 0 20px 60px rgba(0,0,0,0.5)",
        card: "0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.35)"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
