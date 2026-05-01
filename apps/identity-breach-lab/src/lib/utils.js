function generateId(prefix = "evt") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function createEvent(partial) {
  return {
    id: partial.id ?? generateId(),
    timestamp: partial.timestamp ?? "10:00",
    type: partial.type ?? "attack",
    sourceIdentity: partial.sourceIdentity ?? "unknown",
    targetSystem: partial.targetSystem ?? "unknown",
    severity: partial.severity ?? "medium",
    status: partial.status ?? "observed",
    technique: partial.technique ?? "Unknown Technique",
    techniqueId: partial.techniqueId ?? null,
    tactic: partial.tactic ?? null,
    category: partial.category ?? "execution",
    message: partial.message ?? "Simulated event detected.",
  };
}

export function updateAttackPath(path, keys = []) {
  return path.map((step) =>
    keys.includes(step.key) ? { ...step, complete: true } : step,
  );
}

export function riskBand(score) {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}
