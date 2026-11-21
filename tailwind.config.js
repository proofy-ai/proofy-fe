export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
        tablet: "768px",
        "tablet-lg": "1146px",
        desktop: "1400px",
      },
      fontFamily: {
        sans: ["BusanDandiGothic", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          strong: "rgb(var(--color-brand-strong) / <alpha-value>)",
          light: "rgb(var(--color-brand-light) / <alpha-value>)",
          pale: "rgb(var(--color-brand-pale) / <alpha-value>)",
          button: "rgb(var(--color-brand-button) / <alpha-value>)",
          soft: "rgb(var(--color-brand-soft) / <alpha-value>)",
          tint: "rgb(var(--color-brand-tint) / <alpha-value>)",
          line: "rgb(var(--color-brand-line) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          soft: "rgb(var(--color-success-soft) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          soft: "rgb(var(--color-warning-soft) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          soft: "rgb(var(--color-danger-soft) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          sub: "rgb(var(--color-ink-sub) / <alpha-value>)",
          faint: "rgb(var(--color-ink-faint) / <alpha-value>)",
          mark: "rgb(var(--color-ink-mark) / <alpha-value>)",
        },
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
      fontSize: {
        "responsive-xs": ["0.65rem", { lineHeight: "1rem" }],
        "responsive-sm": ["0.75rem", { lineHeight: "1.25rem" }],
        "responsive-base": ["0.8rem", { lineHeight: "1.5rem" }],
        "responsive-lg": ["0.9rem", { lineHeight: "1.75rem" }],
        "responsive-xl": ["1rem", { lineHeight: "1.75rem" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
