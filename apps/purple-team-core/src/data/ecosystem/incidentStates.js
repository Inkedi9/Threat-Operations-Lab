export const INCIDENT_STATES = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  PARTIALLY_DETECTED: "partially_detected",
  ENRICHMENT_NEEDED: "enrichment_needed",
  CORRELATION_NEEDED: "correlation_needed",
  CLOSED: "closed",
};

export const INCIDENT_STATE_LABELS = {
  [INCIDENT_STATES.NEW]: "New",
  [INCIDENT_STATES.IN_PROGRESS]: "In Progress",
  [INCIDENT_STATES.PARTIALLY_DETECTED]: "Partially Detected",
  [INCIDENT_STATES.ENRICHMENT_NEEDED]: "Enrichment Needed",
  [INCIDENT_STATES.CORRELATION_NEEDED]: "Correlation Needed",
  [INCIDENT_STATES.CLOSED]: "Closed",
};

export function normalizeIncidentState(status) {
  return String(status || INCIDENT_STATES.NEW).toLowerCase();
}
