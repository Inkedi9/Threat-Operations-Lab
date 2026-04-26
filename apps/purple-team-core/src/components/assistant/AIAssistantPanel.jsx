import { useMemo, useState } from "react";
import { Bot, Sparkles, ShieldAlert, SearchCheck, Radar } from "lucide-react";
import PanelCard from "../ui/PanelCard";

/* ========================================
   🤖 AI Assistant Panel
======================================== */

export default function AIAssistantPanel({
    selectedAlert,
    visibleStatus,
    coverage,
    activeControls = [],
    mode,
    selectedScenario,
}) {
    const [promptType, setPromptType] = useState("explain_alert");

    const response = useMemo(() => {
        return buildAssistantResponse({
            promptType,
            selectedAlert,
            visibleStatus,
            coverage,
            activeControls,
            mode,
            selectedScenario,
        });
    }, [promptType, selectedAlert, visibleStatus, coverage, activeControls, mode, selectedScenario]);

    return (
        <PanelCard variant="elevated" className="overflow-hidden">

            {/* Header console */}
            <div className="flex items-center justify-between border-b border-cyber-border px-4 py-2">
                <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-text/90">
                    ai-assistant.log
                </p>

                <div className="w-[52px]" />
            </div>

            <div className="p-4">

                {/* Header */}
                <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-2xl border border-cyber-violet/30 bg-cyber-violet/10 p-2">
                        <Bot className="h-5 w-5 text-cyber-violet" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-cyber-text">
                            AI Assistant
                        </p>
                        <p className="mt-1 text-sm text-cyber-muted">
                            Analyst support & validation insights
                        </p>
                    </div>
                </div>

                {/* ⚡ Quick prompts */}
                <div className="grid grid-cols-1 gap-2">
                    <PromptButton
                        active={promptType === "explain_alert"}
                        onClick={() => setPromptType("explain_alert")}
                        icon={<ShieldAlert className="h-4 w-4" />}
                        label="Explain this alert"
                    />
                    <PromptButton
                        active={promptType === "why_failed"}
                        onClick={() => setPromptType("why_failed")}
                        icon={<SearchCheck className="h-4 w-4" />}
                        label="Why detection failed?"
                    />
                    <PromptButton
                        active={promptType === "improve_coverage"}
                        onClick={() => setPromptType("improve_coverage")}
                        icon={<Radar className="h-4 w-4" />}
                        label="How to improve coverage?"
                    />
                </div>

                {/* 💬 Answer */}
                <PanelCard variant="glass" className="mt-4">
                    <div className="mb-2 flex items-center gap-2 text-cyan-400 text-xs">
                        <Sparkles className="h-4 w-4" />
                        purple-ai@assistant:~$ analyze
                    </div>

                    <div className="space-y-3 text-sm leading-6 text-slate-300">
                        {response.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Prompt Button
======================================== */

function PromptButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${active
                ? "border-cyber-violet/30 bg-cyber-violet/10 text-white"
                : "border-cyber-border bg-cyber-panel/70 text-cyber-muted hover:border-cyber-violet/30 hover:text-white"
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

/* ========================================
   🧠 Mock Response Engine
======================================== */

function buildAssistantResponse({
    promptType,
    selectedAlert,
    visibleStatus,
    coverage,
    activeControls,
    mode,
    selectedScenario,
}) {
    const controlsText =
        activeControls.length > 0 ? activeControls.join(", ") : "no active defensive controls";

    if (promptType === "explain_alert") {
        if (!selectedAlert) {
            return [
                "No specific alert is currently selected.",
                "Select an alert in the Blue Team queue to receive a more targeted explanation of what triggered it and which telemetry likely contributed to the detection.",
            ];
        }

        return [
            `This alert likely represents a detection artifact generated from the simulated event stream. In this context, the alert titled "${selectedAlert.title || "Detection Alert"}" indicates that the defensive stack observed suspicious behavior worth analyst review.`,
            `The most relevant fields here are severity, source, and triage status. A realistic analyst interpretation would be to correlate this alert with surrounding logs and determine whether it confirms malicious activity, a weak signal, or a benign simulation artifact.`,
            `Given the current validation state (${visibleStatus}) and the active controls (${controlsText}), this alert suggests the environment has at least partial visibility into the simulated attack path.`,
        ];
    }

    if (promptType === "why_failed") {
        if (visibleStatus === "Detected") {
            return [
                "Detection did not fail in the current state.",
                `The simulation is currently marked as ${visibleStatus}, which means the defensive controls were sufficient to identify the simulated attack path.`,
                `The remaining work is less about failure and more about reducing analyst effort, improving correlation quality, and increasing consistency across scenarios.`,
            ];
        }

        if (visibleStatus === "Partially Detected") {
            return [
                "Detection appears incomplete rather than fully failed.",
                `A partial result usually means some telemetry exists, but correlation, fidelity, or control placement is insufficient to fully validate the attack chain.`,
                `In this session, improving coverage likely requires stronger tuning around correlation logic, endpoint visibility, or scenario-specific controls beyond the current set (${controlsText}).`,
            ];
        }

        return [
            "Detection likely failed because the current defensive posture does not provide enough visibility or correlation for the simulated scenario.",
            `The current status is ${visibleStatus} with coverage around ${coverage}%. This typically means that either the relevant control is missing, the telemetry is weak, or the detection logic is not chained strongly enough across the attack sequence.`,
            `A realistic next step would be to enable or strengthen controls such as EDR, SIEM correlation, IDS, or DLP depending on the scenario being tested.`,
        ];
    }

    return [
        `To improve coverage from the current level (${coverage}%), the most effective path is to increase visibility and correlation around the active scenario${selectedScenario ? `: ${selectedScenario.name}` : ""}.`,
        `Active controls right now are ${controlsText}. In a real purple team workflow, the next tuning decisions would focus on adding missing telemetry, improving event correlation, and validating that alerts map clearly to attacker behavior.`,
        `For ${mode} mode, the biggest gains usually come from combining endpoint visibility, network visibility, and stronger SIEM-style correlation so that isolated signals become a validated detection chain.`,
    ];
}