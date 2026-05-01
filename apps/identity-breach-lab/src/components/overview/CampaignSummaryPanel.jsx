import Panel from "../ui/Panel";
import { scenarioDefinitionMap } from "../../data/scenarios/index";

function getCurrentScenario(state) {
    return state?.replay?.scenarioId || null;
}

function getLastScenario(state) {
    const launched = state?.launchedScenarios || [];
    return launched.length ? launched[launched.length - 1] : null;
}

function getScenarioPhase(scenarioId) {
    if (!scenarioId) return "Baseline";

    const scenario = scenarioDefinitionMap[scenarioId];
    return scenario?.phase || "Unknown";
}

function getAttackProgress(state) {
    const total = state?.attackPath?.length ?? 0;
    const completed = state?.attackPath?.filter((s) => s.complete).length ?? 0;

    return {
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
    };
}

export default function CampaignSummaryPanel({ state }) {
    const currentScenario = getCurrentScenario(state);
    const lastScenario = getLastScenario(state);

    const phase = getScenarioPhase(currentScenario || lastScenario);
    const progress = getAttackProgress(state);

    const latestRisk =
        state.riskHistory?.[state.riskHistory.length - 1]?.risk ?? 0;

    return (
        <Panel
            title="Campaign Overview"
            subtitle="Real-time offensive posture of the identity attack simulation."
        >
            <div className="grid gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Current Phase
                    </p>
                    <p className="mt-3 text-lg font-bold text-red-200">{phase}</p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Active Scenario
                    </p>
                    <p className="mt-3 text-sm font-semibold text-zinc-100">
                        {state.replay?.scenarioLabel || "None"}
                    </p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Last Executed
                    </p>
                    <p className="mt-3 text-sm font-semibold text-zinc-300">
                        {lastScenario
                            ? scenarioDefinitionMap[lastScenario]?.label
                            : "Baseline"}
                    </p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Risk Score
                    </p>
                    <p className="mt-3 text-xl font-bold text-red-300">
                        {latestRisk}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    <span>Attack Chain Progress</span>
                    <span>
                        {progress.completed}/{progress.total}
                    </span>
                </div>

                <div className="h-2 rounded-full bg-black/60 overflow-hidden">
                    <div
                        className="h-full bg-danger shadow-[0_0_14px_rgba(239,68,68,0.8)]"
                        style={{ width: `${progress.percent}%` }}
                    />
                </div>
            </div>
        </Panel>
    );
}