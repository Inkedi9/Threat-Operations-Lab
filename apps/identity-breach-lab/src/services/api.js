import {
  fetchEnvironment as mockFetchEnvironment,
  fetchScenarios as mockFetchScenarios,
  runScenario as mockRunScenario,
  resetEnvironment as mockResetEnvironment,
} from "./mockApi";

export async function fetchEnvironment() {
  return mockFetchEnvironment();
}

export async function fetchScenarios() {
  return mockFetchScenarios();
}

export async function runScenario(currentState, scenarioId) {
  return mockRunScenario(currentState, scenarioId);
}

export async function resetEnvironment() {
  return mockResetEnvironment();
}
