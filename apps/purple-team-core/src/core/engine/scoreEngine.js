export function computeMetrics(events, finalStatus) {
  const alerts = events.filter((e) => e.type === "alert");
  const logs = events.filter((e) => e.type === "log");

  const coverage = Math.min(
    100,
    Math.round((alerts.length / (events.length || 1)) * 100),
  );

  return {
    coverage,
    detectedCount: finalStatus === "Detected" ? 1 : 0,
    partialCount: finalStatus === "Partially Detected" ? 1 : 0,
    missedCount: finalStatus === "Missed" ? 1 : 0,
    totalAlerts: alerts.length,
    totalLogs: logs.length,
    mttd: alerts.length > 0 ? 40 : null,
    mttr: finalStatus === "Detected" ? 180 : null,
    momentum:
      finalStatus === "Detected"
        ? 90
        : finalStatus === "Partially Detected"
          ? 60
          : 30,
  };
}
