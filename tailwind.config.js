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
