export const passwordSprayScenario = {
  id: "password-spray",
  label: "Password Spray",
  phase: "Initial Access",
  difficulty: "Low",
  focusTarget: "analytics",
  description:
    "Sprays common passwords across multiple corporate identities until one valid set of credentials succeeds.",
  requires: [],
  mitre: {
    tactic: "Credential Access",
    techniqueId: "T1110.003",
    technique: "Password Spraying",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:01",
      type: "auth",
      sourceIdentity: "external",
      targetSystem: "M365 / VPN",
      severity: "medium",
      status: "detected",
      technique: "Password Spray",
      techniqueId: "T1110.003",
      tactic: "Credential Access",
      category: "initial-access",
      message:
        "Multiple authentication failures detected across corporate accounts.",
    },
    {
      id: "ps-2",
      timestamp: "10:03",
      type: "auth-success",
      sourceIdentity: "j.smith",
      targetSystem: "WS-04",
      severity: "high",
      status: "compromised",
      technique: "Valid Account",
      techniqueId: "T1078",
      tactic: "Persistence",
      category: "credential-abuse",
      message:
        "Valid credentials obtained for user j.smith after repeated spray attempts.",
    },
  ],
  events: [
    {
      timestamp: "10:01",
      type: "auth",
      sourceIdentity: "external",
      targetSystem: "M365 / VPN",
      severity: "medium",
      status: "detected",
      technique: "Password Spray",
      techniqueId: "T1110.003",
      tactic: "Credential Access",
      category: "initial-access",
      message:
        "Multiple authentication failures detected across corporate accounts.",
    },
    {
      timestamp: "10:03",
      type: "auth-success",
      sourceIdentity: "j.smith",
      targetSystem: "WS-04",
      severity: "high",
      status: "compromised",
      technique: "Valid Account",
      techniqueId: "T1078",
      tactic: "Persistence",
      category: "credential-abuse",
      message:
        "Valid credentials obtained for user j.smith after repeated spray attempts.",
    },
  ],
  mutations: {
    users: [
      {
        username: "j.smith",
        updates: {
          status: "compromised",
          riskScore: 68,
        },
      },
    ],
    systems: [],
    sessions: [],
    appendUsers: [],
    attackPathKeys: ["initial-access", "credential-abuse"],
  },
};
