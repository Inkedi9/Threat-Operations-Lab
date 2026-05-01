import {
    ShieldAlert,
    Network,
    Users,
    PlaySquare,
    RotateCcw,
    RadioTower,
    BrainCircuit,
    BookOpenText,
} from "lucide-react";

const items = [
    { label: "Overview", icon: ShieldAlert, id: "overview" },
    { label: "Scenarios", icon: PlaySquare, id: "scenarios" },
    { label: "Identity Graph", icon: Network, id: "graph" },
    { label: "Replay", icon: RadioTower, id: "replay" },
    { label: "Story Mode", icon: BookOpenText, id: "story" },
    { label: "Intelligence", icon: BrainCircuit, id: "intelligence" },
    { label: "Entities", icon: Users, id: "entities" },
];

const TOTAL_SCENARIOS = 6;

function getCompletedAttackSteps(state) {
    return state?.attackPath?.filter((step) => step.complete).length ?? 0;
}

function getReplayBadge(state) {
    if (!state?.replay?.isActive) return null;

    const current = (state.replay.currentStepIndex ?? -1) + 1;
    const total = state.replay.steps?.length ?? 0;

    if (!total) return "READY";

    return `${current}/${total}`;
}

function getGraphBadge(state, metrics) {
    const completedSteps = getCompletedAttackSteps(state);

    if (completedSteps > 0) return completedSteps;
    if (metrics?.lateralMovementAttempts > 0) return metrics.lateralMovementAttempts;

    return null;
}

function getBadge(itemId, state, metrics) {
    switch (itemId) {
        case "scenarios":
            return state?.launchedScenarios?.length
                ? `${state.launchedScenarios.length}/${TOTAL_SCENARIOS}`
                : null;

        case "graph":
            return getGraphBadge(state, metrics);

        case "replay":
            return getReplayBadge(state);

        case "story":
            return state?.replay?.isActive ? "LIVE" : null;

        case "entities":
            return metrics?.compromisedIdentities > 0
                ? metrics.compromisedIdentities
                : null;

        case "intelligence":
            return state?.riskHistory?.length > 1
                ? state.riskHistory[state.riskHistory.length - 1]?.risk
                : null;

        default:
            return null;
    }
}

function getReplayStatus(state) {
    if (!state?.replay?.isActive) return "No replay armed";
    if (state.replay.isPlaying) return "Playing";
    return "Paused / ready";
}

function getAttackProgress(state) {
    const total = state?.attackPath?.length ?? 0;
    const completed = getCompletedAttackSteps(state);

    if (!total) {
        return {
            completed: 0,
            total: 0,
            percent: 0,
        };
    }

    return {
        completed,
        total,
        percent: Math.round((completed / total) * 100),
    };
}

export default function Sidebar({
    activeView,
    onViewChange,
    onReset,
    metrics,
    state,
}) {
    const activeScenario = state?.replay?.scenarioLabel;
    const replayStatus = getReplayStatus(state);
    const attackProgress = getAttackProgress(state);

    return (
        <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r border-line/80 bg-black/30 p-6 xl:sticky xl:top-0 xl:flex xl:h-screen">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-danger">
                    Identity Breach Lab
                </p>

                <h1 className="mt-3 text-2xl font-bold text-ink">
                    Identity & Access Attack Simulator
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted">
                    Visual simulation of identity compromise, privilege escalation and
                    enterprise access abuse.
                </p>
            </div>

            <nav className="mt-10 space-y-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    const badge = getBadge(item.id, state, metrics);

                    return (
                        <button
                            key={item.label}
                            onClick={() => onViewChange(item.id)}
                            className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left transition ${isActive
                                ? "border-danger/40 bg-danger/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.14)]"
                                : "border-line/80 bg-zinc-900/45 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                                }`}
                        >
                            <span
                                className={`absolute bottom-2 left-0 top-2 w-1 rounded-r-full transition ${isActive
                                    ? "bg-danger shadow-[0_0_16px_rgba(239,68,68,0.75)]"
                                    : "bg-transparent"
                                    }`}
                            />

                            <span className="relative z-10 flex min-w-0 items-center gap-3">
                                <Icon
                                    size={18}
                                    className={`shrink-0 transition ${isActive
                                        ? "text-danger"
                                        : "text-danger/90 group-hover:text-danger"
                                        }`}
                                />

                                <span className="truncate">{item.label}</span>
                            </span>

                            {badge !== null && badge !== undefined ? (
                                <span
                                    className={`relative z-10 ml-3 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${isActive
                                        ? "border-danger/40 bg-danger/15 text-red-100"
                                        : "border-line/70 bg-black/40 text-zinc-400"
                                        }`}
                                >
                                    {badge}
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 shadow-[0_0_22px_rgba(239,68,68,0.08)]">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-danger">
                            Active Scenario
                        </p>

                        {state?.replay?.isPlaying ? (
                            <span className="h-2 w-2 rounded-full bg-danger shadow-[0_0_14px_rgba(239,68,68,0.9)]" />
                        ) : null}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-red-100">
                        {activeScenario || "Baseline Environment"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        Replay: {replayStatus}
                    </p>

                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            <span>Attack Chain</span>
                            <span>
                                {attackProgress.completed}/{attackProgress.total}
                            </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-black/60">
                            <div
                                className="h-full rounded-full bg-danger shadow-[0_0_14px_rgba(239,68,68,0.8)] transition-all"
                                style={{ width: `${attackProgress.percent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 shadow-[0_0_22px_rgba(239,68,68,0.08)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Campaign State
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Compromised
                            </p>
                            <p className="mt-1 text-xl font-bold text-red-200">
                                {metrics?.compromisedIdentities ?? 0}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Critical
                            </p>
                            <p className="mt-1 text-xl font-bold text-amber-200">
                                {metrics?.criticalAssetsReached ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line/80 bg-black/40 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
                >
                    <RotateCcw size={16} />
                    Reset Simulation
                </button>
            </div>
        </aside>
    );
}