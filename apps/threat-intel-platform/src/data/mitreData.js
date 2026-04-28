export const mitreTechniques = {
  T1566: {
    id: "T1566",
    name: "Phishing",
    tactic: "Initial Access",
    description:
      "Adversaries send fraudulent communications to trick users into revealing credentials.",
  },
  T1078: {
    id: "T1078",
    name: "Valid Accounts",
    tactic: "Persistence / Defense Evasion",
    description: "Adversaries use stolen credentials to access systems.",
  },
  T1110: {
    id: "T1110",
    name: "Brute Force",
    tactic: "Credential Access",
    description: "Repeated attempts to guess passwords or keys.",
  },
  T1071: {
    id: "T1071",
    name: "Application Layer Protocol",
    tactic: "Command and Control",
    description: "C2 over HTTP/DNS/etc.",
  },
  T1568: {
    id: "T1568",
    name: "Dynamic Resolution",
    tactic: "Command and Control",
    description: "Use of fast-flux / dynamic DNS.",
  },
  T1204: {
    id: "T1204",
    name: "User Execution",
    tactic: "Execution",
    description: "User executes malicious file or link.",
  },
};
