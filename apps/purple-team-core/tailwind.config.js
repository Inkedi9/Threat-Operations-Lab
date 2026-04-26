/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#060b16",
          bgSoft: "#0b1220",
          panel: "#0f172a",
          panel2: "#111827",
          border: "#1e293b",
          text: "#e2e8f0",
          muted: "#94a3b8",
          red: "#ef4444",
          blue: "#3b82f6",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
          green: "#22c55e",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        cyber: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(139,92,246,0.18), 0 8px 32px rgba(139,92,246,0.12)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
