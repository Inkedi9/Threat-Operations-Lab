import { ECOSYSTEM_APPS } from "../data/ecosystem/apps";

/* ========================================
   🔗 Ecosystem Deep Link Builder
======================================== */

export function buildEcosystemLink(appId, params = {}) {
  const app = ECOSYSTEM_APPS[appId];

  if (!app?.url) {
    return "#";
  }

  const url = new URL(app.url);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function buildIncidentDeepLinks(incident) {
  if (!incident) {
    return [];
  }

  return [
    {
      id: "phishing",
      label: "Investigate phishing entry",
      appId: "phishingScope",
      href: buildEcosystemLink("phishingScope", {
        incident: incident.id,
        domain: incident.attacker.domain,
        ioc: incident.attacker.domain,
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
    {
      id: "soc",
      label: "Open SOC detection view",
      appId: "socSimulator",
      href: buildEcosystemLink("socSimulator", {
        incident: incident.id,
        user: incident.victim.user,
        technique: "T1078",
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
    {
      id: "osint",
      label: "Enrich suspicious IP",
      appId: "osintInvestigator",
      href: buildEcosystemLink("osintInvestigator", {
        incident: incident.id,
        ip: incident.attacker.ip,
        domain: incident.attacker.domain,
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
    {
      id: "threat-intel",
      label: "Correlate IoCs",
      appId: "threatIntelligence",
      href: buildEcosystemLink("threatIntelligence", {
        incident: incident.id,
        ioc: incident.attacker.domain,
        ip: incident.attacker.ip,
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
    {
      id: "identity",
      label: "Explore identity path",
      appId: "identityAccessSimulator",
      href: buildEcosystemLink("identityAccessSimulator", {
        incident: incident.id,
        user: incident.victim.user,
        ip: incident.attacker.ip,
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
    {
      id: "attack-surface",
      label: "Scan attack surface",
      appId: "osintAttackSurface",
      href: buildEcosystemLink("osintAttackSurface", {
        incident: incident.id,
        domain: incident.attacker.domain,
        ioc: incident.attacker.domain,
        returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
      }),
    },
  ];
}

export function buildTimelineEventLink(incident, event) {
  if (!incident || !event?.app) return "#";

  const baseParams = {
    incident: incident.id,
    returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
  };

  if (event.stage === "phishing") {
    return buildEcosystemLink(event.app, {
      ...baseParams,
      domain: incident.attacker.domain,
      ioc: incident.attacker.domain,
    });
  }

  if (event.stage === "identity") {
    return buildEcosystemLink(event.app, {
      ...baseParams,
      user: incident.victim.user,
      ip: incident.attacker.ip,
    });
  }

  if (event.stage === "soc") {
    return buildEcosystemLink(event.app, {
      ...baseParams,
      user: incident.victim.user,
      technique: "T1078",
    });
  }

  if (event.stage === "osint") {
    return buildEcosystemLink(event.app, {
      ...baseParams,
      ip: incident.attacker.ip,
      domain: incident.attacker.domain,
    });
  }

  if (event.stage === "threat-intel") {
    return buildEcosystemLink(event.app, {
      ...baseParams,
      ioc: incident.attacker.domain,
      ip: incident.attacker.ip,
    });
  }

  return buildEcosystemLink(event.app, baseParams);
}

export function getModuleStatus(appId) {
  const liveApps = new Set([
    "phishingScope",
    "socSimulator",
    "osintInvestigator",
    "osintAttackSurface",
  ]);

  const plannedApps = new Set([
    "identityAccessSimulator",
    "threatIntelligence",
    "interactLabIndex",
  ]);

  if (liveApps.has(appId)) return "live";
  if (plannedApps.has(appId)) return "planned";

  return "mock";
}

export function buildAttackSurfaceLink(incident) {
  if (!incident) return "#";

  return buildEcosystemLink("osintAttackSurface", {
    incident: incident.id,
    domain: incident.attacker.domain,
    ioc: incident.attacker.domain,
    returnTo: ECOSYSTEM_APPS.purpleTeamLab.url,
  });
}
