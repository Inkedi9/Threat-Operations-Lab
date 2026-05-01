import Panel from "../ui/Panel";
import { scenarioDefinitions } from "../../data/scenarios/index.js";
import {
    getScenarioStatus,
    getScenarioRequirementsLabel,
} from "../../lib/scenarioChaining";

function statusStyles(status) {
    switch (status) {
        case "completed":
            return {
                card: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
                dot: "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.35)]",
                badge: "border-emerald-500/20 bg-emerald-500/12 text-emerald-200",
            };

        case "available":
            return {
                card: "border-danger/20 bg-danger/10 text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.08)]",
                dot: "bg-danger shadow-[0_0_14px_rgba(239,68,68,0.55)]",
                badge: "border-danger/20 bg-danger/10 text-red-200",
            };

        default:
            return {
                card: "border-lineSoft/60 bg-black/20 text-zinc-200",
                dot: "bg-zinc-600",
                badge: "border-lineSoft bg-zinc-900/45 text-zinc-400",
            };
    }
}

function ScenarioNode({ scenario, status }) {
    const styles = statusStyles(status);

    return (
        <div className={`rounded-2xl border p-4 ${styles.card}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${styles.dot}`} />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            {scenario.phase}
                        </p>
                        <h4 className="mt-2 text-sm font-semibold">{scenario.label}</h4>
                    </div>
                </div>

                <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${styles.badge}`}>
                    {status}
                </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-300">
                {scenario.description}
            </p>

            <div className="mt-4 rounded-xl border border-line/80 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Requires
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                    {getScenarioRequirementsLabel(scenarioDefinitions, scenario)}
                </p>
            </div>
        </div>
    );
}

function LinkBar({ active = false }) {
    return (
        <div className="flex h-full min-h-[36px] items-center justify-center">
            <div
                className={`h-1 w-full rounded-full ${active
                        ? "bg-gradient-to-r from-danger via-red-400/70 to-danger"
                        : "bg-zinc-800/40"
                    }`}
            />
        </div>
    );
}

export default function ScenarioProgressionMap({ launchedScenarios = [] }) {
    const scenarios = scenarioDefinitions.map((scenario) => ({
        ...scenario,
        status: getScenarioStatus(scenario, launchedScenarios),
    }));

    return (
        <Panel
            title="Scenario Progression Map"
            subtitle="Operational view of chained identity attack stages and their campaign readiness."
        >
            <div className="space-y-6">
                <div className="grid gap-4 xl:grid-cols-[1fr_80px_1fr_80px_1fr]">
                    <ScenarioNode scenario={scenarios[0]} status={scenarios[0].status} />
                    <LinkBar active={scenarios[2].status !== "locked"} />
                    <ScenarioNode scenario={scenarios[2]} status={scenarios[2].status} />
                    <LinkBar active={scenarios[3].status !== "locked"} />
                    <ScenarioNode scenario={scenarios[3]} status={scenarios[3].status} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_80px_1fr_80px_1fr]">
                    <ScenarioNode scenario={scenarios[1]} status={scenarios[1].status} />
                    <LinkBar active={scenarios[2].status !== "locked"} />
                    <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            Attack Convergence
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-300">
                            Initial credential abuse paths converge into privilege escalation,
                            then branch into lateral pivoting and privileged objective pursuit.
                        </p>
                    </div>
                    <LinkBar active={scenarios[4].status !== "locked"} />
                    <ScenarioNode scenario={scenarios[4]} status={scenarios[4].status} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_80px_1fr]">
                    <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            Persistence Outcome
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-300">
                            Once lateral movement and privileged objective access are achieved,
                            the operator can establish durable unauthorized presence.
                        </p>
                    </div>

                    <LinkBar active={scenarios[5].status !== "locked"} />

                    <ScenarioNode scenario={scenarios[5]} status={scenarios[5].status} />
                </div>
            </div>
        </Panel>
    );
}