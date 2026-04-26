import {
  buildScenarioTimeline,
  buildCampaignTimeline,
} from "./timelineBuilder";
import { computeMetrics } from "./scoreEngine";

export function createSimulationEngine({
  getState,
  appendEvent,
  setStatus,
  resetRuntime,
  syncSession,
}) {
  let interval = null;
  let paused = false;
  let index = 0;
  let timeline = [];

  function startSingleScenario(scenario) {
    stop();

    resetRuntime();
    setStatus("running");

    timeline = buildScenarioTimeline(scenario.events);
    index = 0;
    paused = false;

    runLoop(scenario.status);
  }

  function startCampaign(scenarios) {
    stop();

    resetRuntime();
    setStatus("running");

    timeline = buildCampaignTimeline(scenarios);
    index = 0;
    paused = false;

    runLoop("Detected"); // simplifié pour V1
  }

  function runLoop(finalStatus) {
    interval = setInterval(() => {
      if (paused) return;

      if (index >= timeline.length) {
        stop();

        const metrics = computeMetrics(timeline, finalStatus);

        syncSession({
          timeline,
          logs: timeline.filter((e) => e.type === "log"),
          alerts: timeline.filter((e) => e.type === "alert"),
          metrics,
        });

        setStatus("completed");
        return;
      }

      appendEvent(timeline[index]);
      index++;
    }, 800);
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    stop();
    index = 0;
    timeline = [];
  }

  return {
    startSingleScenario,
    startCampaign,
    pause,
    resume,
    stop,
    reset,
  };
}
