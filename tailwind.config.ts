import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Ink — adaptive neutrals (CSS vars flip in light mode) ──────────
        // In dark mode:  950=near-black … 50=near-white
        // In light mode: 950=near-white … 50=near-black
        ink: {
          950: "var(--ink-950)",
          900: "var(--ink-900)",
          800: "var(--ink-800)",
          700: "var(--ink-700)",
          600: "var(--ink-600)",
          500: "var(--ink-500)",
          400: "var(--ink-400)",
          300: "var(--ink-300)",
          200: "var(--ink-200)",
          100: "var(--ink-100)",
          50:  "var(--ink-50)",
        },
        // ── Semantic ─────────────────────────────────────────────────────────
        foreground: "var(--foreground)",
        background: "var(--background)",
        // ── Forest green ─────────────────────────────────────────────────────
        forest: {
          50:  "#f2f7f4", 100: "#deeee5", 200: "#beddcc", 300: "#91c4a8",
          400: "#5ea47f", 500: "#3c8660", 600: "#2b6b4c", 700: "#23563e",
          800: "#1e4533", 900: "#19382a", 950: "#0d2019",
        },
        // ── Saffron gold ─────────────────────────────────────────────────────
        saffron: {
          50:  "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
          400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
          800: "#92400e", 900: "#78350f", 950: "#451a03",
        },
        // ── Clay / terracotta ────────────────────────────────────────────────
        clay: {
          50:  "#fdf4f0", 100: "#fae4d8", 200: "#f5c7b0", 300: "#eda280",
          400: "#e37550", 500: "#d95530", 600: "#c04020", 700: "#a0331a",
          800: "#832c1a", 900: "#6c281a",
        },
        paper: { DEFAULT: "#f9f5ee", dark: "#f0ead9" },
      },
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
