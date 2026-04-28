import { actors, campaigns, records } from "../data/intelData";
import { detectIndicatorType, normalizeTerm, unique } from "./utils";

export function findRecord(query = "") {
  const normalized = normalizeTerm(query);
  if (!normalized) return records[0];

  return (
    records.find((record) =>
      [record.query, ...(record.aliases || [])].some(
        (candidate) => normalizeTerm(candidate) === normalized,
      ),
    ) ||
    records.find((record) =>
      [record.query, record.title, ...(record.aliases || [])].some(
        (candidate) => normalizeTerm(candidate).includes(normalized),
      ),
    ) ||
    null
  );
}

function createSyntheticResult(query) {
  const inferredType = detectIndicatorType(query);
  return {
    id: "synthetic-result",
    query,
    title: query,
    type: inferredType,
    classification: "Unmapped indicator",
    tlp: "Clear",
    severity: "Unknown",
    disposition: "Unknown",
    confidence: 42,
    threatScore: 38,
    analystPriority: "Tier 3",
    recommendedAction: "Collect more evidence",
    summary:
      "No direct high-confidence mock record matched the query. The platform generated a synthetic triage view to preserve the investigation flow while keeping the CTI narrative coherent.",
    profile: [
      ["Indicator", query],
      ["Type", inferredType],
      ["Status", "Not present in current mocked corpus"],
      ["Next Step", "Expand dataset or create new IOC object"],
      ["Suggested Workflow", "WHOIS, DNS, sandbox and internal overlap lookup"],
    ],
    tags: ["unknown", "triage", "synthetic"],
    relations: [
      {
        id: "s1",
        label: `${inferredType} · ${query.slice(0, 22)}`,
        type: inferredType.toLowerCase(),
        risk: "info",
        x: 50,
        y: 48,
      },
      {
        id: "s2",
        label: "Workflow · enrichment pending",
        type: "workflow",
        risk: "gold",
        x: 25,
        y: 26,
      },
      {
        id: "s3",
        label: "Action · analyst review",
        type: "action",
        risk: "warn",
        x: 75,
        y: 28,
      },
      {
        id: "s4",
        label: "Feed · no overlap yet",
        type: "feed",
        risk: "good",
        x: 28,
        y: 72,
      },
    ],
    edges: [
      ["s1", "s2"],
      ["s1", "s3"],
      ["s1", "s4"],
    ],
    timeline: [
      {
        date: "Now",
        title: "Synthetic triage created",
        body: "The lookup engine generated a placeholder object to keep the investigation flow active.",
      },
    ],
    sources: [
      {
        name: "Internal Intel Feed",
        verdict: "no match",
        score: 24,
        confidence: 24,
        response: 84,
        tone: "info",
        details: ["No object in current corpus"],
        tags: ["no-match"],
      },
      {
        name: "PassiveDNS-like",
        verdict: "pending",
        score: 41,
        confidence: 41,
        response: 215,
        tone: "gold",
        details: ["Would be queried in V2 mock API"],
        tags: ["pending"],
      },
      {
        name: "Sandbox-like",
        verdict: "not applicable yet",
        score: 17,
        confidence: 17,
        response: 430,
        tone: "warn",
        details: ["Requires object-specific enrichment"],
        tags: ["n/a"],
      },
    ],
    campaigns: [],
    actors: [],
    notes: [
      "Collect more context.",
      "Add new mocked record for this indicator.",
      "Use the workbench to define watchlist logic.",
    ],
  };
}

export function getLookupResult(query = "") {
  const exact = findRecord(query);
  return exact || createSyntheticResult(query || records[0].query);
}

export function getCampaignById(campaignId) {
  return campaigns.find((campaign) => campaign.id === campaignId) || null;
}

export function getActorById(actorId) {
  return actors.find((actor) => actor.id === actorId) || null;
}

export function resolveCampaigns(ids = []) {
  return campaigns.filter((campaign) => ids.includes(campaign.id));
}

export function resolveActors(ids = []) {
  return actors.filter((actor) => ids.includes(actor.id));
}

export function getRecordsForCampaign(campaignId) {
  return records.filter((record) =>
    (record.campaigns || []).includes(campaignId),
  );
}

export function getRecordsForActor(actorId) {
  return records.filter((record) => (record.actors || []).includes(actorId));
}

export function buildSearchSuggestions(query = "") {
  const normalized = normalizeTerm(query);
  const source = !normalized
    ? records
    : records.filter((record) =>
        [record.query, record.title, ...(record.aliases || [])].some(
          (candidate) => normalizeTerm(candidate).includes(normalized),
        ),
      );

  return source.slice(0, 6).map((record) => ({
    id: record.id,
    query: record.query,
    title: record.title,
    subtitle: `${record.type} · ${record.disposition}`,
  }));
}

export function getRelatedRecords(record) {
  const candidateCampaigns = new Set(record.campaigns || []);
  const candidateActors = new Set(record.actors || []);

  return records.filter((item) => {
    if (item.id === record.id) return false;
    return (
      (item.campaigns || []).some((id) => candidateCampaigns.has(id)) ||
      (item.actors || []).some((id) => candidateActors.has(id))
    );
  });
}

export function compareQueries(firstQuery, secondQuery) {
  const left = getLookupResult(firstQuery);
  const right = getLookupResult(secondQuery);

  const overlappingTags = left.tags.filter((tag) => right.tags.includes(tag));
  const overlappingCampaignIds = (left.campaigns || []).filter((id) =>
    (right.campaigns || []).includes(id),
  );
  const overlappingActorIds = (left.actors || []).filter((id) =>
    (right.actors || []).includes(id),
  );
  const sharedSources = left.sources
    .map((source) => source.name)
    .filter((name) => right.sources.some((source) => source.name === name));

  const proximity = Math.max(
    8,
    Math.round(
      overlappingTags.length * 15 +
        overlappingCampaignIds.length * 25 +
        overlappingActorIds.length * 20 +
        sharedSources.length * 4 +
        (left.type === right.type ? 10 : 0) +
        Math.max(0, 20 - Math.abs(left.threatScore - right.threatScore)),
    ),
  );

  return {
    left,
    right,
    proximity: Math.min(97, proximity),
    overlappingTags,
    overlappingCampaigns: resolveCampaigns(overlappingCampaignIds),
    overlappingActors: resolveActors(overlappingActorIds),
    sharedSources,
  };
}

function buildIncident001Lookup(query) {
  const normalized = String(query || "").toLowerCase();

  const isMatch = [
    "secure-login-support.com",
    "185.77.44.21",
    "security-alert@secure-login-support.com",
    "incident-001",
  ].some((value) => normalized.includes(value));

  if (!isMatch) return null;

  return {
    id: "incident-001-secure-login-support",
    query,
    title: "secure-login-support.com",
    type: "domain",
    severity: "high",
    threatScore: 82,
    confidence: 78,
    classification: "Credential Harvesting Infrastructure",
    disposition: "suspicious",
    campaigns: ["credential-harvesting-cluster"],
    actors: [],
    tags: [
      "phishing",
      "credential theft",
      "identity compromise",
      "suspicious hosting",
      "purple-team-linked",
    ],
    notes: [
      "Block domain and linked IP at DNS/proxy controls.",
      "Review authentication logs for suspicious login attempts after phishing delivery.",
      "Correlate mailbox delivery traces with SOC alerts from Purple Team Lab.",
      "Hunt for related domains using registrar and certificate reuse pivots.",
    ],
    sources: [
      {
        name: "Purple Team Lab Context",
        status: "linked",
        verdict: "incident-linked",
        confidence: 86,
        score: 82,
        responseTime: 120,
        tags: ["incident-001", "phishing", "identity compromise"],
        data: "Imported from linked Purple Team Lab incident context.",
      },
      {
        name: "Internal Intel Feed",
        status: "complete",
        verdict: "suspicious",
        confidence: 78,
        score: 80,
        responseTime: 260,
        tags: ["credential theft", "phishing infra"],
        data: "Domain resembles credential harvesting infrastructure with suspicious hosting overlap.",
      },
      {
        name: "PassiveDNS-like",
        status: "complete",
        verdict: "clustered",
        confidence: 72,
        score: 76,
        responseTime: 410,
        tags: ["related-ip", "hosting overlap"],
        data: "Observed relationship to 185.77.44.21 and adjacent suspicious login-themed domains.",
      },
    ],
    timeline: [
      {
        date: "Phase 1",
        title: "Phishing lure observed",
        body: "Purple Team Lab incident context indicates a phishing-themed domain used in an identity compromise scenario.",
      },
      {
        date: "Phase 2",
        title: "Infrastructure enrichment",
        body: "Domain correlated with suspicious hosting IP 185.77.44.21 and credential harvesting indicators.",
      },
      {
        date: "Phase 3",
        title: "Threat intelligence correlation",
        body: "Indicator promoted into the Threat Intelligence Platform for campaign-level enrichment and analyst action.",
      },
    ],
    relations: [
      {
        id: "domain-secure-login-support",
        label: "Domain · secure-login-support.com",
        type: "domain",
        risk: "warn",
        x: 50,
        y: 44,
      },
      {
        id: "ip-185-77-44-21",
        label: "IP · 185.77.44.21",
        type: "ip",
        risk: "warn",
        x: 24,
        y: 28,
      },
      {
        id: "email-security-alert",
        label: "Email · security-alert@secure-login-support.com",
        type: "email",
        risk: "warn",
        x: 24,
        y: 70,
      },
      {
        id: "campaign-credential-harvesting",
        label: "Campaign · Credential Harvesting Cluster",
        type: "campaign",
        risk: "bad",
        x: 76,
        y: 34,
      },
      {
        id: "mitre-t1566",
        label: "MITRE · T1566 Phishing",
        type: "technique",
        risk: "gold",
        x: 78,
        y: 72,
      },
    ],
    edges: [
      ["domain-secure-login-support", "ip-185-77-44-21"],
      ["domain-secure-login-support", "email-security-alert"],
      ["domain-secure-login-support", "campaign-credential-harvesting"],
      ["campaign-credential-harvesting", "mitre-t1566"],
    ],
    relatedRecords: [
      {
        id: "incident-001-ip",
        query: "185.77.44.21",
        title: "185.77.44.21",
        type: "ip",
        threatScore: 76,
        summary:
          "Suspicious hosting IP linked to the credential harvesting domain.",
      },
      {
        id: "incident-001-email",
        query: "security-alert@secure-login-support.com",
        title: "security-alert@secure-login-support.com",
        type: "email",
        threatScore: 79,
        summary:
          "Email artifact associated with phishing and identity compromise context.",
      },
    ],
  };
}

export function buildReport(result) {
  const relatedCampaigns = resolveCampaigns(result.campaigns || []);
  const relatedActors = resolveActors(result.actors || []);

  return [
    `# Threat Intelligence Report`,
    ``,
    `Indicator: ${result.title}`,
    `Type: ${result.type}`,
    `Classification: ${result.classification}`,
    `Disposition: ${result.disposition}`,
    `Threat Score: ${result.threatScore}`,
    `Confidence: ${result.confidence}%`,
    `Priority: ${result.analystPriority}`,
    ``,
    `## Executive Summary`,
    result.summary,
    ``,
    `## Multi-Source Verdict`,
    ...result.sources.map(
      (source) =>
        `- ${source.name}: ${source.verdict} (${source.score}/100, ${source.response} ms)`,
    ),
    ``,
    `## Tags`,
    result.tags.map((tag) => `#${tag}`).join(" "),
    ``,
    `## Related Campaigns`,
    ...(relatedCampaigns.length
      ? relatedCampaigns.map(
          (campaign) =>
            `- ${campaign.name} (${campaign.confidence}% confidence)`,
        )
      : ["- None mapped"]),
    ``,
    `## Related Actors`,
    ...(relatedActors.length
      ? relatedActors.map(
          (actor) => `- ${actor.name} (${actor.confidence}% confidence)`,
        )
      : ["- None mapped"]),
    ``,
    `## Timeline`,
    ...result.timeline.map(
      (item) => `- ${item.date}: ${item.title} — ${item.body}`,
    ),
    ``,
    `## Recommended Actions`,
    ...result.notes.map((item) => `- ${item}`),
  ].join("\n");
}

export function buildGraphStats(result) {
  return {
    totalNodes: result.relations.length,
    totalEdges: result.edges.length,
    campaignCount: (result.campaigns || []).length,
    actorCount: (result.actors || []).length,
  };
}

export function buildWorkbenchSummary(history = [], watchlist = []) {
  return {
    recentQueries: history.slice(0, 5),
    trackedCount: watchlist.length,
    uniqueTypes: unique(history.map((item) => item.type)).length,
  };
}

export async function lookupAsync(query) {
  const { fetchLookup, fetchEnrichment } = await import("../api/intelApi");

  const baseResult = buildIncident001Lookup(query) || getLookupResult(query);

  if (!baseResult) {
    throw new Error(`No mock lookup result found for query: ${query}`);
  }

  const [lookup, enrichment] = await Promise.all([
    fetchLookup(query),
    fetchEnrichment(query),
  ]);

  return {
    ...baseResult,
    query,
    records: lookup?.data?.records || baseResult.relatedRecords || [],
    sources: enrichment?.data || baseResult.sources || [],
    enrichment: enrichment?.data || [],
    meta: {
      lookup: lookup?.meta || null,
      enrichment: enrichment?.meta || null,
    },
  };
}

export function resolveLookupResult(query) {
  return buildIncident001Lookup(query) || getLookupResult(query);
}
