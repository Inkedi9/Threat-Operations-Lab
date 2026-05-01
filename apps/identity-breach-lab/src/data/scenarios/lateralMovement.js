export const lateralMovementScenario = {
  id: "lateral-movement",
  label: "Lateral Movement",
  phase: "Lateral Movement",
  difficulty: "High",
  focusTarget: "graph",
  description:
    "The attacker pivots from a compromised workstation to another host using harvested access context.",
  requires: ["privilege-escalation", "credential-theft"],
  mitre: {
    tactic: "Lateral Movement",
    techniqueId: "T1021",
    technique: "Remote Services",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:07",
      type: "lateral-movement",
      sourceIdentity: "j.smith",
      targetSystem: "FILE-SRV-02",
      severity: "critical",
      status: "confirmed",
      technique: "Remote Service / SMB Pivot",
      category: "lateral-movement",
      message: "Remote pivot established from WS-04 to FILE-SRV-02.",
    },
  ],
  events: [
    {
      timestamp: "10:07",
      type: "lateral-movement",
      sourceIdentity: "j.smith",
      targetSystem: "FILE-SRV-02",
      severity: "critical",
      status: "confirmed",
      technique: "Remote Service / SMB Pivot",
      category: "lateral-movement",
      message: "Remote pivot established from WS-04 to FILE-SRV-02.",
    },
  ],
  mutations: {
    users: [],
    systems: [
      {
        name: "FILE-SRV-02",
        updates: {
          status: "impacted",
        },
      },
    ],
    sessions: [
      {
        userId: "u-001",
        systemId: "srv-file-02",
        type: "remote",
        status: "active",
      },
    ],
    appendUsers: [],
    attackPathKeys: ["lateral"],
  },
};
