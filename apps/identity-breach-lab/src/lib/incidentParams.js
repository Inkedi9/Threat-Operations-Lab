export function getIncidentParams() {
  const params = new URLSearchParams(window.location.search);
  const incidentId = params.get("incidentId") || params.get("incident");

  return {
    incidentId,
    incident: params.get("incident"),
    user: params.get("user"),
    ip: params.get("ip"),
    domain: params.get("domain"),
    ioc: params.get("ioc"),
    technique: params.get("technique"),
    returnTo: params.get("returnTo"),
  };
}

export function hasIncidentContext(params) {
  return Boolean(
    params?.incidentId ||
    params?.incident ||
    params?.user ||
    params?.ip ||
    params?.domain ||
    params?.ioc ||
    params?.technique ||
    params?.returnTo,
  );
}

export function getMockIncidentProfile(params) {
  if ((params?.incidentId || params?.incident) !== "incident-001") return null;

  return {
    id: "incident-001",
    user: params.user || "j.smith",
    email: "j.smith@acme-corp.local",
    role: "Finance Analyst",
    suspiciousIp: params.ip || "185.77.44.21",
    status: "Partially Detected",
    attackPath: [
      "Phishing",
      "Credential Use",
      "Suspicious Login",
      "Privilege Check",
      "Lateral Access Attempt",
    ],
    mitre: [
      {
        techniqueId: "T1078",
        tactic: "Persistence",
        technique: "Valid Accounts",
      },
      {
        techniqueId: "T1110",
        tactic: "Credential Access",
        technique: "Brute Force",
      },
    ],
    recommendation:
      "Enforce MFA, review impossible travel signals and restrict privileged access paths.",
  };
}
