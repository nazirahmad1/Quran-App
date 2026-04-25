import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#022c22",
          900: "#064e3b",
          800: "#065f46",
          700: "#047857",
          600: "#059669",
          500: "#10b981",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37",
          600: "#b8963e",
          700: "#92752e",
          800: "#6b5420",
          900: "#4a3a16",
        },
        ivory: {
          50: "#fdfdf8",
          100: "#faf9f0",
          200: "#f5f3e4",
          300: "#ede9d4",
          400: "#ddd8bc",
        },
        dark: {
          900: "#0d1117",
          800: "#161b22",
          700: "#21262d",
          600: "#30363d",
          500: "#3d444d",
        },
      },
      fontFamily: {
        arabic: ["var(--font-amiri)", "serif"],
        heading: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-lato)", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(212, 175, 55, 0.7)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gold-shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
