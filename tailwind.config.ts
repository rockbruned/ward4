import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lake: {
          50: "#eef4f9",
          100: "#d4e4f0",
          200: "#b8cfe0",
          600: "#2563a8",
          700: "#1e4d7b",
          800: "#163d62",
          900: "#0f2f4d",
          950: "#081f33",
        },
        forest: {
          50: "#e8f0ea",
          100: "#d0e4d6",
          200: "#b8d4c0",
          600: "#3d7a52",
          700: "#2d5a3d",
          800: "#234830",
          900: "#1a3826",
        },
        warm: {
          white: "#faf8f5",
          cream: "#f0ebe3",
          sand: "#e8dfd3",
        },
        accent: {
          DEFAULT: "#c4a035",
          light: "#e8d9a0",
          dark: "#9a7b1f",
        },
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "Segoe UI", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        panel: "0 12px 40px rgb(15 47 77 / 0.18)",
        card: "0 4px 24px rgb(15 47 77 / 0.08)",
        cardHover: "0 16px 48px rgb(15 47 77 / 0.14)",
        glow: "0 0 60px rgb(30 77 123 / 0.25)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 20% 0%, rgb(37 99 168 / 0.35), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 20%, rgb(45 90 61 / 0.3), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgb(196 160 53 / 0.12), transparent 45%)",
        "section-glow": "radial-gradient(ellipse 70% 50% at 50% 0%, rgb(238 244 249 / 0.9), transparent 70%)",
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
