export function readIncidentParams(search = window.location.search) {
  const params = new URLSearchParams(search);

  return {
    incident: params.get("incident") || null,
    user: params.get("user") || null,
    ip: params.get("ip") || null,
    domain: params.get("domain") || null,
    ioc: params.get("ioc") || null,
    technique: params.get("technique") || null,
    returnTo: params.get("returnTo") || null,
  };
}

export function hasIncidentContext(context) {
  return Boolean(
    context?.incident ||
    context?.ioc ||
    context?.ip ||
    context?.domain ||
    context?.technique ||
    context?.returnTo,
  );
}

export function getPrimaryIoc(context) {
  return context?.ioc || context?.domain || context?.ip || "";
}
