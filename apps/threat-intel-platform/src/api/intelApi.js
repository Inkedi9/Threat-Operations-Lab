import {
  getLookupResult,
  resolveActors,
  resolveCampaigns,
} from "../lib/engine";

// main lookup
export async function fetchLookup(query) {
  const result = getLookupResult(query);

  return {
    data: {
      query,
      result,
      records: result?.relatedRecords || [],
      count: result?.relatedRecords?.length || 0,
    },
    meta: {
      delay: Math.round(300 + Math.random() * 700),
      timestamp: Date.now(),
    },
  };
}

// multi-source enrichment
export async function fetchEnrichment(query) {
  const result = getLookupResult(query);

  return {
    data: result?.sources || [],
    meta: {
      delay: Math.round(500 + Math.random() * 900),
      timestamp: Date.now(),
    },
  };
}

// actor detail
export async function fetchActor(id) {
  const actor = resolveActors([id])?.[0] || null;

  return {
    data: actor,
    meta: {
      delay: Math.round(250 + Math.random() * 500),
      timestamp: Date.now(),
    },
  };
}

// campaign detail
export async function fetchCampaign(id) {
  const campaign = resolveCampaigns([id])?.[0] || null;

  return {
    data: campaign,
    meta: {
      delay: Math.round(250 + Math.random() * 500),
      timestamp: Date.now(),
    },
  };
}
