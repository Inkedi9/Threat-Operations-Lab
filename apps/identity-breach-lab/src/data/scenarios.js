export const scenarioCatalog = [
  {
    id: "password-spray",
    name: "Password Spray",
    phase: "Initial Access",
    difficulty: "Low",
    description:
      "Sprays common passwords across multiple corporate identities until one valid set of credentials succeeds.",
  },
  {
    id: "credential-theft",
    name: "Credential Theft",
    phase: "Credential Abuse",
    difficulty: "Medium",
    description:
      "Compromised credentials are replayed to establish unauthorized access on a second system.",
  },
  {
    id: "privilege-escalation",
    name: "Privilege Escalation",
    phase: "Privilege Escalation",
    difficulty: "Medium",
    description:
      "An existing compromised user obtains local admin capability and extended access rights.",
  },
  {
    id: "lateral-movement",
    name: "Lateral Movement",
    phase: "Lateral Movement",
    difficulty: "High",
    description:
      "The attacker pivots from a compromised workstation to another host using harvested access context.",
  },
  {
    id: "admin-account-compromise",
    name: "Privileged Account Abuse",
    phase: "Objective Expansion",
    difficulty: "High",
    description:
      "A privileged admin identity is abused to reach critical enterprise assets.",
  },
  {
    id: "persistence",
    name: "Persistence via Rogue Account",
    phase: "Persistence",
    difficulty: "High",
    description:
      "A rogue identity is created to maintain long-term access after initial compromise.",
  },
];
