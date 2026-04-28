import { mapMitreFromResult } from "./mitre";

export function buildIntelReport(result) {
  if (!result) return null;

  const mitre = mapMitreFromResult(result);

  return {
    title: result.title || result.query,
    type: result.type,
    score: result.threatScore,
    severity: result.severity,
    summary:
      result.summary ||
      "Indicator assessed through multi-source enrichment and correlation pipeline.",
    tags: result.tags || [],
    sources: result.sources || [],
    campaigns: result.campaigns || [],
    actors: result.actors || [],
    mitre,
    notes: result.notes || [],
    recommendation:
      result.threatScore > 75
        ? "Immediate containment and investigation recommended."
        : "Monitor and enrich with additional telemetry.",
  };
}
