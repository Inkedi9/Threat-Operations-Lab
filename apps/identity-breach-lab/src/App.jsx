import { useEffect, useState } from "react";
import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import {
  fetchEnvironment,
  runScenario as runScenarioRequest,
  resetEnvironment as resetEnvironmentRequest,
} from "./services/api";
import {
  setReplayPlaying,
  nextReplayStep,
  previousReplayStep,
  resetReplay,
  setReplaySpeed,
} from "./lib/replay";

import { getIncidentParams, getMockIncidentProfile } from "./lib/incidentParams";
import LandingPage from "./pages/LandingPage";

function getScenarioFocusTarget(scenarioId) {
  switch (scenarioId) {
    case "password-spray":
    case "credential-theft":
      return "scenarios";

    case "privilege-escalation":
    case "lateral-movement":
    case "admin-account-compromise":
      return "graph";

    case "persistence":
      return "entities";

    default:
      return "overview";
  }
}

function getScenarioToast(scenarioId) {
  switch (scenarioId) {
    case "password-spray":
      return {
        title: "Password spray detected",
        message:
          "Multiple authentication failures led to a compromised user identity.",
      };

    case "credential-theft":
      return {
        title: "Credential theft observed",
        message:
          "Reusable credentials were harvested and replayed on enterprise resources.",
      };

    case "privilege-escalation":
      return {
        title: "Privilege escalation confirmed",
        message:
          "Compromised access on WS-04 gained elevated local permissions.",
      };

    case "lateral-movement":
      return {
        title: "Lateral movement in progress",
        message:
          "Remote pivot activity reached FILE-SRV-02 from a compromised foothold.",
      };

    case "admin-account-compromise":
      return {
        title: "Privileged account abuse detected",
        message:
          "A sensitive admin identity accessed critical enterprise infrastructure.",
      };

    case "persistence":
      return {
        title: "Persistence mechanism created",
        message:
          "A rogue account was added to maintain unauthorized long-term access.",
      };

    default:
      return {
        title: "Security event detected",
        message:
          "The simulated environment has changed following a new attack action.",
      };
  }
}

export default function App() {
  const [state, setState] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isAttacking, setIsAttacking] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (["overview", "scenarios", "graph", "replay", "intelligence", "entities", "story"].includes(view)) {
      return view;
    }
    return "overview";
  });

  const [hasEntered, setHasEntered] = useState(false);

  const incidentParams = getIncidentParams();
  const incidentProfile = getMockIncidentProfile(incidentParams);

  const handleViewChange = (view) => {
    setActiveView(view);
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState({}, "", url);
  };

  useEffect(() => {
    if (incidentParams?.user || incidentParams?.incidentId || incidentParams?.incident) {
      const timer = setTimeout(() => setActiveView("graph"), 0);
      return () => clearTimeout(timer);
    }
  }, [incidentParams?.incident, incidentParams?.incidentId, incidentParams?.user]);

  useEffect(() => {
    async function loadEnvironment() {
      try {
        const response = await fetchEnvironment();
        setState(response.data);
      } finally {
        setIsBooting(false);
      }
    }

    loadEnvironment();
  }, []);

  useEffect(() => {
    if (!state?.replay?.isPlaying) return;

    const steps = state.replay.steps || [];
    const currentIndex = state.replay.currentStepIndex ?? -1;

    if (!steps.length || currentIndex >= steps.length - 1) {
      const timer = setTimeout(() => {
        setState((current) => {
          if (!current) return current;
          return setReplayPlaying(current, false);
        });
      }, 0);
      return () => clearTimeout(timer);
    }

    const replaySpeed = state?.replay?.speed || 1;
    const delay = Math.max(300, 1400 / replaySpeed);

    const timer = setTimeout(() => {
      setState((current) => {
        if (!current) return current;
        return nextReplayStep(current);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [
    state?.replay?.isPlaying,
    state?.replay?.currentStepIndex,
    state?.replay?.steps,
    state?.replay?.speed,
  ]);

  const handleRunScenario = async (scenarioId) => {
    if (!state) return;

    const target = getScenarioFocusTarget(scenarioId);
    const toastContent = getScenarioToast(scenarioId);

    setIsAttacking(true);

    try {
      const response = await runScenarioRequest(state, scenarioId);
      setState(response.data);
      handleViewChange(target);
      setToast(toastContent);

      setTimeout(() => {
        setToast(null);
      }, 3200);
    } finally {
      setIsAttacking(false);
    }
  };

  const handleReset = async () => {
    setIsAttacking(true);

    try {
      const response = await resetEnvironmentRequest();
      setState(response.data);
      handleViewChange("overview");
      setToast({
        title: "Simulation reset",
        message:
          "The corporate identity environment has been restored to its baseline state.",
      });

      setTimeout(() => {
        setToast(null);
      }, 2500);
    } finally {
      setIsAttacking(false);
    }
  };

  if (isBooting || !state) {
    return (
      <AppShell activeView={activeView} onViewChange={handleViewChange}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl border border-danger/20 bg-panelAlt px-6 py-5 shadow-dangerSoft">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
              Initializing environment
            </p>
            <p className="mt-3 text-sm text-zinc-300">
              Loading simulated identity attack surface...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleReplayPlayPause = () => {
    setState((current) => {
      if (!current) return current;
      return setReplayPlaying(current, !current.replay?.isPlaying);
    });
  };

  const handleReplayNext = () => {
    setState((current) => {
      if (!current) return current;
      return nextReplayStep(current);
    });
  };

  const handleReplayPrevious = () => {
    setState((current) => {
      if (!current) return current;
      return previousReplayStep(current);
    });
  };

  const handleReplayReset = () => {
    setState((current) => {
      if (!current) return current;
      return resetReplay(current);
    });
  };

  const handleReplaySpeedChange = (speed) => {
    setState((current) => {
      if (!current) return current;
      return setReplaySpeed(current, speed);
    });
  };

  const replaySteps = state?.replay?.steps || [];
  const replayIndex = state?.replay?.currentStepIndex ?? -1;
  const currentReplayStep =
    replayIndex >= 0 && replayIndex < replaySteps.length
      ? replaySteps[replayIndex]
      : null;

  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <AppShell
      activeView={activeView}
      onViewChange={handleViewChange}
      onReset={handleReset}
      metrics={state.metrics}
      state={state}
    >
      {isAttacking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="text-2xl font-bold text-red-500 animate-pulse">
            ⚠ Identity Breach in Progress...
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed right-6 top-6 z-[60] w-full max-w-md">
          <div className="rounded-2xl border border-danger/30 bg-black/85 p-4 shadow-[0_0_30px_rgba(239,68,68,0.16)] backdrop-blur">
            <div className="mb-4 h-px w-full bg-gradient-to-r from-danger via-red-300/50 to-transparent" />
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-danger shadow-[0_0_18px_rgba(239,68,68,0.85)] animate-pulse" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
                  {toast.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardPage
        state={state}
        activeView={activeView}
        onViewChange={handleViewChange}
        onRunScenario={handleRunScenario}
        onReset={handleReset}
        currentReplayStep={currentReplayStep}
        incidentParams={incidentParams}
        incidentProfile={incidentProfile}
        onReplayPlayPause={handleReplayPlayPause}
        onReplayNext={handleReplayNext}
        onReplayPrevious={handleReplayPrevious}
        onReplayReset={handleReplayReset}
        onReplaySpeedChange={handleReplaySpeedChange}
      />
    </AppShell>
  );
}
