/* ========================================
   🧪 Scenario Helpers
======================================== */

export function getScenarioAdjustedState(scenario, controls) {
  let adjustedCoverage = scenario.coverage;
  let statusRank =
    scenario.status === "Missed"
      ? 0
      : scenario.status === "Partially Detected"
        ? 1
        : 2;

  const gainedDetections = [];
  const reducedGaps = [];

  const improveStatus = () => {
    statusRank = Math.min(statusRank + 1, 2);
  };

  if (scenario.id === "bruteforce") {
    if (controls.mfa) {
      adjustedCoverage += 12;
      gainedDetections.push("MFA challenge failure telemetry");
      reducedGaps.push("MFA enforcement added to exposed authentication flow");
      improveStatus();
    }
    if (controls.siem) {
      adjustedCoverage += 10;
      gainedDetections.push("Authentication anomaly correlation");
      reducedGaps.push("Improved cross-event login correlation");
      improveStatus();
    }
  }

  if (scenario.id === "scan") {
    if (controls.ids) {
      adjustedCoverage += 16;
      gainedDetections.push("Horizontal scan IDS signature");
      reducedGaps.push("Improved network reconnaissance visibility");
      improveStatus();
    }
    if (controls.siem) {
      adjustedCoverage += 10;
      gainedDetections.push("Multi-host scan correlation rule");
      reducedGaps.push("Correlated scan activity across internal assets");
      improveStatus();
    }
  }

  if (scenario.id === "mimikatz") {
    if (controls.edr) {
      adjustedCoverage += 30;
      gainedDetections.push("Credential dumping behavioral detection");
      reducedGaps.push("EDR tuned for suspicious LSASS access");
      improveStatus();
      improveStatus();
    }
    if (controls.siem) {
      adjustedCoverage += 10;
      gainedDetections.push("Endpoint post-exploitation correlation");
      reducedGaps.push(
        "Security telemetry enrichment for suspicious process chains",
      );
      improveStatus();
    }
  }

  if (scenario.id === "exfiltration") {
    if (controls.dlp) {
      adjustedCoverage += 24;
      gainedDetections.push("Sensitive outbound transfer detection");
      reducedGaps.push("DLP added for suspicious archive exfiltration");
      improveStatus();
    }
    if (controls.siem) {
      adjustedCoverage += 10;
      gainedDetections.push("Archive + outbound correlation rule");
      reducedGaps.push(
        "Improved detection chaining across endpoint and network",
      );
      improveStatus();
    }
  }

  if (controls.ids && scenario.id === "exfiltration") {
    adjustedCoverage += 4;
    gainedDetections.push("Anomalous outbound network visibility");
  }

  adjustedCoverage = Math.min(adjustedCoverage, 100);

  const adjustedStatus =
    statusRank === 2
      ? "Detected"
      : statusRank === 1
        ? "Partially Detected"
        : "Missed";

  const mergedDetections = [...scenario.detections, ...gainedDetections];
  const mergedGaps = scenario.gaps.filter(
    (gap) =>
      !reducedGaps.some((fix) => gap.toLowerCase().includes(fix.toLowerCase())),
  );

  return {
    adjustedCoverage,
    adjustedStatus,
    detections: mergedDetections,
    improvements: reducedGaps,
    remainingGaps: mergedGaps,
  };
}

export function buildCampaignEvents(campaignScenarios) {
  const campaignEvents = [];

  campaignScenarios.forEach((scenario, scenarioIndex) => {
    campaignEvents.push({
      time: `Stage ${scenarioIndex + 1}`,
      type: "campaign",
      title: "Campaign stage started",
      message: `${scenario.name} simulation initialized`,
      scenarioName: scenario.name,
    });

    scenario.events.forEach((event) => {
      campaignEvents.push({
        ...event,
        scenarioName: scenario.name,
      });
    });
  });

  return campaignEvents;
}

export function computeCampaignStatus(statuses) {
  const detected = statuses.filter((s) => s === "Detected").length;
  const partial = statuses.filter((s) => s === "Partially Detected").length;
  const missed = statuses.filter((s) => s === "Missed").length;

  if (detected === statuses.length) return "Detected";
  if (missed === statuses.length) return "Missed";
  if (detected > 0 || partial > 0) return "Partially Detected";
  return "Missed";
}
