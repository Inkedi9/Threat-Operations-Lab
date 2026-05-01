export const persistenceScenario = {
  id: "persistence",
  label: "Persistence via Rogue Account",
  phase: "Persistence",
  difficulty: "High",
  focusTarget: "entities",
  description:
    "A rogue identity is created to maintain long-term access after initial compromise.",
  requires: ["lateral-movement", "admin-account-compromise"],
  mitre: {
    tactic: "Persistence",
    techniqueId: "T1136",
    technique: "Create Account",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:12",
      type: "persistence",
      sourceIdentity: "ops.sync",
      targetSystem: "FILE-SRV-02",
      severity: "critical",
      status: "confirmed",
      technique: "Create Account",
      category: "persistence",
      message:
        "Rogue persistence account created to preserve unauthorized access.",
    },
  ],
  events: [
    {
      timestamp: "10:12",
      type: "persistence",
      sourceIdentity: "ops.sync",
      targetSystem: "FILE-SRV-02",
      severity: "critical",
      status: "confirmed",
      technique: "Create Account",
      category: "persistence",
      message:
        "Rogue persistence account created to preserve unauthorized access.",
    },
  ],
  mutations: {
    users: [],
    systems: [],
    sessions: [],
    appendUsers: [
      {
        id: "u-rogue-01",
        name: "Temp Ops Sync",
        username: "ops.sync",
        role: "Shadow Account",
        privilege: "elevated",
        status: "compromised",
        department: "Unknown",
        machineId: "srv-file-02",
        groups: ["grp-service-accounts"],
        riskScore: 91,
      },
    ],
    attackPathKeys: ["persistence"],
  },
};
