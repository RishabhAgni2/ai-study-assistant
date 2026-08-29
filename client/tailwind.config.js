/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F1",
        ink: "#1C2B29",
        pine: {
          DEFAULT: "#2F5D50",
          dark: "#1F4038",
          light: "#E4EDE9",
        },
        highlighter: {
          DEFAULT: "#E8A33D",
          light: "#FBEDD3",
        },
        correct: "#2F7D4F",
        incorrect: "#B3462F",
        line: "#DCE0D6",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28, 43, 41, 0.06), 0 8px 24px rgba(28, 43, 41, 0.06)",
        cardHover: "0 2px 4px rgba(28, 43, 41, 0.08), 0 16px 32px rgba(28, 43, 41, 0.10)",
      },
    },
  },
  plugins: [],
};
