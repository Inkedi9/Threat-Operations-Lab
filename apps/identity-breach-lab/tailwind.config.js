/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#040405",
        panel: "#0b0b0e",
        panelAlt: "#101014",
        line: "#121318",
        lineSoft: "#191a21",
        danger: "#ef4444",
        dangerSoft: "#f87171",
        dangerDeep: "#991b1b",
        crimson: "#7f1d1d",
        ink: "#e7e5e4",
        muted: "#a1a1aa",
      },
      boxShadow: {
        danger:
          "0 0 0 1px rgba(239,68,68,0.18), 0 8px 24px rgba(239,68,68,0.10)",
        dangerSoft:
          "0 0 0 1px rgba(239,68,68,0.10), 0 6px 18px rgba(239,68,68,0.06)",
        soft: "0 18px 40px rgba(0,0,0,0.38)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
