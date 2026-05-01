import { createInitialState, applyScenario } from "../lib/simulator";
import { scenarioDefinitions } from "../data/scenarios/index.js";

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEnvironment() {
  await delay(350);

  return {
    data: createInitialState(),
  };
}

export async function fetchScenarios() {
  await delay(250);

  return {
    data: scenarioDefinitions,
  };
}

export async function runScenario(currentState, scenarioId) {
  await delay(550);

  return {
    data: applyScenario(currentState, scenarioId),
  };
}

export async function resetEnvironment() {
  await delay(300);

  return {
    data: createInitialState(),
  };
}
