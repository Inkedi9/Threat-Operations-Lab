/* ========================================
   🔥 UI Helper — Hot System Layer
======================================== */

export function getHotStateClasses({
  hotLevel = "none", // none | low | medium | high
  live = false,
  stress = false,
  scan = false,
}) {
  const classes = [];

  if (hotLevel === "low") {
    classes.push(
      "after:absolute after:inset-0 after:pointer-events-none after:bg-white/[0.015]",
    );
  }

  if (hotLevel === "medium") {
    classes.push(
      "after:absolute after:inset-0 after:pointer-events-none after:bg-white/[0.02]",
      "shadow-[0_0_24px_rgba(255,255,255,0.03)]",
    );
  }

  if (hotLevel === "high") {
    classes.push(
      "after:absolute after:inset-0 after:pointer-events-none after:bg-white/[0.025]",
      "shadow-[0_0_34px_rgba(255,255,255,0.04)]",
    );
  }

  if (live) {
    classes.push("ring-1 ring-white/[0.06]");
  }

  if (stress) {
    classes.push("animate-[panelStressPulse_2.8s_ease-in-out_infinite]");
  }

  if (scan) {
    classes.push(
      "before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3 before:pointer-events-none",
      "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]",
      "before:animate-[panelScanSweep_3.2s_linear_infinite]",
    );
  }

  return classes.join(" ");
}
