/* ========================================
   🧩 Shared Mock Incidents
======================================== */

export const ecosystemIncidents = [
  {
    id: "incident-001",
    title: "Phishing-Led Identity Compromise",
    status: "partially_detected",
    severity: "hight",
    context: {
      incidentId: "incident-001",
      user: "j.smith",
      ip: "185.77.44.21",
      domain: "secure-login-support.com",
      technique: "T1566",
    },
    summary:
      "A phishing campaign leads to credential theft, suspicious login activity, SOC detection, OSINT enrichment and threat intelligence correlation.",
    flow: [
      "Phishing",
      "Identity Compromise",
      "SOC Detection",
      "OSINT Enrichment",
      "Threat Intelligence",
      "Report",
    ],
    victim: {
      user: "j.smith",
      email: "j.smith@acme-corp.local",
      role: "Finance Analyst",
      department: "Finance",
    },
    attacker: {
      ip: "185.77.44.21",
      domain: "secure-login-support.com",
      email: "security-alert@secure-login-support.com",
      url: "https://secure-login-support.com/login",
    },
    iocs: [
      { type: "ip", value: "185.77.44.21" },
      { type: "domain", value: "secure-login-support.com" },
      { type: "email", value: "security-alert@secure-login-support.com" },
      { type: "url", value: "https://secure-login-support.com/login" },
    ],
    mitre: [
      {
        id: "T1566",
        name: "Phishing",
        tactic: "Initial Access",
      },
      {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Defense Evasion / Persistence",
      },
      {
        id: "T1110",
        name: "Brute Force",
        tactic: "Credential Access",
      },
      {
        id: "T1021",
        name: "Remote Services",
        tactic: "Lateral Movement",
      },
    ],
    timeline: [
      {
        time: "09:12:04",
        stage: "phishing",
        app: "phishingScope",
        type: "email",
        title: "Phishing email delivered",
        message: "User received a fake Microsoft-style security alert.",
      },
      {
        time: "09:17:22",
        stage: "identity",
        app: "identityAccessSimulator",
        type: "auth",
        title: "Credential used from suspicious IP",
        message: "Successful login for j.smith from 185.77.44.21.",
      },
      {
        time: "09:24:10",
        stage: "soc",
        app: "socSimulator",
        type: "alert",
        title: "Impossible travel alert",
        message: "SOC detected suspicious authentication behavior.",
      },
      {
        time: "09:31:44",
        stage: "osint",
        app: "osintInvestigator",
        type: "enrichment",
        title: "Infrastructure enrichment",
        message: "IP and domain correlated with suspicious hosting indicators.",
      },
      {
        time: "09:38:18",
        stage: "threat-intel",
        app: "threatIntelligence",
        type: "ioc",
        title: "IoC correlation",
        message: "Domain associated with a phishing infrastructure cluster.",
      },
    ],
  },
];

export const defaultEcosystemIncident = ecosystemIncidents[0];

export function getEcosystemIncidentById(incidentId) {
  return (
    ecosystemIncidents.find((incident) => incident.id === incidentId) ??
    defaultEcosystemIncident
  );
}
