export const adminAccountCompromiseScenario = {
  id: "admin-account-compromise",
  label: "Privileged Account Abuse",
  phase: "Objective Expansion",
  difficulty: "High",
  focusTarget: "graph",
  description:
    "A privileged admin identity is abused to reach critical enterprise assets.",
  requires: ["lateral-movement"],
  mitre: {
    tactic: "Persistence",
    techniqueId: "T1078",
    technique: "Valid Accounts",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:10",
      type: "privileged-abuse",
      sourceIdentity: "admin01",
      targetSystem: "DC-01",
      severity: "critical",
      status: "confirmed",
      technique: "Privileged Account Abuse",
      category: "impact",
      message:
        "Compromised privileged account accessed domain-critical infrastructure.",
    },
  ],
  events: [
    {
      timestamp: "10:10",
      type: "privileged-abuse",
      sourceIdentity: "admin01",
      targetSystem: "DC-01",
      severity: "critical",
      status: "confirmed",
      technique: "Privileged Account Abuse",
      category: "impact",
      message:
        "Compromised privileged account accessed domain-critical infrastructure.",
    },
  ],
  mutations: {
    users: [
      {
        username: "admin01",
        updates: {
          status: "privileged-compromised",
          riskScore: 97,
        },
      },
    ],
    systems: [
      {
        name: "DC-01",
        updates: {
          status: "impacted",
        },
      },
    ],
    sessions: [],
    appendUsers: [],
    attackPathKeys: ["objective"],
  },
};
