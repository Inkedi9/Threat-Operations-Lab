export function getQueryContext() {
  const params = new URLSearchParams(window.location.search);

  return {
    incidentId: params.get("incident") || "incident-001",
    source: params.get("source"),
    user: params.get("user"),
    ip: params.get("ip") || params.get("ioc"),
    asset: params.get("asset"),
  };
}
