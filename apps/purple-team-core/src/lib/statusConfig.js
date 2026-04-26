/* ========================================
   🏷️ Status Config
======================================== */

export const STATUS_CONFIG = {
  detected: {
    className: "border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
    label: "Detected",
  },
  "partially detected": {
    className: "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber",
    label: "Partially Detected",
  },
  missed: {
    className: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red",
    label: "Missed",
  },
  "in progress": {
    className: "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue",
    label: "In Progress",
  },
  active: {
    className: "border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
    label: "Active",
  },
  draft: {
    className: "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber",
    label: "Draft",
  },
  disabled: {
    className: "border-cyber-border bg-cyber-panel2 text-cyber-muted",
    label: "Disabled",
  },
  completed: {
    className: "border-cyber-green/30 bg-cyber-green/10 text-cyber-green",
    label: "Completed",
  },
  idle: {
    className: "border-cyber-border bg-cyber-panel2 text-cyber-muted",
    label: "Idle",
  },
};

export const SEVERITY_CONFIG = {
  critical: {
    className: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red",
    label: "Critical",
  },
  high: {
    className: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red",
    label: "High",
  },
  medium: {
    className: "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber",
    label: "Medium",
  },
  low: {
    className: "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue",
    label: "Low",
  },
};

export const RULE_TYPE_CONFIG = {
  sigma: {
    className: "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet",
    label: "SIGMA",
  },
  yara: {
    className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    label: "YARA",
  },
};

export function getStatusTone(value) {
  if (!value) {
    return "border-cyber-border bg-cyber-panel2 text-cyber-text";
  }

  const key = String(value).toLowerCase();
  return (
    STATUS_CONFIG[key]?.className ??
    "border-cyber-border bg-cyber-panel2 text-cyber-text"
  );
}

export function getSeverityTone(value) {
  if (!value) {
    return "border-cyber-border bg-cyber-panel2 text-cyber-text";
  }

  const key = String(value).toLowerCase();
  return (
    SEVERITY_CONFIG[key]?.className ??
    "border-cyber-border bg-cyber-panel2 text-cyber-text"
  );
}

export function getRuleTypeTone(value) {
  if (!value) {
    return "border-cyber-border bg-cyber-panel2 text-cyber-text";
  }

  const key = String(value).toLowerCase();
  return (
    RULE_TYPE_CONFIG[key]?.className ??
    "border-cyber-border bg-cyber-panel2 text-cyber-text"
  );
}
