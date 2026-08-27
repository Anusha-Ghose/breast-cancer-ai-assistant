/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--color-white) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          light: "rgb(var(--color-ink-light) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)"
        },
        porcelain: {
          DEFAULT: "rgb(var(--color-porcelain) / <alpha-value>)",
          dim: "rgb(var(--color-porcelain-dim) / <alpha-value>)"
        },
        rose: {
          50: "rgb(var(--color-rose-50) / <alpha-value>)",
          100: "rgb(var(--color-rose-100) / <alpha-value>)",
          300: "rgb(var(--color-rose-300) / <alpha-value>)",
          500: "rgb(var(--color-rose-500) / <alpha-value>)",
          600: "rgb(var(--color-rose-600) / <alpha-value>)",
          700: "rgb(var(--color-rose-700) / <alpha-value>)",
          900: "rgb(var(--color-rose-900) / <alpha-value>)"
        },
        blue: {
          50: "rgb(var(--color-blue-50) / <alpha-value>)",
          100: "rgb(var(--color-blue-100) / <alpha-value>)",
          200: "rgb(var(--color-blue-200) / <alpha-value>)",
          600: "rgb(var(--color-blue-600) / <alpha-value>)",
          800: "rgb(var(--color-blue-800) / <alpha-value>)",
          900: "rgb(var(--color-blue-900) / <alpha-value>)"
        },
        sage: {
          50: "#EDF3EF",
          100: "#D3E4D8",
          400: "#6C9885",
          500: "#4F7C74",
          600: "#3C6259",
          900: "#1F332E"
        },
        amber: {
          100: "#F7E4CC",
          500: "#C97B3B",
          700: "#8F551F"
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 42, 65, 0.06), 0 4px 16px rgba(27, 42, 65, 0.04)"
      }
    },
  },
  plugins: [],
}