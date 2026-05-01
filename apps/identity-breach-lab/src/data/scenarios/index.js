import { passwordSprayScenario } from "./passwordSpray";
import { credentialTheftScenario } from "./credentialTheft";
import { privilegeEscalationScenario } from "./privilegeEscalation";
import { lateralMovementScenario } from "./lateralMovement";
import { adminAccountCompromiseScenario } from "./adminAccountCompromise";
import { persistenceScenario } from "./persistence";

export const scenarioDefinitions = [
  passwordSprayScenario,
  credentialTheftScenario,
  privilegeEscalationScenario,
  lateralMovementScenario,
  adminAccountCompromiseScenario,
  persistenceScenario,
];

export const scenarioDefinitionMap = Object.fromEntries(
  scenarioDefinitions.map((scenario) => [scenario.id, scenario]),
);
