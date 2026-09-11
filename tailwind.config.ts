import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Poppins", "system-ui", "sans-serif"]
      },
      colors: {
        blush: {
          50: "#fdf6f2",
          100: "#faeee7",
          200: "#f3dcd0",
          300: "#e8c1ad",
          400: "#d69d80",
          500: "#bd7a58",
          600: "#a2603f",
          700: "#834c33",
          800: "#6b3f2d",
          900: "#583629"
        }
      }
    }
  },
  plugins: []
};

export default config;
