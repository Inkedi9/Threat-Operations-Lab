import { mitreTechniques } from "../data/mitreData";

export function mapMitreFromResult(result) {
  if (!result) return [];

  const tags = (result.tags || []).map((t) => t.toLowerCase());
  const type = result.type;

  const matches = [];

  if (type === "email" || tags.includes("phishing")) {
    matches.push("T1566");
  }

  if (
    tags.includes("credential theft") ||
    tags.includes("identity compromise")
  ) {
    matches.push("T1078");
    matches.push("T1110");
  }

  if (type === "domain" || type === "ip") {
    matches.push("T1071");
    matches.push("T1568");
  }

  if (type === "hash") {
    matches.push("T1204");
  }

  return matches
    .map((id) => mitreTechniques[id])
    .filter(Boolean)
    .map((t) => ({
      ...t,
      confidence: result.threatScore > 75 ? "high" : "medium",
    }));
}
