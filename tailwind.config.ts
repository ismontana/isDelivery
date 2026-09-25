import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        surface: "hsl(var(--surface))",
        "surface-raised": "hsl(var(--surface-raised))",
        ink: "hsl(var(--ink))",
        "ink-muted": "hsl(var(--ink-muted))",
        primary: {
          DEFAULT: "#0A2A43",
          deep: "#0A2A43",
          base: "#0F3D5C",
          accent: "#1E6FA8",
          light: "#4FA3D1",
        },
        nexo: {
          rojo: "#D24444",
          amarillo: "#D9A62E",
          verde: "#3F9B62",
        },
        prospecto: "#D98A2B",
        danger: "#C0402F",
      },
      borderRadius: {
        capsule: "999px",
        card: "20px",
        sheet: "28px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px -8px rgba(10, 42, 67, 0.28)",
        "glass-sm": "0 4px 16px -4px rgba(10, 42, 67, 0.2)",
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
