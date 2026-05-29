import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep Manipuri forest green
        forest: {
          50:  "#f2f7f4",
          100: "#deeee5",
          200: "#beddcc",
          300: "#91c4a8",
          400: "#5ea47f",
          500: "#3c8660",
          600: "#2b6b4c",
          700: "#23563e",
          800: "#1e4533",
          900: "#19382a",
          950: "#0d2019",
        },
        // Accent — turmeric / saffron gold
        saffron: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Secondary — terracotta / clay
        clay: {
          50:  "#fdf4f0",
          100: "#fae4d8",
          200: "#f5c7b0",
          300: "#eda280",
          400: "#e37550",
          500: "#d95530",
          600: "#c04020",
          700: "#a0331a",
          800: "#832c1a",
          900: "#6c281a",
        },
        // Neutral — warm charcoal
        ink: {
          50:  "#f6f5f3",
          100: "#eae8e3",
          200: "#d4d0c9",
          300: "#b5afa4",
          400: "#928a7c",
          500: "#776e60",
          600: "#605a4e",
          700: "#4e4840",
          800: "#413c36",
          900: "#1a1612",
          950: "#0e0c09",
        },
        // Background — warm rice paper
        paper: {
          DEFAULT: "#f9f5ee",
          dark:    "#f0ead9",
        },
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
