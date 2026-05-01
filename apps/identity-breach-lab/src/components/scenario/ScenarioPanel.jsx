import { useMemo, useState } from "react";
import Panel from "../ui/Panel";
import { scenarioDefinitions } from "../../data/scenarios/index.js";
import {
    getScenarioStatus,
    getScenarioRequirementsLabel,
} from "../../lib/scenarioChaining";
import MitreBadge from "../ui/MitreBadge";
import AttackImpactPreview from "./AttackImpactPreview";

function statusTone(status) {
    switch (status) {
        case "completed":
            return {
                card: "border-emerald-500/20 bg-emerald-500/10",
                badge: "border-emerald-500/20 bg-emerald-500/12 text-emerald-200",
                button:
                    "border-emerald-500/20 bg-emerald-500/12 text-emerald-200 cursor-not-allowed",
            };

        case "available":
            return {
                card: "border-danger/20 bg-black/25 shadow-[0_0_18px_rgba(239,68,68,0.05)] hover:border-danger/30 hover:bg-danger/10 hover:shadow-dangerSoft",
                badge: "border-danger/20 bg-danger/10 text-red-200",
                button:
                    "border-danger/25 bg-danger/10 text-red-200 shadow-[0_0_14px_rgba(239,68,68,0.08)] hover:border-danger/30 hover:bg-danger/20",
            };

        default:
            return {
                card: "border-line/70 bg-black/20 opacity-80",
                badge: "border-line/70 bg-zinc-950/45 text-zinc-400",
                button:
                    "border-line/70 bg-black/30 text-zinc-500 cursor-not-allowed",
            };
    }
}

function MutationPreview({ mutations }) {
    if (!mutations) {
        return (
            <p className="text-sm text-zinc-500">
                No mutation preview available for this scenario.
            </p>
        );
    }

    const entries = Object.entries(mutations);

    if (!entries.length) {
        return (
            <p className="text-sm text-zinc-500">
                No mutation preview available for this scenario.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map(([key, value]) => (
                <div
                    key={key}
                    className="rounded-xl border border-line/70 bg-black/25 p-3"
                >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {key}
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">
                        {Array.isArray(value)
                            ? `${value.length} change${value.length > 1 ? "s" : ""}`
                            : typeof value === "object"
                                ? `${Object.keys(value).length} field${Object.keys(value).length > 1 ? "s" : ""}`
                                : String(value)}
                    </p>
                </div>
            ))}
        </div>
    );
}

function ScenarioDetail({ scenario, launchedScenarios, onRunScenario }) {
    const status = getScenarioStatus(scenario, launchedScenarios);
    const tones = statusTone(status);
    const isLocked = status === "locked";
    const isCompleted = status === "completed";

    return (
        <Panel
            title="Scenario Intelligence"
            subtitle="Pre-execution briefing for the selected offensive scenario."
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.28em] text-danger">
                                {scenario.phase}
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-ink">
                                {scenario.label}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
                                {scenario.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-full border border-line/70 bg-zinc-950/45 px-2.5 py-1 text-xs text-zinc-300">
                                    Difficulty: {scenario.difficulty}
                                </span>

                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                                    Focus: {scenario.focusTarget}
                                </span>

                                {scenario.mitre && (
                                    <MitreBadge
                                        tactic={scenario.mitre.tactic}
                                        techniqueId={scenario.mitre.techniqueId}
                                        technique={scenario.mitre.technique}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 xl:w-72">
                            <span
                                className={`w-fit rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] xl:ml-auto ${tones.badge}`}
                            >
                                {status}
                            </span>

                            <button
                                type="button"
                                disabled={isLocked || isCompleted}
                                onClick={() => onRunScenario(scenario.id)}
                                className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${tones.button}`}
                            >
                                {isCompleted
                                    ? "Scenario Completed"
                                    : isLocked
                                        ? "Locked"
                                        : "Launch Scenario"}
                            </button>

                            {isLocked && (
                                <p className="text-xs leading-5 text-zinc-500">
                                    Requires:{" "}
                                    {getScenarioRequirementsLabel(scenarioDefinitions, scenario)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                    <div className="rounded-2xl border border-line/70 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-danger">
                            Execution Steps
                        </p>

                        <div className="mt-4 space-y-3">
                            {(scenario.steps || []).map((step, index) => (
                                <div
                                    key={`${scenario.id}-step-${index}`}
                                    className="rounded-xl border border-line/70 bg-black/25 p-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-xs font-bold text-red-200">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-zinc-100">
                                                {step.label || step.title || step.technique || `Step ${index + 1}`}
                                            </p>

                                            {step.description && (
                                                <p className="mt-1 text-sm leading-6 text-zinc-400">
                                                    {step.description}
                                                </p>
                                            )}

                                            {(step.techniqueId || step.tactic) && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {step.techniqueId && (
                                                        <span className="rounded-full border border-danger/20 bg-danger/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red-200">
                                                            {step.techniqueId}
                                                        </span>
                                                    )}

                                                    {step.tactic && (
                                                        <span className="rounded-full border border-line/70 bg-zinc-950/45 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                                                            {step.tactic}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!scenario.steps?.length && (
                                <p className="text-sm text-zinc-500">
                                    No step preview available.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-2xl border border-line/70 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                Prerequisites
                            </p>

                            <p className="mt-3 text-sm leading-6 text-zinc-300">
                                {getScenarioRequirementsLabel(
                                    scenarioDefinitions,
                                    scenario
                                )}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-line/70 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                Mutation Preview
                            </p>

                            <div className="mt-4">
                                <MutationPreview mutations={scenario.mutations} />
                            </div>
                        </div>
                    </div>

                    <AttackImpactPreview scenario={scenario} />
                </div>
            </div>
        </Panel>
    );
}

export default function ScenarioPanel({
    launchedScenarios = [],
    onRunScenario,
}) {
    const firstRunnableScenario = useMemo(() => {
        return (
            scenarioDefinitions.find(
                (scenario) =>
                    getScenarioStatus(scenario, launchedScenarios) === "available"
            ) || scenarioDefinitions[0]
        );
    }, [launchedScenarios]);

    const [selectedScenarioId, setSelectedScenarioId] = useState(
        firstRunnableScenario?.id
    );

    const selectedScenario =
        scenarioDefinitions.find((scenario) => scenario.id === selectedScenarioId) ||
        firstRunnableScenario;

    return (
        <div className="space-y-6">
            <Panel
                title="Attack Scenario Panel"
                subtitle="Launch chained offensive scenarios across identity, privilege and access paths."
            >
                <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                    {scenarioDefinitions.map((scenario) => {
                        const status = getScenarioStatus(
                            scenario,
                            launchedScenarios
                        );
                        const tones = statusTone(status);
                        const isSelected = selectedScenario?.id === scenario.id;

                        return (
                            <button
                                key={scenario.id}
                                type="button"
                                onClick={() => setSelectedScenarioId(scenario.id)}
                                className={`rounded-2xl border p-4 text-left transition ${tones.card
                                    } ${isSelected
                                        ? "ring-1 ring-danger/40 shadow-dangerSoft"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                            {scenario.phase}
                                        </p>

                                        <h4 className="mt-2 text-lg font-semibold text-ink">
                                            {scenario.label}
                                        </h4>
                                    </div>

                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${tones.badge}`}
                                    >
                                        {status}
                                    </span>
                                </div>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
                                    {scenario.description}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-line/70 bg-zinc-950/45 px-2.5 py-1 text-xs text-zinc-300">
                                        {scenario.difficulty}
                                    </span>

                                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                                        {scenario.focusTarget}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Panel>

            {selectedScenario && (
                <ScenarioDetail
                    scenario={selectedScenario}
                    launchedScenarios={launchedScenarios}
                    onRunScenario={onRunScenario}
                />
            )}
        </div>
    );
}