/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0C0F15",
          900: "#10141C",
          800: "#171C26",
          700: "#1F2630",
          600: "#2A313D",
          400: "#8B93A3",
          100: "#E7EAF0",
        },
        amber: {
          400: "#F2A65A",
          500: "#E8934A",
        },
        teal: {
          400: "#5FD4C0",
          500: "#45B9A6",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
