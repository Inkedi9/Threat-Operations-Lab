export function createEmptyMetrics() {
  return {
    coverage: 0,
    detectedCount: 0,
    partialCount: 0,
    missedCount: 0,
    totalAlerts: 0,
    totalLogs: 0,
    mttd: null,
    mttr: null,
    momentum: 0,
  };
}

export function createSimulationSession({
  id,
  name = "Purple Team Session",
  mode = "single",
  selectedScenarioIds = [],
  controls = {},
} = {}) {
  return {
    id: id ?? crypto.randomUUID(),
    name,
    mode, // single | campaign
    status: "idle", // idle | running | paused | completed | stopped
    startedAt: null,
    endedAt: null,
    createdAt: new Date().toISOString(),
    selectedScenarioIds,
    controls: {
      mfa: false,
      edr: false,
      ids: false,
      siem: false,
      dlp: false,
      ...controls,
    },
    timeline: [],
    logs: [],
    alerts: [],
    report: null,
    metrics: createEmptyMetrics(),
  };
}
