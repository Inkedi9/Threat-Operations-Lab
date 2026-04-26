import { enrichEvent } from "./eventFactory";

export function buildScenarioTimeline(events = []) {
  return events.map((event, index) => enrichEvent(event, index));
}

export function buildCampaignTimeline(scenarios = []) {
  let combined = [];

  scenarios.forEach((scenario) => {
    combined = [...combined, ...scenario.events];
  });

  return combined.map((event, index) => enrichEvent(event, index));
}
