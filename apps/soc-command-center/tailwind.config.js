/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        soc: {
          bg: "#020617",
          panel: "rgba(15, 23, 42, 0.72)",
          soft: "rgba(15, 23, 42, 0.46)",
          border: "rgba(59, 130, 246, 0.18)",
          text: "#e5edf8",
          muted: "#94a3b8",
          accent: "#3b82f6",
          cyan: "#22d3ee",
          danger: "#ef4444",
          warning: "#f97316",
          success: "#10b981",
        },
      },
      boxShadow: {
        "soc-glow":
          "0 0 32px rgba(59,130,246,0.16), 0 18px 45px rgba(0,0,0,0.45)",
        "soc-danger":
          "0 0 36px rgba(239,68,68,0.22), 0 20px 50px rgba(0,0,0,0.6)",
      },
    },
  },
};
