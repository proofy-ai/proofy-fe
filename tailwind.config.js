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
        sans: ["Noto Sans KR", "sans-serif"],
      },
      keyframes: {
        "step-slide-in": {
          "0%": { opacity: "0", transform: "translateX(-14px) scale(0.94)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "item-drop-in": {
          "0%": { opacity: "0", gridTemplateRows: "0fr" },
          "100%": { opacity: "1", gridTemplateRows: "1fr" },
        },
        "success-pop": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "55%": { opacity: "1", transform: "scale(1.08)" },
          "75%": { transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "typing-dot": {
          "0%, 80%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(-3px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "row-leave": {
          "0%": { opacity: "1", maxHeight: "20rem", marginBottom: "0" },
          "100%": {
            opacity: "0",
            maxHeight: "0",
            paddingTop: "0",
            paddingBottom: "0",
            marginBottom: "-0.5rem",
          },
        },
        "bar-finish": {
          "0%": { opacity: "1", maxHeight: "4px" },
          "65%": { opacity: "1", maxHeight: "4px" },
          "100%": { opacity: "0", maxHeight: "0px" },
        },
      },
      animation: {
        "step-slide-in":
          "step-slide-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        "item-drop-in": "item-drop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "success-pop": "success-pop 0.8s ease-out both",
        "bubble-in": "bubble-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 3.2s ease-in-out infinite",
        "typing-dot": "typing-dot 1s ease-in-out infinite",
        "row-leave": "row-leave 1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "bar-finish": "bar-finish 1.1s ease-in-out both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
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
