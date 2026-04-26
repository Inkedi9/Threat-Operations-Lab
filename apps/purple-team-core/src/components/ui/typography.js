/* ========================================
   ✍️ UI Typography Tokens
======================================== */

export const type = {
  pageEyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.35em] text-cyber-violet",

  pageTitle:
    "font-bold tracking-[-0.02em] text-3xl md:text-4xl text-cyber-text",

  sectionTitle: "text-lg font-semibold tracking-[-0.01em] text-cyber-text",

  cardTitle: "text-sm font-semibold tracking-[-0.01em] text-cyber-text",

  body: "text-sm leading-6 text-cyber-muted",

  bodyStrong: "text-sm leading-6 font-medium text-cyber-text",

  label: "text-[11px] uppercase tracking-[0.22em] text-cyber-muted",

  statValue: "text-xl font-bold tracking-[-0.02em] text-cyber-text",

  button: "text-sm font-semibold tracking-[0.02em]",

  buttonSmall: "text-xs font-semibold tracking-[0.02em]",

  chip: "text-[11px] font-semibold tracking-[0.02em]",

  monoLabel:
    "font-mono text-[11px] uppercase tracking-[0.22em] text-cyber-muted",

  monoBody: "font-mono text-sm leading-6 text-slate-300",
};

/* ========================================
   🧩 Tiny Class Merge Helper
======================================== */

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
