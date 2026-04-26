export function buildIncidentReport({
  incident,
  riskScore,
  actions,
  checklist,
  timeline,
}) {
  const completedActions = actions.filter(
    (action) => action.status === "completed",
  );

  const pendingActions = actions.filter(
    (action) => action.status !== "completed",
  );

  const completedChecklist = checklist.filter((item) => item.completed);

  const remediationProgress = Math.round(
    (completedChecklist.length / checklist.length) * 100,
  );

  const reduction = incident.initialRisk - riskScore;
  const reductionPercent = Math.round((reduction / incident.initialRisk) * 100);

  return `
INCIDENT RESPONSE & REMEDIATION REPORT
======================================

Report ID:
IR-${incident.id.toUpperCase()}

Incident:
${incident.name}

Severity:
${incident.severity.toUpperCase()}

Status:
${incident.status.toUpperCase()}

Initial Risk:
${incident.initialRisk}/100

Current Risk:
${riskScore}/100

Risk Reduction:
${reductionPercent}%

Remediation Progress:
${remediationProgress}%

------------------------------------------------------------
1. EXECUTIVE SUMMARY
------------------------------------------------------------

${incident.businessImpact}

The incident followed the attack path:
${incident.attackPath.join(" → ")}

Response activities focused on containment, identity control, IoC blocking,
asset recovery and remediation validation.

------------------------------------------------------------
2. INCIDENT DETAILS
------------------------------------------------------------

Entry Point:
${incident.entryPoint}

Current Phase:
${incident.currentPhase}

MITRE ATT&CK Techniques:
${incident.mitre.join(", ")}

Compromised Users:
${incident.compromisedUsers.join(", ")}

Impacted Assets:
${incident.impactedAssets.join(", ")}

------------------------------------------------------------
3. INDICATORS OF COMPROMISE
------------------------------------------------------------

Domains:
${incident.iocs.domains.map((ioc) => `- ${ioc}`).join("\n")}

IPs:
${incident.iocs.ips.map((ioc) => `- ${ioc}`).join("\n")}

Hashes:
${incident.iocs.hashes.map((ioc) => `- ${ioc}`).join("\n")}

------------------------------------------------------------
4. CONTAINMENT ACTIONS
------------------------------------------------------------

Completed:
${
  completedActions.length
    ? completedActions
        .map((a) => `- ${a.label} | Target: ${a.target} | ${a.result}`)
        .join("\n")
    : "- No containment actions completed yet."
}

Pending:
${
  pendingActions.length
    ? pendingActions.map((a) => `- ${a.label} | Target: ${a.target}`).join("\n")
    : "- No pending containment actions."
}

------------------------------------------------------------
5. REMEDIATION CHECKLIST
------------------------------------------------------------

${checklist.map((item) => `- [${item.completed ? "x" : " "}] ${item.label}`).join("\n")}

------------------------------------------------------------
6. RESPONSE TIMELINE
------------------------------------------------------------

${timeline
  .map(
    (event) =>
      `- ${event.time} | ${event.phase} | ${event.title} | ${event.description}`,
  )
  .join("\n")}

------------------------------------------------------------
7. RISK REDUCTION SUMMARY
------------------------------------------------------------

Risk Before:
${incident.initialRisk}/100

Risk After:
${riskScore}/100

Reduction:
${reductionPercent}%

Completed Containment Actions:
${completedActions.length}/${actions.length}

Completed Remediation Tasks:
${completedChecklist.length}/${checklist.length}

------------------------------------------------------------
8. RECOMMENDATIONS
------------------------------------------------------------

- Validate that all compromised identities have completed password reset.
- Enforce MFA for affected users and privileged accounts.
- Confirm malicious IoCs are blocked across firewall, proxy and EDR controls.
- Review privileged groups and remove unnecessary access.
- Audit lateral movement traces across impacted systems.
- Rotate service account credentials.
- Update detection rules based on observed behavior.
- Conduct a lessons learned review and document response gaps.

------------------------------------------------------------
END OF REPORT
------------------------------------------------------------
`;
}

export function downloadIncidentReport(filename, report) {
  const blob = new Blob([report], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
