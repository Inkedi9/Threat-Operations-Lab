export const privilegeEscalationScenario = {
  id: "privilege-escalation",
  label: "Privilege Escalation",
  phase: "Privilege Escalation",
  difficulty: "Medium",
  focusTarget: "graph",
  description:
    "An existing compromised user obtains local admin capability and extended access rights.",
  requires: ["password-spray", "credential-theft"],
  mitre: {
    tactic: "Privilege Escalation",
    techniqueId: "T1068",
    technique: "Exploitation for Privilege Escalation",
  },
  steps: [
    {
      id: "ps-1",
      timestamp: "10:06",
      type: "privilege-escalation",
      sourceIdentity: "j.smith",
      targetSystem: "WS-04",
      severity: "critical",
      status: "confirmed",
      technique: "Privilege Escalation",
      category: "privilege-escalation",
      message: "Compromised user j.smith gained local admin rights on WS-04.",
    },
  ],
  events: [
    {
      timestamp: "10:06",
      type: "privilege-escalation",
      sourceIdentity: "j.smith",
      targetSystem: "WS-04",
      severity: "critical",
      status: "confirmed",
      technique: "Privilege Escalation",
      category: "privilege-escalation",
      message: "Compromised user j.smith gained local admin rights on WS-04.",
    },
  ],
  mutations: {
    users: [
      {
        username: "j.smith",
        updates: {
          status: "compromised",
          privilege: "elevated",
          groups: ["grp-hr-users", "grp-local-admins"],
          riskScore: 88,
        },
      },
    ],
    systems: [
      {
        name: "WS-04",
        updates: {
          status: "impacted",
        },
      },
    ],
    sessions: [],
    appendUsers: [],
    attackPathKeys: ["priv-esc"],
  },
};
