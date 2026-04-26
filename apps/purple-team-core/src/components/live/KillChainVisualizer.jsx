import { useEffect, useMemo, useRef, useState } from "react";
import {
    CheckCircle2,
    Eye,
    XCircle,
    Link2,
    ShieldCheck,
    AlertTriangle,
    ChevronRight,
    Radar,
    Shield,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";

/* ========================================
   ⛓️ Kill Chain Visualizer
======================================== */

const killChainSteps = [
    {
        id: "recon",
        name: "Recon",
        short: "Reconnaissance phase",
        defaultDescription:
            "Initial information gathering and target discovery before active intrusion attempts.",
    },
    {
        id: "weaponize",
        name: "Weaponize",
        short: "Capability preparation",
        defaultDescription:
            "Preparation of payloads, tooling or access chains before delivery.",
    },
    {
        id: "deliver",
        name: "Deliver",
        short: "Initial delivery vector",
        defaultDescription:
            "Delivery of the malicious payload or access vector into the target environment.",
    },
    {
        id: "exploit",
        name: "Exploit",
        short: "Execution / abuse",
        defaultDescription:
            "Execution of payloads or exploitation of a weakness to gain initial foothold.",
    },
    {
        id: "install",
        name: "Install",
        short: "Persistence / tooling",
        defaultDescription:
            "Attacker tooling or persistence mechanisms are established inside the environment.",
    },
    {
        id: "c2",
        name: "C2",
        short: "Command and control",
        defaultDescription:
            "Outbound signaling or command channels appear once access is established.",
    },
    {
        id: "actions",
        name: "Actions",
        short: "Operational objective",
        defaultDescription:
            "Final offensive objective such as credential access, movement, staging or exfiltration.",
    },
];

export default function KillChainVisualizer({
    displayedEvents = [],
    visibleStatus = "In Progress",
    selectedScenario,
    isRunning = false,
    selectedStepId: controlledSelectedStepId,
    onSelectedStepChange,
    onActiveStepChange,
}) {
    const targetStepStates = useMemo(() => {
        return buildKillChainState(displayedEvents, visibleStatus, selectedScenario);
    }, [displayedEvents, visibleStatus, selectedScenario]);

    const [animatedStepIndex, setAnimatedStepIndex] = useState(0);
    const animationTimeoutRef = useRef(null);

    const selectedStepId =
        controlledSelectedStepId ?? killChainSteps[0].id;

    const targetAnimatedStepIndex = useMemo(() => {
        const progressedSteps = targetStepStates.filter((step) => step.status !== "pending");
        return progressedSteps.length > 0 ? progressedSteps.length - 1 : 0;
    }, [targetStepStates]);

    const renderedStepStates = useMemo(() => {
        return targetStepStates.map((step, index) => {
            if (index > animatedStepIndex) {
                return {
                    ...step,
                    status: "pending",
                    shortLabel: "Pending",
                };
            }

            if (index === animatedStepIndex && isRunning && targetAnimatedStepIndex > 0) {
                if (step.status === "pending") {
                    return {
                        ...step,
                        status: "success",
                        shortLabel: "Executing",
                    };
                }
            }

            return step;
        });
    }, [targetStepStates, animatedStepIndex, isRunning, targetAnimatedStepIndex]);

    useEffect(() => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        if (animatedStepIndex === targetAnimatedStepIndex) {
            return;
        }

        const direction = animatedStepIndex < targetAnimatedStepIndex ? 1 : -1;

        animationTimeoutRef.current = setTimeout(() => {
            setAnimatedStepIndex((prev) => prev + direction);
        }, isRunning ? 320 : 120);

        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [animatedStepIndex, targetAnimatedStepIndex, isRunning]);

    useEffect(() => {
        const activeStep = killChainSteps[animatedStepIndex] ?? killChainSteps[0];
        onActiveStepChange?.(activeStep.id);
    }, [animatedStepIndex, onActiveStepChange]);

    useEffect(() => {
        if (controlledSelectedStepId) return;

        const activeStep = killChainSteps[animatedStepIndex] ?? killChainSteps[0];
        onSelectedStepChange?.(activeStep.id);
    }, [animatedStepIndex, controlledSelectedStepId, onSelectedStepChange]);

    const selectedStep =
        renderedStepStates.find((step) => step.id === selectedStepId) ?? renderedStepStates[0];

    function handleStepSelect(stepId) {
        onSelectedStepChange?.(stepId);
    }

    return (
        <PanelCard variant="signal">
            <PanelHeader
                icon={<Link2 className="h-5 w-5 text-cyber-violet" />}
                title="Kill Chain Visualizer"
                subtitle="Clickable tactical stages with dynamic drilldown"
            />

            <div className="mt-5 overflow-x-auto pb-1">
                <div className="flex min-w-[980px] items-start gap-3">
                    {renderedStepStates.map((step, index) => {
                        const isSelected = selectedStepId === step.id;
                        const isAnimatedActive =
                            killChainSteps[animatedStepIndex]?.id === step.id;

                        return (
                            <div key={step.id} className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleStepSelect(step.id)}
                                    className={getStepClasses(
                                        step.status,
                                        isSelected,
                                        isRunning,
                                        isAnimatedActive
                                    )}
                                >
                                    <div
                                        className={`absolute inset-y-0 left-0 w-[3px] ${getStepRail(step.status)}`}
                                    />

                                    <div className="pl-2">
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="text-[10px] uppercase tracking-[0.22em] text-cyber-muted">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <StepIcon
                                                status={step.status}
                                                pulse={isRunning && isAnimatedActive}
                                            />
                                        </div>

                                        <p className="text-sm font-semibold text-cyber-text">
                                            {step.name}
                                        </p>
                                        <p className="mt-1 text-[11px] text-cyber-muted">
                                            {step.shortLabel}
                                        </p>
                                    </div>
                                </button>

                                {index < renderedStepStates.length - 1 && (
                                    <div
                                        className={`h-[2px] w-10 rounded-full ${getConnectorClasses(
                                            renderedStepStates[index].status,
                                            renderedStepStates[index + 1].status
                                        )}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-cyber-panel2">
                    <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(139,92,246,0.92),rgba(239,68,68,0.88))] transition-all duration-500"
                        style={{
                            width: `${((animatedStepIndex + 1) / killChainSteps.length) * 100}%`,
                        }}
                    />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-cyber-muted">
                    <span>{isRunning ? "Simulation in progress..." : "Chain ready"}</span>
                    <span>
                        {animatedStepIndex + 1} / {killChainSteps.length} completed
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <PanelCard
                    variant="hot"
                    className="p-5"
                    live={isRunning}
                    stress={isRunning}
                    scan={selectedStep.status === "missed" || selectedStep.status === "detected"}
                    hotLevel={
                        selectedStep.status === "missed"
                            ? "high"
                            : selectedStep.status === "detected"
                                ? "medium"
                                : "low"
                    }
                >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="rounded-md border border-cyber-violet/25 bg-cyber-violet/10 p-2.5">
                                    <ChevronRight className="h-5 w-5 text-cyber-violet" />
                                </div>

                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                        Drilldown
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-cyber-text">
                                        {selectedStep.name}
                                    </p>
                                    <p className="mt-1 text-sm text-cyber-muted">
                                        {selectedStep.short}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <StageStatusBadge status={selectedStep.status} />
                    </div>

                    <div className="mt-5">
                        <PanelCard
                            variant="signal"
                            dense
                            live={isRunning && selectedStep.status !== "pending"}
                            hotLevel={selectedStep.status === "pending" ? "none" : "low"}
                        >
                            <p className="text-sm leading-7 text-cyber-text">
                                {selectedStep.description}
                            </p>
                        </PanelCard>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <DetailBlock
                            variant="intel"
                            title="Technique / Mapping"
                            items={selectedStep.techniques}
                            icon={<Radar className="h-4 w-4 text-cyber-violet" />}
                        />

                        <DetailBlock
                            variant="defense"
                            title="Detection Context"
                            items={selectedStep.detections}
                            icon={<Eye className="h-4 w-4 text-cyber-green" />}
                        />

                        <DetailBlock
                            variant="threat"
                            title="Known Gaps / Risks"
                            items={selectedStep.gaps}
                            icon={<AlertTriangle className="h-4 w-4 text-cyber-red" />}
                        />

                        <DetailBlock
                            variant="signal"
                            title="Mitigations / Operator Notes"
                            items={selectedStep.mitigations}
                            icon={<Shield className="h-4 w-4 text-cyber-blue" />}
                        />
                    </div>

                    <div className="mt-5">
                        <PanelCard variant="intel" dense>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                Detection Insight
                            </p>
                            <p className="mt-3 text-sm leading-7 text-cyber-text">
                                {selectedStep.insight}
                            </p>
                        </PanelCard>
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Step UI
======================================== */

function StepIcon({ status, pulse = false }) {
    const pulseClass = pulse ? "animate-pulse" : "";

    if (status === "detected") {
        return <Eye className={`h-4 w-4 text-cyber-violet ${pulseClass}`} />;
    }

    if (status === "missed") {
        return <XCircle className={`h-4 w-4 text-cyber-red ${pulseClass}`} />;
    }

    if (status === "success") {
        return <CheckCircle2 className={`h-4 w-4 text-cyber-green ${pulseClass}`} />;
    }

    return <div className={`h-2.5 w-2.5 rounded-full bg-cyber-muted/50 ${pulseClass}`} />;
}

function StageStatusBadge({ status }) {
    const classes =
        status === "detected"
            ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
            : status === "missed"
                ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                : status === "success"
                    ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                    : "border-cyber-border bg-cyber-bgSoft text-cyber-muted";

    const label =
        status === "detected"
            ? "Detected"
            : status === "missed"
                ? "Missed"
                : status === "success"
                    ? "Executed"
                    : "Pending";

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${classes}`}
        >
            {status === "detected" ? (
                <Eye className="h-4 w-4" />
            ) : status === "missed" ? (
                <AlertTriangle className="h-4 w-4" />
            ) : (
                <ShieldCheck className="h-4 w-4" />
            )}
            {label}
        </span>
    );
}

function DetailBlock({ variant, title, items = [], icon = null }) {
    return (
        <PanelCard
            variant={variant}
            dense
            hotLevel={variant === "threat" ? "medium" : variant === "defense" ? "low" : "none"}
        >
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyber-muted">
                    {title}
                </p>
            </div>

            <div className="mt-3 space-y-2">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item}
                            className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2 text-sm text-cyber-text"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2 text-sm text-cyber-muted">
                        No additional context available
                    </div>
                )}
            </div>
        </PanelCard>
    );
}

function getStepClasses(status, isSelected, isRunning, isAnimatedActive) {
    const selectedRing = isSelected ? "ring-1 ring-white/10 scale-[1.02]" : "";
    const liveGlow = isRunning && isAnimatedActive ? "shadow-[0_0_26px_rgba(255,255,255,0.06)]" : "";
    const pulse = isRunning && isAnimatedActive ? "animate-pulse" : "";

    if (status === "detected") {
        return `relative overflow-hidden min-w-[122px] rounded-md border border-cyber-green/35 bg-[linear-gradient(180deg,rgba(8,40,24,0.34),rgba(8,12,10,0.90))] p-3 text-left transition-all duration-200 hover:bg-cyber-green/15 ${selectedRing} ${liveGlow} ${pulse}`;
    }

    if (status === "missed") {
        return `relative overflow-hidden min-w-[122px] rounded-md border border-cyber-red/35 bg-[linear-gradient(180deg,rgba(56,10,14,0.34),rgba(12,8,10,0.92))] p-3 text-left transition-all duration-200 hover:bg-cyber-red/15 ${selectedRing} ${liveGlow} ${pulse}`;
    }

    if (status === "success") {
        return `relative overflow-hidden min-w-[122px] rounded-md border border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(28,16,54,0.30),rgba(10,8,18,0.92))] p-3 text-left transition-all duration-200 hover:bg-cyber-violet/15 ${selectedRing} ${liveGlow} ${pulse}`;
    }

    return `relative overflow-hidden min-w-[122px] rounded-md border border-cyber-border bg-[linear-gradient(180deg,rgba(16,20,32,0.88),rgba(10,12,18,0.96))] p-3 text-left transition-all duration-200 hover:border-cyber-violet/20 ${selectedRing} ${liveGlow}`;
}

function getStepRail(status) {
    if (status === "detected") {
        return "bg-cyber-green shadow-[0_0_14px_rgba(34,197,94,0.45)]";
    }

    if (status === "missed") {
        return "bg-cyber-red shadow-[0_0_14px_rgba(239,68,68,0.45)]";
    }

    if (status === "success") {
        return "bg-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.42)]";
    }

    return "bg-white/10";
}

function getConnectorClasses(currentStatus, nextStatus) {
    if (currentStatus !== "pending" && nextStatus !== "pending") {
        return "bg-cyber-violet/50";
    }

    if (currentStatus !== "pending" && nextStatus === "pending") {
        return "bg-[linear-gradient(90deg,rgba(139,92,246,0.55),rgba(51,65,85,0.6))]";
    }

    return "bg-cyber-border";
}

/* ========================================
   🧠 State Builder
======================================== */

function buildKillChainState(displayedEvents, visibleStatus, selectedScenario) {
    const eventCount = displayedEvents.length;

    return killChainSteps.map((step, index) => {
        const threshold = Math.ceil(((index + 1) / killChainSteps.length) * Math.max(eventCount, 1));
        const progressed = eventCount >= threshold;

        let status = "pending";
        let shortLabel = "Pending";

        if (progressed) {
            if (index < killChainSteps.length - 1) {
                status = "success";
                shortLabel = "Executed";
            } else if (visibleStatus === "Detected") {
                status = "detected";
                shortLabel = "Detected";
            } else if (visibleStatus === "Missed") {
                status = "missed";
                shortLabel = "Missed";
            } else if (visibleStatus === "Partially Detected") {
                status = "success";
                shortLabel = "Partial visibility";
            } else {
                status = "success";
                shortLabel = "In progress";
            }
        }

        return {
            ...step,
            status,
            shortLabel,
            description: buildStepDescription(step, selectedScenario),
            techniques: buildStepTechniques(step, selectedScenario),
            detections: buildStepDetections(step, selectedScenario),
            gaps: buildStepGaps(step, selectedScenario),
            mitigations: buildStepMitigations(step, selectedScenario),
            insight: buildStepInsight(step, status, visibleStatus, selectedScenario),
        };
    });
}

/* ========================================
   🧠 Scenario Mapping
======================================== */

function buildStepDescription(step, scenario) {
    if (!scenario) return step.defaultDescription;

    switch (step.id) {
        case "recon":
            return `Recon phase for ${scenario.name}. This scenario is aligned with ${scenario.tactic} and begins with the attacker establishing visibility, timing and target assumptions before pressure increases.`;
        case "weaponize":
            return `Weaponization for ${scenario.name}. The attacker prepares capability or access flow related to ${scenario.technique} before active delivery into the environment.`;
        case "deliver":
            return `Delivery for ${scenario.name}. Initial hostile interaction reaches the target path and starts producing telemetry that may later become detectable.`;
        case "exploit":
            return `Exploit phase for ${scenario.name}. This stage reflects active offensive execution, abuse or hostile behavior tied to the selected scenario objective.`;
        case "install":
            return `Install phase for ${scenario.name}. Persistence, tooling or attack foothold may become durable depending on the scenario and defensive visibility.`;
        case "c2":
            return `Command and control for ${scenario.name}. This stage represents sustained adversary control, remote signaling or active attacker coordination.`;
        case "actions":
            return `Final operational actions for ${scenario.name}. This stage is where the scenario outcome becomes measurable through detection, coverage and validation.`;
        default:
            return step.defaultDescription;
    }
}

function buildStepTechniques(step, scenario) {
    if (!scenario) return [];

    const items = [];

    if (scenario.technique) {
        items.push(`${scenario.technique} — ${scenario.name}`);
    }

    if (scenario.tactic) {
        items.push(`Tactic — ${scenario.tactic}`);
    }

    if (step.id === "actions" && scenario.severity) {
        items.push(`Severity — ${scenario.severity}`);
    }

    return items;
}

function buildStepDetections(step, scenario) {
    if (!scenario?.detections?.length) return [];

    if (step.id === "recon") {
        return scenario.detections.slice(0, 2);
    }

    if (step.id === "actions") {
        return scenario.detections.slice(0, 3);
    }

    return scenario.detections.slice(0, 2);
}

function buildStepGaps(step, scenario) {
    if (!scenario?.gaps?.length) return [];

    if (step.id === "actions" || step.id === "exploit" || step.id === "c2") {
        return scenario.gaps.slice(0, 3);
    }

    return scenario.gaps.slice(0, 2);
}

function buildStepMitigations(step, scenario) {
    if (!scenario?.recommendations?.length) return [];

    if (step.id === "actions") {
        return scenario.recommendations.slice(0, 3);
    }

    return scenario.recommendations.slice(0, 2);
}

function buildStepInsight(step, status, visibleStatus, scenario) {
    if (!scenario) {
        return `${step.name} has no active scenario context yet. Start a scenario or campaign to populate the chain.`;
    }

    if (status === "detected") {
        return `${step.name} has reached a detected state for ${scenario.name}. Blue-side visibility is strong enough at this phase to register meaningful coverage against ${scenario.technique}.`;
    }

    if (status === "missed") {
        return `${step.name} appears under-covered for ${scenario.name}. The scenario currently trends toward a missed state, which suggests detection tuning or visibility depth is insufficient.`;
    }

    if (status === "success") {
        return `${step.name} has executed for ${scenario.name}. The chain is progressing, and the current result should be correlated with detections, logs and topology focus.`;
    }

    return `${step.name} has not been reached yet for ${scenario.name}. Continue the run to populate this stage and validate detection behavior.`;
}