/* React */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* Data */
import { scenarios } from "./data/scenarios";

/* Store */
import { useSimulationStore } from "./app/store/simulationStore";

/* Engine */
import { createSimulationEngine } from "./core/engine/simulationEngine";

/* Pages */
import OverviewView from "./pages/OverviewView";
import RedView from "./pages/RedView";
import PurpleView from "./pages/PurpleView";
import BlueView from "./pages/BlueView";
import OutputView from "./pages/OutputView";
import OperatorConsole from "./pages/OperatorConsole";
import RulesLabView from "./pages/RulesLabView";
import AnalyticsLabView from "./pages/AnalyticsLabView";

/* Components */
import AppFooter from "./components/layout/AppFooter";
import FloatingTopbar from "./components/layout/FloatingTopbar";
import KeyboardShortcutsOverlay from "./components/layout/KeyboardShortcutsOverlay";

/* Lib */
import {
  getScenarioAdjustedState,
  buildCampaignEvents,
  computeCampaignStatus,
} from "./lib/scenarioHelpers";
import { coverageTone, eventAccent, eventIcon } from "./lib/uiHelpers";

/* Hooks */
import useImmersiveMode from "./hooks/useImmersiveMode";

/* ========================================
   🧠 Global labels
======================================== */

const controlLabels = {
  mfa: "MFA",
  edr: "EDR",
  ids: "IDS",
  siem: "SIEM Correlation",
  dlp: "DLP",
};

function statusClasses(status) {
  switch (status) {
    case "Detected":
      return "border-cyber-green/30 bg-cyber-green/10 text-cyber-green";
    case "Partially Detected":
      return "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber";
    case "Missed":
      return "border-cyber-red/30 bg-cyber-red/10 text-cyber-red";
    case "In Progress":
      return "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";
    default:
      return "border-cyber-border bg-cyber-panel2 text-cyber-text";
  }
}

function severityClasses(severity) {
  switch (severity) {
    case "High":
      return "border-cyber-red/30 bg-cyber-red/10 text-cyber-red";
    case "Medium":
      return "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber";
    default:
      return "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";
  }
}

/* ========================================
   🚀 App Shell
======================================== */

function App() {
  /* ----------------------------------------
     🧭 App-level UI state
  ---------------------------------------- */
  const [isRunning, setIsRunning] = useState(false);
  const [simulationFinished, setSimulationFinished] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [rulesLabFocus, setRulesLabFocus] = useState(null);

  const {
    isImmersive: warRoomFullscreen,
    exitImmersive: exitWarRoomFullscreen,
    toggleImmersive: toggleWarRoomFullscreen,
  } = useImmersiveMode(false);

  /* ----------------------------------------
     🧠 Store
  ---------------------------------------- */
  const {
    sessions,
    activeSessionId,
    setActiveSession,
    createSession,
    mode,
    selectedScenarioId,
    campaignScenarioIds,
    displayedEvents,
    setMode,
    setSelectedScenarioId,
    toggleCampaignScenarioId,
    setControls,
    resetControls,
    appendDisplayedEvent,
    updateActiveSessionStatus,
    resetActiveSessionRuntime,
    syncActiveSessionData,
    updateAlertTriageStatus,
    getActiveSession,
    isReplayMode,
    replayEvents,
    setReplayMode,
    setReplayEvents,
    appendReplayEvent,
    resetReplay,
    replayIndex,
    replaySpeed,
    isReplayPaused,
    setReplayIndex,
    setReplaySpeed,
    setReplayPaused,
  } = useSimulationStore();

  const activeSession = getActiveSession();

  /* ----------------------------------------
     📡 Derived session data
  ---------------------------------------- */
  const activeAlerts = activeSession?.alerts ?? [];
  const metrics = activeSession?.metrics;
  const coverage = activeSession?.metrics?.coverage ?? 0;

  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0];

  const controls = activeSession?.controls ?? {
    mfa: false,
    edr: false,
    ids: false,
    siem: false,
    dlp: false,
  };

  const selectedCampaignScenarios = scenarios.filter((scenario) =>
    campaignScenarioIds.includes(scenario.id)
  );

  const adjustedState = useMemo(
    () => getScenarioAdjustedState(selectedScenario, controls),
    [selectedScenario, controls]
  );

  const campaignAdjustedStates = useMemo(() => {
    return selectedCampaignScenarios.map((scenario) => ({
      scenario,
      adjusted: getScenarioAdjustedState(scenario, controls),
    }));
  }, [selectedCampaignScenarios, controls]);

  const campaignEvents = useMemo(() => {
    return buildCampaignEvents(selectedCampaignScenarios);
  }, [selectedCampaignScenarios]);

  const campaignCoverage = useMemo(() => {
    if (campaignAdjustedStates.length === 0) return 0;

    const total = campaignAdjustedStates.reduce(
      (sum, item) => sum + item.adjusted.adjustedCoverage,
      0
    );

    return Math.round(total / campaignAdjustedStates.length);
  }, [campaignAdjustedStates]);

  const campaignStatus = useMemo(() => {
    if (campaignAdjustedStates.length === 0) return "Missed";

    return computeCampaignStatus(
      campaignAdjustedStates.map((item) => item.adjusted.adjustedStatus)
    );
  }, [campaignAdjustedStates]);

  /* ----------------------------------------
     ⚙️ Engine
  ---------------------------------------- */
  const engineRef = useRef(null);
  /* ----------------------------------------
   ⏪ Replay engine ref
---------------------------------------- */
  const replayIntervalRef = useRef(null);

  useEffect(() => {
    engineRef.current = createSimulationEngine({
      getState: useSimulationStore.getState,
      appendEvent: appendDisplayedEvent,
      setStatus: updateActiveSessionStatus,
      resetRuntime: resetActiveSessionRuntime,
      syncSession: syncActiveSessionData,
    });
  }, [appendDisplayedEvent, updateActiveSessionStatus, resetActiveSessionRuntime, syncActiveSessionData]);

  /* ----------------------------------------
     🕹️ Runtime actions
  ---------------------------------------- */
  const resetSimulation = useCallback(() => {
    engineRef.current?.reset();
    resetActiveSessionRuntime();

    setIsRunning(false);
    setSimulationFinished(false);
    setReportGenerated(false);
    setCopied(false);
    setSelectedAlert(null);
  }, [resetActiveSessionRuntime]);

  const toggleControl = useCallback((key) => {
    setControls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setReportGenerated(false);
    setCopied(false);
  }, [setControls]);

  const handleResetControls = useCallback(() => {
    resetControls();
    setReportGenerated(false);
    setCopied(false);
  }, [resetControls]);

  /* ----------------------------------------
     ⏪ Replay handlers
  ---------------------------------------- */
  const startReplay = () => {
    const sessionTimeline = activeSession?.timeline ?? [];
    if (!sessionTimeline.length) return;

    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }

    resetReplay();
    setReplayMode(true);
    setReplayPaused(false);
    setReplayIndex(0);
    setReplayEvents([]);
  };

  const stopReplay = () => {
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }

    resetReplay();
  };

  const pauseReplay = () => {
    setReplayPaused(true);
  };

  const resumeReplay = () => {
    setReplayPaused(false);
  };

  const scrubReplay = (targetIndex) => {
    const sessionTimeline = activeSession?.timeline ?? [];
    if (!sessionTimeline.length) return;

    const boundedIndex = Math.max(0, Math.min(targetIndex, sessionTimeline.length));
    setReplayMode(true);
    setReplayIndex(boundedIndex);
    setReplayEvents(sessionTimeline.slice(0, boundedIndex));
  };

  const runSingleScenario = useCallback(() => {
    setIsRunning(true);
    setSimulationFinished(false);
    setReportGenerated(false);
    setCopied(false);

    engineRef.current?.startSingleScenario(selectedScenario);
  }, [selectedScenario]);

  const runCampaign = useCallback(() => {
    setIsRunning(true);
    setSimulationFinished(false);
    setReportGenerated(false);
    setCopied(false);

    engineRef.current?.startCampaign(selectedCampaignScenarios);
  }, [selectedCampaignScenarios]);

  const runSimulation = useCallback(() => {
    if (mode === "campaign") {
      runCampaign();
    } else {
      runSingleScenario();
    }
  }, [mode, runCampaign, runSingleScenario]);

  const handleRun = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  /* ----------------------------------------
     🔁 Effects
  ---------------------------------------- */
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId, mode, campaignScenarioIds.join("|")]);

  useEffect(() => {
    setReportGenerated(false);
    setCopied(false);
  }, [controls]);

  useEffect(() => {
    setSelectedAlert(null);
  }, [mode, selectedScenarioId, campaignScenarioIds.join("|")]);

  useEffect(() => {
    const handleKeydown = (event) => {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();

      const isTyping =
        tagName === "input" ||
        tagName === "textarea" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        setShowShortcuts(false);

        if (warRoomFullscreen) {
          exitWarRoomFullscreen();
        }
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      if (event.shiftKey && event.code === "Slash") {
        event.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      if (isTyping) return;

      switch (event.code) {
        case "Digit1":
          setActiveView("overview");
          break;
        case "Digit2":
          setActiveView("red");
          break;
        case "Digit3":
          setActiveView("purple");
          break;
        case "Digit4":
          setActiveView("blue");
          break;
        case "Digit5":
          setActiveView("rules");
          break;
        case "Digit6":
          setActiveView("warroom");
          break;
        case "Digit7":
          setActiveView("analytics");
          break;
        case "Digit8":
          setActiveView("output");
          break;
        case "KeyR":
          handleRun();
          break;
        case "KeyW":
          setActiveView("warroom");
          break;
        case "KeyF":
          if (activeView === "warroom") {
            toggleWarRoomFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeView, warRoomFullscreen, handleRun]);

  useEffect(() => {
    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeline = displayedEvents;
    const logs = displayedEvents.filter((event) => event.type === "log");
    const alerts = displayedEvents
      .filter((event) => event.type === "alert")
      .map((alert, index) => ({
        ...alert,
        triageStatus: alert.triageStatus ?? "open",
        title: alert.title ?? `Detection Alert ${index + 1}`,
      }));

    syncActiveSessionData({
      timeline,
      logs,
      alerts,
      metrics: {
        coverage: visibleCoverage,
        detectedCount: visibleStatus === "Detected" ? 1 : 0,
        partialCount: visibleStatus === "Partially Detected" ? 1 : 0,
        missedCount: visibleStatus === "Missed" ? 1 : 0,
        totalAlerts: alerts.length,
        totalLogs: logs.length,
        mttd: alerts.length > 0 ? 42 : null,
        mttr: visibleStatus === "Detected" ? 180 : null,
        momentum:
          visibleStatus === "Detected"
            ? 90
            : visibleStatus === "Partially Detected"
              ? 58
              : 24,
      },
    });
  }, [displayedEvents, syncActiveSessionData]);

  /* ----------------------------------------
   ⏪ Replay playback loop
---------------------------------------- */
  useEffect(() => {
    const sessionTimeline = activeSession?.timeline ?? [];

    if (!isReplayMode || isReplayPaused || !sessionTimeline.length) {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
      return;
    }

    if (replayIndex >= sessionTimeline.length) {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = replaySpeed === 2 ? 350 : 700;

    replayIntervalRef.current = setInterval(() => {
      const currentTimeline = useSimulationStore.getState().getActiveSession()?.timeline ?? [];
      const currentIndex = useSimulationStore.getState().replayIndex;
      const currentPaused = useSimulationStore.getState().isReplayPaused;

      if (currentPaused) return;

      if (currentIndex >= currentTimeline.length) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
        return;
      }

      appendReplayEvent(currentTimeline[currentIndex]);
      setReplayIndex(currentIndex + 1);
    }, intervalMs);

    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
    };
  }, [
    activeSession,
    isReplayMode,
    isReplayPaused,
    replayIndex,
    replaySpeed,
    appendReplayEvent,
    setReplayIndex,
  ]);

  /* ----------------------------------------
   👀 Effective events source
---------------------------------------- */
  const effectiveDisplayedEvents = isReplayMode ? replayEvents : displayedEvents;

  /* ----------------------------------------
     📊 Display metrics
  ---------------------------------------- */
  const alertCount = useMemo(() => {
    const baseAlerts = displayedEvents.filter((event) => event.type === "alert").length;

    if (!simulationFinished) return baseAlerts;

    if (mode === "campaign") {
      const campaignDetectedCount = campaignAdjustedStates.filter(
        (item) => item.adjusted.adjustedStatus !== "Missed"
      ).length;
      return Math.max(baseAlerts, campaignDetectedCount);
    }

    if (adjustedState.adjustedStatus === "Detected" && baseAlerts === 0) return 1;
    if (adjustedState.adjustedStatus === "Detected") return baseAlerts + 1;
    if (adjustedState.adjustedStatus === "Partially Detected" && baseAlerts === 0) return 1;

    return baseAlerts;
  }, [displayedEvents, simulationFinished, mode, campaignAdjustedStates, adjustedState]);

  const logCount = useMemo(() => {
    return displayedEvents.filter((event) => event.type === "log").length;
  }, [displayedEvents]);

  const visibleCoverage = useMemo(() => {
    if (displayedEvents.length === 0) return 0;

    if (mode === "campaign") {
      const progress = displayedEvents.length / Math.max(campaignEvents.length, 1);
      return Math.round(progress * campaignCoverage);
    }

    const progress = displayedEvents.length / selectedScenario.events.length;
    return Math.round(progress * adjustedState.adjustedCoverage);
  }, [displayedEvents, mode, campaignEvents.length, campaignCoverage, selectedScenario, adjustedState]);

  const visibleStatus = useMemo(() => {
    if (!simulationFinished) return "In Progress";
    return mode === "campaign" ? campaignStatus : adjustedState.adjustedStatus;
  }, [simulationFinished, mode, campaignStatus, adjustedState]);

  const purpleSummary = useMemo(() => {
    if (!simulationFinished) {
      return "Scenario execution in progress. Telemetry and detections are being validated.";
    }

    if (mode === "campaign") {
      if (campaignStatus === "Detected") {
        return "The campaign was broadly detected across all selected attack stages with the current defensive controls.";
      }
      if (campaignStatus === "Partially Detected") {
        return "Some campaign stages were detected, but defensive gaps remain across the full kill chain.";
      }
      return "The campaign exposed major defensive weaknesses across multiple stages.";
    }

    if (adjustedState.adjustedStatus === "Detected") {
      return "Defensive controls are strong enough to detect and validate the simulated attack path.";
    }
    if (adjustedState.adjustedStatus === "Partially Detected") {
      return "Some controls are effective, but additional tuning is required to close remaining gaps.";
    }
    return "The scenario still reveals defensive blind spots and requires stronger controls.";
  }, [simulationFinished, mode, campaignStatus, adjustedState]);

  const activeControls = useMemo(() => {
    return Object.entries(controls)
      .filter(([, enabled]) => enabled)
      .map(([key]) => controlLabels[key]);
  }, [controls]);

  /* ----------------------------------------
     📄 Report + charts
  ---------------------------------------- */
  const reportText = useMemo(() => {
    if (mode === "campaign") {
      return `PURPLE TEAM CAMPAIGN REPORT

Campaign Scenarios: ${selectedCampaignScenarios.map((s) => s.name).join(", ")}
Final Status: ${campaignStatus}
Coverage Score: ${campaignCoverage}%
Observed Logs: ${logCount}
Triggered Alerts: ${alertCount}
Enabled Controls: ${activeControls.length ? activeControls.join(", ") : "None"}

Scenario Results:
${campaignAdjustedStates
          .map(
            (item, index) =>
              `${index + 1}. ${item.scenario.name} - ${item.adjusted.adjustedStatus} - ${item.adjusted.adjustedCoverage}%`
          )
          .join("\n")}

Summary:
${purpleSummary}
`;
    }

    return `PURPLE TEAM REPORT

Scenario: ${selectedScenario.name}
Tactic: ${selectedScenario.tactic}
Technique: ${selectedScenario.technique}
Severity: ${selectedScenario.severity}
Final Status: ${adjustedState.adjustedStatus}
Coverage Score: ${adjustedState.adjustedCoverage}%
Observed Logs: ${logCount}
Triggered Alerts: ${alertCount}
Enabled Controls: ${activeControls.length ? activeControls.join(", ") : "None"}

Summary:
${purpleSummary}

Recommendations:
${selectedScenario.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}
`;
  }, [
    mode,
    selectedCampaignScenarios,
    campaignStatus,
    campaignCoverage,
    logCount,
    alertCount,
    activeControls,
    campaignAdjustedStates,
    purpleSummary,
    selectedScenario,
    adjustedState,
  ]);

  const copyReport = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
    }
  }, [reportText]);

  const globalCoverageData = useMemo(() => {
    return scenarios.map((scenario) => {
      const scenarioAdjusted = getScenarioAdjustedState(scenario, controls);

      return {
        name: scenario.name.length > 12 ? scenario.name.split(" ")[0] : scenario.name,
        coverage: scenarioAdjusted.adjustedCoverage,
      };
    });
  }, [controls]);

  const selectedRadarData = useMemo(() => {
    return [
      { subject: "Attack", value: 100 },
      { subject: "Logs", value: Math.min(logCount * 30 || 10, 100) },
      { subject: "Alerts", value: Math.min(alertCount * 35 || 10, 100) },
      {
        subject: "Validation",
        value:
          visibleStatus === "Detected"
            ? 95
            : visibleStatus === "Partially Detected"
              ? 60
              : visibleStatus === "In Progress"
                ? 35
                : 20,
      },
      { subject: "Coverage", value: visibleCoverage },
    ];
  }, [logCount, alertCount, visibleStatus, visibleCoverage]);

  const globalStats = useMemo(() => {
    const computed = scenarios.map((scenario) => getScenarioAdjustedState(scenario, controls));

    return {
      detected: computed.filter((s) => s.adjustedStatus === "Detected").length,
      partial: computed.filter((s) => s.adjustedStatus === "Partially Detected").length,
      missed: computed.filter((s) => s.adjustedStatus === "Missed").length,
    };
  }, [controls]);

  /* ----------------------------------------
     🧭 View switch
  ---------------------------------------- */
  let content;

  switch (activeView) {

    case "red":
      content = (
        <RedView
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSession={setActiveSession}
          createSession={createSession}
          mode={mode}
          setMode={setMode}
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          selectedCampaignScenarios={selectedCampaignScenarios}
          campaignScenarioIds={campaignScenarioIds}
          setSelectedScenarioId={setSelectedScenarioId}
          toggleCampaignScenarioId={toggleCampaignScenarioId}
          controls={controls}
          toggleControl={toggleControl}
          handleResetControls={handleResetControls}
          runSimulation={runSimulation}
          resetSimulation={resetSimulation}
          isRunning={isRunning}
          getScenarioAdjustedState={getScenarioAdjustedState}
          severityClasses={severityClasses}
          statusClasses={statusClasses}
          displayedEvents={effectiveDisplayedEvents}
        />
      );
      break;

    case "purple":
      content = (
        <PurpleView
          mode={mode}
          selectedScenario={selectedScenario}
          selectedCampaignScenarios={selectedCampaignScenarios}
          visibleStatus={visibleStatus}
          displayedEvents={effectiveDisplayedEvents}
          activeControls={activeControls}
          isRunning={isRunning}
          coverage={coverage}
          eventAccent={eventAccent}
          eventIcon={eventIcon}
        />
      );
      break;

    case "blue":
      content = (
        <BlueView
          metrics={metrics}
          activeAlerts={activeAlerts}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
          updateAlertTriageStatus={updateAlertTriageStatus}
          visibleStatus={visibleStatus}
          coverage={coverage}
          activeControls={activeControls}
          mode={mode}
          selectedScenario={selectedScenario}
        />
      );
      break;

    case "analytics":
      content = (
        <AnalyticsLabView
          sessions={sessions}
          scenarios={scenarios}
          metrics={metrics}
          activeAlerts={activeAlerts}
          visibleStatus={visibleStatus}
          coverage={visibleCoverage}
          controls={controls}
          setActiveView={setActiveView}
          setSelectedScenarioId={setSelectedScenarioId}
          setRulesLabFocus={setRulesLabFocus}
        />
      );
      break;

    case "output":
      content = (
        <OutputView
          mode={mode}
          visibleStatus={visibleStatus}
          selectedScenario={selectedScenario}
          selectedCampaignScenarios={selectedCampaignScenarios}
          selectedCampaignCount={selectedCampaignScenarios.length}
          selectedScenarioCount={1}
          selectedCampaignCoverage={campaignCoverage}
          reportGenerated={reportGenerated}
          setReportGenerated={setReportGenerated}
          simulationFinished={simulationFinished}
          copyReport={copyReport}
          copied={copied}
          purpleSummary={purpleSummary}
          activeControls={activeControls}
          logCount={logCount}
          alertCount={alertCount}
          adjustedState={adjustedState}
          campaignAdjustedStates={campaignAdjustedStates}
          selectedRadarData={selectedRadarData}
          globalCoverageData={globalCoverageData}
          globalStats={globalStats}
          coverageTone={coverageTone}
          startReplay={startReplay}
          stopReplay={stopReplay}
          isReplayMode={isReplayMode}
          hasReplayData={(activeSession?.timeline ?? []).length > 0}
          pauseReplay={pauseReplay}
          resumeReplay={resumeReplay}
          scrubReplay={scrubReplay}
          replayIndex={replayIndex}
          replaySpeed={replaySpeed}
          setReplaySpeed={setReplaySpeed}
          isReplayPaused={isReplayPaused}
          replayTotal={(activeSession?.timeline ?? []).length}
        />
      );
      break;

    case "rules":
      content = (
        <RulesLabView
          selectedScenario={selectedScenario}
          visibleStatus={visibleStatus}
          coverage={coverage}
          rulesLabFocus={rulesLabFocus}
          onClearRulesLabFocus={() => setRulesLabFocus(null)}
        />
      );
      break;

    case "warroom":
      content = (
        <OperatorConsole
          selectedScenario={selectedScenario}
          selectedCampaignScenarios={selectedCampaignScenarios}
          visibleStatus={visibleStatus}
          isFullscreen={warRoomFullscreen}
          onToggleFullscreen={toggleWarRoomFullscreen}
          onExitFullscreen={exitWarRoomFullscreen}
        />
      );
      break;

    default:
      content = (
        <OverviewView
          scenariosCount={scenarios.length}
          displayedEventsCount={effectiveDisplayedEvents.length}
          alertCount={alertCount}
          visibleCoverage={visibleCoverage}
          mode={mode}
          selectedScenario={selectedScenario}
          selectedCampaignScenarios={selectedCampaignScenarios}
          visibleStatus={visibleStatus}
          purpleSummary={purpleSummary}
        />
      );
  }

  /* ----------------------------------------
     🧭 App frame
  ---------------------------------------- */

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      {!warRoomFullscreen && (
        <FloatingTopbar
          activeView={activeView}
          setActiveView={setActiveView}
          mode={mode}
          setMode={setMode}
          onRun={handleRun}
        />
      )}
      <KeyboardShortcutsOverlay
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      {!showShortcuts && (
        <button
          onClick={() => setShowShortcuts(true)}
          className="fixed bottom-6 right-6 z-[85] rounded-2xl px-4 py-2 text-sm font-medium text-white liquid-glass liquid-glass-hover"
        >
          ? raccourcis
        </button>
      )}

      <div
        className={
          warRoomFullscreen
            ? "h-screen overflow-hidden"
            : "pt-24 px-4 md:px-6"
        }
      >
        {content}
      </div>

      {!warRoomFullscreen && <AppFooter />}
    </div>
  );
}

export default App;