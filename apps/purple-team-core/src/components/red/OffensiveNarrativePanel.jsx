import { useMemo } from "react";
import { Swords, Sparkles } from "lucide-react";
import PanelCard from "../ui/PanelCard";

/* ========================================
   🔴 Offensive Narrative Panel
======================================== */

export default function OffensiveNarrativePanel({
    events = [],
    selectedScenario,
    mode,
    selectedCampaignScenarios = [],
    isRunning = false,
}) {
    const narrative = useMemo(() => {
        return buildNarrative({
            events,
            selectedScenario,
            mode,
            selectedCampaignScenarios,
            isRunning,
        });
    }, [events, selectedScenario, mode, selectedCampaignScenarios, isRunning]);

    const latestEvent = events[events.length - 1] ?? null;

    return (
        <PanelCard
            variant="threat"
            className="overflow-hidden"
            live={isRunning}
            stress={isRunning}
            hotLevel={isRunning ? "medium" : "low"}
        >
            <div className="flex items-center justify-between border-b border-cyber-border/80 bg-[linear-gradient(180deg,rgba(20,10,14,0.88),rgba(12,10,18,0.88))] px-4 py-1.5">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-text/90">
                    offensive-narrative.log
                </p>

                <div
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${isRunning
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-white/[0.06] bg-white/[0.03] text-cyber-muted"
                        }`}
                >
                    <span className="relative flex h-2 w-2">
                        {isRunning && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                        )}
                        <span
                            className={`relative inline-flex h-2 w-2 rounded-full ${isRunning ? "bg-red-500" : "bg-slate-500"
                                }`}
                        />
                    </span>
                    <span>Live</span>
                </div>
            </div>

            <div className="bg-[#0b0b0f] p-4">
                <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-2xl border border-cyber-red/30 bg-cyber-red/10 p-2">
                        <Swords className="h-5 w-5 text-cyber-red" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-cyber-text">
                            Offensive Narrative
                        </p>
                        <p className="mt-1 text-sm text-cyber-muted">
                            Live red team perspective on the active simulation flow
                        </p>
                    </div>
                </div>

                <PanelCard
                    variant="signal"
                    dense
                    live={isRunning}
                    hotLevel={latestEvent ? "low" : "none"}
                    className="font-mono"
                >
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <Sparkles className="h-4 w-4" />
                            <span>red-ops@purple-lab:~$ narrate</span>
                        </div>

                        <span className="text-cyber-muted">
                            {latestEvent ? `last event: ${latestEvent.type}` : "idle"}
                        </span>
                    </div>

                    <div className="space-y-3 text-sm leading-7 text-slate-300">
                        {narrative.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧠 Narrative Engine
======================================== */

function buildNarrative({
    events,
    selectedScenario,
    mode,
    selectedCampaignScenarios,
    isRunning,
}) {
    if (!events.length) {
        return [
            mode === "campaign"
                ? `The operator is preparing a chained attack sequence across ${selectedCampaignScenarios.length} stages.`
                : `The operator is preparing the scenario "${selectedScenario?.name ?? "Unknown Scenario"}".`,
            "No offensive activity has been streamed yet.",
            "Launch the simulation to observe attacker progression, defender reactions, and validation outcomes in real time.",
        ];
    }

    const latestEvent = events[events.length - 1];
    const attackCount = events.filter((event) => event.type === "attack").length;
    const alertCount = events.filter((event) => event.type === "alert").length;
    const purpleCount = events.filter((event) => event.type === "purple").length;

    const baseLine =
        mode === "campaign"
            ? `The campaign is actively moving through a multi-stage attack chain involving ${selectedCampaignScenarios.length} selected scenarios.`
            : `The scenario "${selectedScenario?.name ?? "Unknown Scenario"}" is currently being executed from an offensive perspective.`;

    const progressionLine = isRunning
        ? `The attacker has already generated ${attackCount} offensive actions, while defenders have produced ${alertCount} alert signals and ${purpleCount} purple validation events.`
        : `The replay or simulation snapshot currently includes ${attackCount} offensive actions, ${alertCount} alert signals, and ${purpleCount} validation events.`;

    const latestLine = interpretLatestEvent(latestEvent);

    return [baseLine, progressionLine, latestLine];
}

function interpretLatestEvent(event) {
    if (!event) {
        return "No current event is available for offensive interpretation.";
    }

    if (event.type === "attack") {
        return `Latest operator insight: offensive activity is still progressing. "${event.title}" indicates the attacker is actively advancing the operation with direct execution on target assets.`;
    }

    if (event.type === "alert") {
        return `Latest operator insight: blue team visibility has increased. "${event.title}" suggests the defender stack has identified suspicious behavior and is now reacting to the attack flow.`;
    }

    if (event.type === "purple") {
        return `Latest operator insight: purple validation is occurring. "${event.title}" indicates the exercise is now being assessed for defensive effectiveness and coverage quality.`;
    }

    if (event.type === "log") {
        return `Latest operator insight: telemetry is accumulating. "${event.title}" shows that system or security logs are documenting the progression of the attack sequence.`;
    }

    if (event.type === "campaign") {
        return `Latest operator insight: the campaign has advanced to a new stage. "${event.title}" marks a transition in the chained attack workflow.`;
    }

    return `Latest operator insight: "${event.title}" reflects additional activity in the active simulation pipeline.`;
}