export function buildGlobalAttackStory(incident) {
  if (!incident) return null;

  const stages = incident.timeline || [];
  const mitre = incident.mitre || [];

  const risk = mitre.some((m) => m.id === "T1078")
    ? 90
    : mitre.some((m) => m.id === "T1566")
      ? 80
      : 60;

  const confidence = Math.min(100, stages.length * 18);

  return {
    title: "Phishing-led identity compromise",
    risk,
    confidence,
    summary:
      "Attack started via phishing, moved into identity compromise, triggered SOC detection, then pivoted into infrastructure and threat intelligence enrichment.",
    keyFindings: [
      `User ${incident.victim.user} targeted`,
      `Suspicious IP ${incident.attacker.ip}`,
      `Domain ${incident.attacker.domain}`,
      `${mitre.length} MITRE techniques observed`,
    ],
    stages: stages.map((event, index) => ({
      ...event,
      order: index + 1,
      status: getStageStatus(event.stage),
      intent: getStageIntent(event.stage),
      riskTone: getStageRiskTone(event.stage),
    })),
  };
}

function getStageStatus(stage) {
  if (stage === "phishing") return "confirmed";
  if (stage === "identity") return "suspected";
  if (stage === "soc") return "detected";
  if (stage === "osint") return "enriched";
  if (stage === "threat-intel") return "planned";
  return "unknown";
}

function getStageIntent(stage) {
  if (stage === "phishing")
    return "Initial access vector confirmed through email lure.";
  if (stage === "identity")
    return "Credential use suggests possible account takeover.";
  if (stage === "soc")
    return "Detection layer observed authentication anomaly.";
  if (stage === "osint")
    return "Infrastructure enrichment supports investigation.";
  if (stage === "threat-intel")
    return "IoC correlation can validate campaign linkage.";
  return "Additional context required.";
}

function getStageRiskTone(stage) {
  if (stage === "phishing") return "threat";
  if (stage === "identity") return "hot";
  if (stage === "soc") return "defense";
  if (stage === "osint") return "intel";
  if (stage === "threat-intel") return "signal";
  return "default";
}
