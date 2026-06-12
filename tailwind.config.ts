import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
        display: ["var(--font-syne)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-syne)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          2: "var(--bg2)",
          3: "var(--bg3)",
          4: "var(--bg4)"
        },
        gold: {
          DEFAULT: "var(--gold)",
          dim: "var(--gold-dim)",
          glow: "var(--gold-glow)",
          text: "var(--gold-text)"
        },
        text: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
          3: "var(--text-3)"
        },
        border: {
          DEFAULT: "var(--border)",
          hi: "var(--border-hi)"
        },
        cat: {
          pdf: "var(--cat-pdf)",
          img: "var(--cat-img)",
          ai: "var(--cat-ai)",
          seo: "var(--cat-seo)",
          dev: "var(--cat-dev)",
          calc: "var(--cat-calc)",
          student: "var(--cat-student)"
        },
        surface: {
          main: "var(--bg)",
          section: "var(--bg2)",
          card: "var(--bg2)",
          elevated: "var(--bg3)"
        },
        ink: {
          primary: "var(--text)",
          secondary: "var(--text-2)",
          muted: "var(--text-3)"
        },
        brand: {
          50: "var(--gold-glow)",
          100: "rgba(245, 166, 35, 0.2)",
          200: "rgba(245, 166, 35, 0.3)",
          500: "var(--gold)",
          600: "var(--gold)",
          700: "var(--gold-text)",
          900: "var(--text)"
        }
      },
      backgroundImage: {
        "gold-shimmer": "linear-gradient(135deg, #f5a623 0%, #f7c46a 50%, #f5a623 100%)"
      },
      boxShadow: {
        soft: "0 8px 32px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 24px var(--gold-glow), 0 20px 60px rgba(0,0,0,0.5)",
        card: "0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.35)",
        gold: "0 4px 24px rgba(245, 166, 35, 0.3)"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        shimmer: "shimmer 4s linear infinite",
        drift: "drift 14s ease-in-out infinite alternate",
        "drift-alt": "driftAlt 18s ease-in-out infinite alternate",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease forwards"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        drift: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(30px, 20px) scale(1.08)" }
        },
        driftAlt: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(-20px, 25px) scale(1.05)" }
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" }
        }
      });
    })
  ]
};

export default config;
