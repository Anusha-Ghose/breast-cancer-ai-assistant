/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A41",
          light: "#2E4257",
          soft: "#4A5D73"
        },
        porcelain: {
          DEFAULT: "#F8F5F1",
          dim: "#F1ECE5"
        },
        rose: {
          50: "#FBF0EF",
          100: "#F3DCDC",
          300: "#D89AA0",
          500: "#B76E79",
          600: "#9C5560",
          700: "#7A3F49",
          900: "#4A2029"
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
