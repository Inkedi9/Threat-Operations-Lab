import { resolveLookupResult } from "./engine";
import { mapMitreFromResult } from "./mitre";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function intersection(a = [], b = []) {
  const left = asArray(a).map((item) => String(item).toLowerCase());
  return asArray(b).filter((item) => left.includes(String(item).toLowerCase()));
}

function sourceNames(result) {
  return asArray(result?.sources).map((source) => source.name);
}

export function buildCompareResult(leftQuery, rightQuery) {
  const left = resolveLookupResult(leftQuery);
  const right = resolveLookupResult(rightQuery);
  const leftMitre = mapMitreFromResult(left);
  const rightMitre = mapMitreFromResult(right);

  const sharedMitre = leftMitre.filter((leftTechnique) =>
    rightMitre.some((rightTechnique) => rightTechnique.id === leftTechnique.id),
  );

  if (!left || !right) {
    return {
      left,
      right,
      error:
        "Unable to resolve one or both IoCs from the mock intelligence corpus.",
    };
  }

  const sharedTags = intersection(left.tags, right.tags);
  const sharedSources = intersection(sourceNames(left), sourceNames(right));
  const sharedCampaigns = intersection(left.campaigns, right.campaigns);
  const sharedActors = intersection(left.actors, right.actors);

  const scoreDelta = Math.abs(
    (left.threatScore || 0) - (right.threatScore || 0),
  );
  const overlapScore =
    sharedTags.length * 12 +
    sharedSources.length * 8 +
    sharedCampaigns.length * 22 +
    sharedActors.length * 22;

  const normalizedOverlap = Math.min(100, overlapScore);

  const verdict =
    normalizedOverlap >= 70
      ? "Strong correlation"
      : normalizedOverlap >= 40
        ? "Moderate correlation"
        : normalizedOverlap >= 15
          ? "Weak correlation"
          : "No meaningful overlap";

  const recommendation =
    normalizedOverlap >= 70
      ? "Treat both indicators as part of the same investigation cluster. Pivot on shared infrastructure, campaigns and actor attribution."
      : normalizedOverlap >= 40
        ? "Maintain both indicators in the same analyst workspace and validate overlap with passive DNS, source confidence and timeline proximity."
        : normalizedOverlap >= 15
          ? "Keep as loosely related until additional enrichment confirms infrastructure or campaign proximity."
          : "Investigate separately unless new telemetry introduces shared source, tag or campaign evidence.";

  return {
    left,
    right,
    scoreDelta,
    sharedTags,
    sharedSources,
    sharedCampaigns,
    sharedActors,
    normalizedOverlap,
    verdict,
    recommendation,
    leftMitre,
    rightMitre,
    sharedMitre,
  };
}
