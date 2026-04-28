export function buildHuntingProfile(result) {
  if (!result) {
    return {
      hypotheses: [],
      observables: [],
      hunts: [],
      mitre: [],
    };
  }

  const baseTags = result.tags || [];
  const baseSources = result.sources || [];
  const campaigns = result.campaigns || [];
  const actors = result.actors || [];

  const hypotheses = [
    {
      id: "hunt-h1",
      title: "Infrastructure reuse across adjacent domains",
      priority: "high",
      summary:
        "Inspect passive DNS adjacency, registrar overlap and certificate reuse to identify sibling infrastructure tied to the same cluster.",
    },
    {
      id: "hunt-h2",
      title: "Beaconing or staged callback activity",
      priority: result.threatScore >= 80 ? "high" : "medium",
      summary:
        "Search proxy, DNS and EDR telemetry for repeated short-lived connections, callback timing patterns and secondary contact paths.",
    },
    {
      id: "hunt-h3",
      title: "Lure delivery and malware handoff overlap",
      priority: campaigns.length ? "high" : "medium",
      summary:
        "Correlate suspicious email, URL redirection, download chains and malware loader indicators across delivery infrastructure.",
    },
  ];

  const observables = [
    {
      label: "Primary indicator",
      value: result.query,
      type: result.type || "indicator",
    },
    ...(result.relatedRecords || []).slice(0, 4).map((item) => ({
      label: item.title,
      value: item.query,
      type: item.type,
    })),
  ];

  const hunts = [
    {
      id: "hunt-q1",
      title: "DNS / Proxy hunt",
      query:
        "Search for repeated resolution, low-volume beaconing, short interval callbacks and rare outbound destinations tied to the observed indicator set.",
    },
    {
      id: "hunt-q2",
      title: "EDR / process hunt",
      query:
        "Review suspicious parent-child execution chains, archive extraction, unsigned loaders and outbound connections immediately after execution.",
    },
    {
      id: "hunt-q3",
      title: "Identity / lure hunt",
      query:
        "Inspect suspicious emails, login lure URLs, credential harvesting domains and brand impersonation related artifacts.",
    },
  ];

  const mitre = inferMitreFromResult(
    result,
    baseTags,
    campaigns,
    actors,
    baseSources,
  );

  return {
    hypotheses,
    observables,
    hunts,
    mitre,
  };
}

export function inferMitreFromResult(
  result,
  tags = [],
  campaigns = [],
  actors = [],
  sources = [],
) {
  const entries = [];
  const lowerTags = tags.map((tag) => String(tag).toLowerCase());

  if (
    result.type === "email" ||
    lowerTags.some((tag) => tag.includes("phishing"))
  ) {
    entries.push({
      tactic: "Initial Access",
      technique: "Phishing",
      id: "T1566",
      confidence: "high",
    });
  }

  if (
    result.type === "url" ||
    lowerTags.some((tag) => tag.includes("credential"))
  ) {
    entries.push({
      tactic: "Credential Access",
      technique: "Phishing for Information",
      id: "T1598",
      confidence: "medium",
    });
  }

  if (
    lowerTags.some((tag) => tag.includes("loader")) ||
    lowerTags.some((tag) => tag.includes("sandbox")) ||
    result.type === "hash"
  ) {
    entries.push({
      tactic: "Execution",
      technique: "User Execution",
      id: "T1204",
      confidence: "medium",
    });
  }

  if (
    lowerTags.some((tag) => tag.includes("c2")) ||
    lowerTags.some((tag) => tag.includes("beacon")) ||
    lowerTags.some((tag) => tag.includes("callback"))
  ) {
    entries.push({
      tactic: "Command and Control",
      technique: "Application Layer Protocol",
      id: "T1071",
      confidence: "high",
    });
  }

  if (
    result.type === "domain" ||
    result.type === "ip" ||
    lowerTags.some((tag) => tag.includes("fast-flux"))
  ) {
    entries.push({
      tactic: "Command and Control",
      technique: "Dynamic Resolution",
      id: "T1568",
      confidence: "medium",
    });
  }

  if (campaigns.length || actors.length || sources.length >= 4) {
    entries.push({
      tactic: "Resource Development",
      technique: "Acquire Infrastructure",
      id: "T1583",
      confidence: "medium",
    });
  }

  return dedupeMitre(entries);
}

function dedupeMitre(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    const key = `${entry.id}-${entry.tactic}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
