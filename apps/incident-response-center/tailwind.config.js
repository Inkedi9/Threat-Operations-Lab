/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        command: {
          black: "#050505",
          graphite: "#111111",
          panel: "#17120d",
          amber: "#f59e0b",
          orange: "#f97316",
          red: "#ef4444",
          green: "#22c55e",
          text: "#f8f4ec",
          muted: "#a8a29e",
        },
      },
      boxShadow: {
        amberGlow: "0 0 28px rgba(245, 158, 11, 0.16)",
      },
    },
  },
  plugins: [],
};
