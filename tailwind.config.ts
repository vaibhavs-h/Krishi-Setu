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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary": "#0b3d1a",
        "primary-light": "#155e2a",
        "neon": "#39FF14",
        "background-light": "#f0f2f0",
        "background-dark": "#122016",
        "charcoal": "#0F1117",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        sans: ["var(--font-geist-sans)"],
        serif: ["var(--font-newsreader)"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
