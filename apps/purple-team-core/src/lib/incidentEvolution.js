import { INCIDENT_STATES } from "../data/ecosystem/incidentStates";

export function deriveIncidentState(incident) {
  if (!incident) return INCIDENT_STATES.NEW;

  const timelineStages = new Set(
    (incident.timeline || []).map((event) => event.stage),
  );
  const hasPhishing = timelineStages.has("phishing");
  const hasIdentity = timelineStages.has("identity");
  const hasSoc = timelineStages.has("soc");
  const hasOsint = timelineStages.has("osint");
  const hasThreatIntel = timelineStages.has("threat-intel");

  if (hasThreatIntel) return INCIDENT_STATES.CORRELATION_NEEDED;
  if (hasOsint) return INCIDENT_STATES.CORRELATION_NEEDED;
  if (hasSoc) return INCIDENT_STATES.ENRICHMENT_NEEDED;
  if (hasIdentity) return INCIDENT_STATES.PARTIALLY_DETECTED;
  if (hasPhishing) return INCIDENT_STATES.IN_PROGRESS;

  return INCIDENT_STATES.NEW;
}

export function buildIncidentEvolution(incident) {
  const derivedState = deriveIncidentState(incident);

  const steps = [
    {
      state: INCIDENT_STATES.IN_PROGRESS,
      label: "Phishing entry",
      completed: hasStage(incident, "phishing"),
    },
    {
      state: INCIDENT_STATES.PARTIALLY_DETECTED,
      label: "Identity compromise",
      completed: hasStage(incident, "identity"),
    },
    {
      state: INCIDENT_STATES.ENRICHMENT_NEEDED,
      label: "SOC detection",
      completed: hasStage(incident, "soc"),
    },
    {
      state: INCIDENT_STATES.CORRELATION_NEEDED,
      label: "OSINT enrichment",
      completed: hasStage(incident, "osint"),
    },
    {
      state: INCIDENT_STATES.CORRELATION_NEEDED,
      label: "Threat intel correlation",
      completed: hasStage(incident, "threat-intel"),
    },
  ];

  return {
    derivedState,
    steps,
    completion: Math.round(
      (steps.filter((step) => step.completed).length / steps.length) * 100,
    ),
  };
}

function hasStage(incident, stage) {
  return (incident?.timeline || []).some((event) => event.stage === stage);
}
