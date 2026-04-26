import { create } from "zustand";
import {
  createSimulationSession,
  createEmptyMetrics,
} from "../../core/models/simulationSession";
import {
  clearPersistedSimulationState,
  loadPersistedSimulationState,
  savePersistedSimulationState,
} from "../../core/persistence/storage";

const defaultControls = {
  mfa: false,
  edr: false,
  ids: false,
  siem: false,
  dlp: false,
};

function buildInitialState() {
  const persisted = loadPersistedSimulationState();

  if (persisted) {
    return {
      sessions: persisted.sessions ?? [],
      activeSessionId: persisted.activeSessionId ?? null,
      selectedScenarioId: persisted.selectedScenarioId ?? "bruteforce",
      campaignScenarioIds: persisted.campaignScenarioIds ?? [
        "scan",
        "bruteforce",
      ],
      mode: persisted.mode ?? "single",
      displayedEvents: persisted.displayedEvents ?? [],
      isHydrated: true,
      replayEvents: persisted?.replayEvents ?? [],
      isReplayMode: persisted?.isReplayMode ?? false,
      replayIndex: persisted?.replayIndex ?? 0,
      replaySpeed: persisted?.replaySpeed ?? 1,
      isReplayPaused: persisted?.isReplayPaused ?? false,
    };
  }

  const firstSession = createSimulationSession({
    name: "Initial Purple Session",
    mode: "single",
    selectedScenarioIds: ["bruteforce"],
    controls: defaultControls,
    replayEvents: [],
    isReplayMode: false,
    replayIndex: 0,
    replaySpeed: 1,
    isReplayPaused: false,
  });

  return {
    sessions: [firstSession],
    activeSessionId: firstSession.id,
    selectedScenarioId: "bruteforce",
    campaignScenarioIds: ["scan", "bruteforce"],
    mode: "single",
    displayedEvents: [],
    isHydrated: true,
  };
}

function persistStateSnapshot(state) {
  savePersistedSimulationState({
    sessions: state.sessions,
    activeSessionId: state.activeSessionId,
    selectedScenarioId: state.selectedScenarioId,
    campaignScenarioIds: state.campaignScenarioIds,
    mode: state.mode,
    displayedEvents: state.displayedEvents,
    replayEvents: state.replayEvents,
    isReplayMode: state.isReplayMode,
  });
}

export const useSimulationStore = create((set, get) => ({
  ...buildInitialState(),
  /* ----------------------------------------
     ⏪ Replay actions
  ---------------------------------------- */
  setReplayMode: (enabled) => {
    set((state) => {
      const nextState = {
        ...state,
        isReplayMode: enabled,
        replayEvents: enabled ? state.replayEvents : [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setReplayEvents: (events) => {
    set((state) => {
      const nextState = {
        ...state,
        replayEvents: events,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  appendReplayEvent: (event) => {
    set((state) => {
      const nextState = {
        ...state,
        replayEvents: [...state.replayEvents, event],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  resetReplay: () => {
    set((state) => {
      const nextState = {
        ...state,
        replayEvents: [],
        isReplayMode: false,
        replayIndex: 0,
        replaySpeed: 1,
        isReplayPaused: false,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    return sessions.find((session) => session.id === activeSessionId) ?? null;
  },

  setMode: (mode) => {
    set((state) => {
      const nextState = { ...state, mode };
      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setReplayIndex: (index) => {
    set((state) => {
      const nextState = {
        ...state,
        replayIndex: index,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setReplaySpeed: (speed) => {
    set((state) => {
      const nextState = {
        ...state,
        replaySpeed: speed,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setReplayPaused: (paused) => {
    set((state) => {
      const nextState = {
        ...state,
        isReplayPaused: paused,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setSelectedScenarioId: (scenarioId) => {
    set((state) => {
      const nextSessions = state.sessions.map((session) =>
        session.id === state.activeSessionId
          ? {
              ...session,
              mode: "single",
              selectedScenarioIds: [scenarioId],
            }
          : session,
      );

      const nextState = {
        ...state,
        selectedScenarioId: scenarioId,
        sessions: nextSessions,
        displayedEvents: [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  toggleCampaignScenarioId: (scenarioId) => {
    set((state) => {
      const exists = state.campaignScenarioIds.includes(scenarioId);

      const nextCampaignIds = exists
        ? state.campaignScenarioIds.length > 1
          ? state.campaignScenarioIds.filter((id) => id !== scenarioId)
          : state.campaignScenarioIds
        : [...state.campaignScenarioIds, scenarioId];

      const nextSessions = state.sessions.map((session) =>
        session.id === state.activeSessionId
          ? {
              ...session,
              mode: "campaign",
              selectedScenarioIds: nextCampaignIds,
            }
          : session,
      );

      const nextState = {
        ...state,
        campaignScenarioIds: nextCampaignIds,
        sessions: nextSessions,
        displayedEvents: [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setControls: (updater) => {
    set((state) => {
      const nextSessions = state.sessions.map((session) => {
        if (session.id !== state.activeSessionId) return session;

        const nextControls =
          typeof updater === "function" ? updater(session.controls) : updater;

        return {
          ...session,
          controls: nextControls,
        };
      });

      const nextState = {
        ...state,
        sessions: nextSessions,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  resetControls: () => {
    set((state) => {
      const nextSessions = state.sessions.map((session) =>
        session.id === state.activeSessionId
          ? {
              ...session,
              controls: { ...defaultControls },
            }
          : session,
      );

      const nextState = {
        ...state,
        sessions: nextSessions,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  createSession: ({ name, mode, selectedScenarioIds, controls } = {}) => {
    set((state) => {
      const newSession = createSimulationSession({
        name: name ?? `Purple Session ${state.sessions.length + 1}`,
        mode: mode ?? state.mode,
        selectedScenarioIds:
          selectedScenarioIds ??
          (state.mode === "campaign"
            ? state.campaignScenarioIds
            : [state.selectedScenarioId]),
        controls:
          controls ?? state.getActiveSession()?.controls ?? defaultControls,
      });

      const nextState = {
        ...state,
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
        displayedEvents: [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setActiveSession: (sessionId) => {
    set((state) => {
      const nextActive = state.sessions.find(
        (session) => session.id === sessionId,
      );
      if (!nextActive) return state;

      const nextState = {
        ...state,
        activeSessionId: sessionId,
        mode: nextActive.mode,
        selectedScenarioId: nextActive.selectedScenarioIds[0] ?? "bruteforce",
        campaignScenarioIds:
          nextActive.mode === "campaign"
            ? nextActive.selectedScenarioIds
            : state.campaignScenarioIds,
        displayedEvents: [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  updateActiveSessionStatus: (status) => {
    set((state) => {
      const now = new Date().toISOString();

      const nextSessions = state.sessions.map((session) => {
        if (session.id !== state.activeSessionId) return session;

        return {
          ...session,
          status,
          startedAt:
            status === "running" && !session.startedAt
              ? now
              : session.startedAt,
          endedAt:
            status === "completed" || status === "stopped"
              ? now
              : session.endedAt,
        };
      });

      const nextState = {
        ...state,
        sessions: nextSessions,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  setDisplayedEvents: (events) => {
    set((state) => {
      const nextState = {
        ...state,
        displayedEvents: events,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  appendDisplayedEvent: (event) => {
    set((state) => {
      const nextState = {
        ...state,
        displayedEvents: [...state.displayedEvents, event],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  syncActiveSessionData: ({ timeline, logs, alerts, metrics, report } = {}) => {
    set((state) => {
      const nextSessions = state.sessions.map((session) => {
        if (session.id !== state.activeSessionId) return session;

        return {
          ...session,
          timeline: timeline ?? session.timeline,
          logs: logs ?? session.logs,
          alerts: alerts ?? session.alerts,
          metrics: metrics ?? session.metrics ?? createEmptyMetrics(),
          report: report ?? session.report,
        };
      });

      const nextState = {
        ...state,
        sessions: nextSessions,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  resetActiveSessionRuntime: () => {
    set((state) => {
      const nextSessions = state.sessions.map((session) =>
        session.id === state.activeSessionId
          ? {
              ...session,
              status: "idle",
              startedAt: null,
              endedAt: null,
              timeline: [],
              logs: [],
              alerts: [],
              report: null,
              metrics: createEmptyMetrics(),
            }
          : session,
      );

      const nextState = {
        ...state,
        sessions: nextSessions,
        displayedEvents: [],
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  /* ----------------------------------------
     🚨 Alert triage actions
  ---------------------------------------- */
  updateAlertTriageStatus: (alertId, triageStatus) => {
    set((state) => {
      const nextSessions = state.sessions.map((session) => {
        if (session.id !== state.activeSessionId) return session;

        const nextAlerts = session.alerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                triageStatus,
              }
            : alert,
        );

        return {
          ...session,
          alerts: nextAlerts,
        };
      });

      const nextState = {
        ...state,
        sessions: nextSessions,
      };

      persistStateSnapshot(nextState);
      return nextState;
    });
  },

  clearAllPersistedData: () => {
    clearPersistedSimulationState();

    const freshSession = createSimulationSession({
      name: "Initial Purple Session",
      mode: "single",
      selectedScenarioIds: ["bruteforce"],
      controls: defaultControls,
    });

    set({
      sessions: [freshSession],
      activeSessionId: freshSession.id,
      selectedScenarioId: "bruteforce",
      campaignScenarioIds: ["scan", "bruteforce"],
      mode: "single",
      displayedEvents: [],
      isHydrated: true,
    });
  },
}));
