import {
  initialUsers,
  initialSystems,
  initialGroups,
  initialSessions,
  initialEvents,
  initialAttackPath,
} from "../data/environment";
import { scenarioDefinitionMap } from "../data/scenarios/index.js";
import { computeMetrics } from "./metrics";
import { clone } from "./utils";
import { applyScenarioDefinition } from "./scenarioEngine";
import { isScenarioRunnable } from "./scenarioChaining";
import { computeRiskScore } from "./riskEngine";

function buildRiskEntry(state, label = "Baseline") {
  return {
    label,
    risk: computeRiskScore(state),
    compromised: state.users.filter((user) =>
      ["compromised", "privileged-compromised"].includes(user.status),
    ).length,
    critical: state.systems.filter(
      (system) =>
        system.criticality === "critical" && system.status === "impacted",
    ).length,
  };
}

function createReplayState() {
  return {
    scenarioId: null,
    scenarioLabel: null,
    steps: [],
    currentStepIndex: -1,
    isPlaying: false,
    isActive: false,
    speed: 1,
  };
}

export function createInitialState() {
  const base = {
    users: clone(initialUsers),
    systems: clone(initialSystems),
    groups: clone(initialGroups),
    sessions: clone(initialSessions),
    events: clone(initialEvents),
    timeline: clone(initialEvents),
    attackPath: clone(initialAttackPath),
    launchedScenarios: [],
    replay: createReplayState(),
  };

  const withMetrics = {
    ...base,
    metrics: computeMetrics(base),
  };

  return {
    ...withMetrics,
    riskHistory: [buildRiskEntry(withMetrics, "Baseline")],
  };
}

export function applyScenario(state, scenarioId) {
  if (state.launchedScenarios.includes(scenarioId)) {
    return state;
  }

  const scenario = scenarioDefinitionMap[scenarioId];

  if (!scenario) {
    return state;
  }

  if (!isScenarioRunnable(scenario, state.launchedScenarios)) {
    return state;
  }

  const nextState = applyScenarioDefinition(state, scenario);

  nextState.launchedScenarios = [...nextState.launchedScenarios, scenarioId];
  nextState.metrics = computeMetrics(nextState);
  nextState.replay = {
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    steps: clone(scenario.steps || []),
    currentStepIndex: scenario.steps?.length ? 0 : -1,
    isPlaying: false,
    isActive: true,
    speed: 1,
  };
  nextState.riskHistory = [
    ...(nextState.riskHistory || []),
    buildRiskEntry(nextState, scenario.label),
  ];

  return nextState;
}
