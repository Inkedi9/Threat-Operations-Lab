export function getEnvironmentStatus(state) {
  const compromised = state.metrics.compromisedIdentities;
  const criticalReached = state.metrics.criticalAssetsReached;
  const lateral = state.metrics.lateralMovementAttempts;

  if (criticalReached > 0) {
    return {
      label: "Critical Exposure",
      tone: "critical",
      message:
        "Privileged access has reached critical enterprise assets. Immediate containment is required.",
    };
  }

  if (lateral > 0 || compromised >= 3) {
    return {
      label: "Under Active Attack",
      tone: "high",
      message:
        "Compromised identities are expanding access across systems and trust relationships.",
    };
  }

  if (compromised > 0) {
    return {
      label: "Suspicious Activity",
      tone: "medium",
      message:
        "Unauthorized identity activity has been detected in the environment.",
    };
  }

  return {
    label: "Stable",
    tone: "low",
    message:
      "The corporate identity environment is currently operating within its baseline state.",
  };
}
