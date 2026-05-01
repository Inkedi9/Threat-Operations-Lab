export const credentialTheftScenario = {
  id: "credential-theft",
  label: "Credential Theft",
  phase: "Credential Abuse",
  difficulty: "Medium",
  focusTarget: "analytics",
  description:
    "Compromised credentials are replayed to establish unauthorized access on a second system.",
  requires: [],
  mitre: {
    tactic: "Credential Access",
    techniqueId: "T1003",
    technique: "OS Credential Dumping",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:04",
      type: "credential-theft",
      sourceIdentity: "m.dubois",
      targetSystem: "WS-07",
      severity: "high",
      status: "detected",
      technique: "Credential Dumping",
      category: "credential-abuse",
      message: "Reusable credentials harvested from compromised user context.",
    },
    {
      timestamp: "10:05",
      type: "reuse",
      sourceIdentity: "m.dubois",
      targetSystem: "FILE-SRV-02",
      severity: "high",
      status: "observed",
      technique: "Credential Reuse",
      category: "execution",
      message:
        "Stolen credentials replayed against shared enterprise resource.",
    },
  ],

  events: [
    {
      timestamp: "10:04",
      type: "credential-theft",
      sourceIdentity: "m.dubois",
      targetSystem: "WS-07",
      severity: "high",
      status: "detected",
      technique: "Credential Dumping",
      category: "credential-abuse",
      message: "Reusable credentials harvested from compromised user context.",
    },
    {
      timestamp: "10:05",
      type: "reuse",
      sourceIdentity: "m.dubois",
      targetSystem: "FILE-SRV-02",
      severity: "high",
      status: "observed",
      technique: "Credential Reuse",
      category: "execution",
      message:
        "Stolen credentials replayed against shared enterprise resource.",
    },
  ],
  mutations: {
    users: [
      {
        username: "m.dubois",
        updates: {
          status: "compromised",
          riskScore: 74,
        },
      },
    ],
    systems: [
      {
        name: "WS-07",
        updates: {
          status: "impacted",
        },
      },
    ],
    sessions: [
      {
        userId: "u-002",
        systemId: "ws-07",
        type: "interactive",
        status: "active",
      },
    ],
    appendUsers: [],
    attackPathKeys: ["credential-abuse"],
  },
};
