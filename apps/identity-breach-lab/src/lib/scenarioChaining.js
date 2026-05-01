export function getScenarioStatus(scenario, launchedScenarios = []) {
  const completed = launchedScenarios.includes(scenario.id);
  const requirements = scenario.requires || [];

  const available = requirements.every((requirement) =>
    launchedScenarios.includes(requirement),
  );

  if (completed) return "completed";
  if (available) return "available";
  return "locked";
}

export function getScenarioRequirementsLabel(
  scenarioDefinitions = [],
  scenario,
) {
  const requirements = scenario.requires || [];

  if (!requirements.length) return "No prerequisites";

  const idToLabel = Object.fromEntries(
    scenarioDefinitions.map((entry) => [entry.id, entry.label]),
  );

  return requirements
    .map((requirementId) => idToLabel[requirementId] || requirementId)
    .join(" • ");
}

export function isScenarioRunnable(scenario, launchedScenarios = []) {
  return getScenarioStatus(scenario, launchedScenarios) === "available";
}
