import { useMemo, useState } from "react";
import {
    AlertTriangle,
    Shield,
    Radar,
    Activity,
    Server,
    User,
    Globe,
    CheckCircle2,
    SearchCheck,
    ShieldAlert,
    Sparkles,
    NotebookPen,
    Siren,
    CircleDot,
    Bug,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";
import MetricBar from "../ui/MetricBar";

/* ========================================
   🧠 Incident Investigation Board V2
======================================== */

const ANALYST_DISPOSITIONS = [
    { id: "true_positive", label: "True Positive", variant: "defense" },
    { id: "needs_tuning", label: "Needs Tuning", variant: "intel" },
    { id: "escalate", label: "Escalate", variant: "hot" },
    { id: "benign", label: "Benign / Noise", variant: "signal" },
];

export default function IncidentInvestigationBoardV2({
    alert = null,
    selectedScenario = null,
    activeControls = [],
    visibleStatus = "In Progress",
    coverage = 0,
}) {
    const [analystDisposition, setAnalystDisposition] = useState("needs_tuning");
    const [analystNote, setAnalystNote] = useState("");
    const [selectedHypothesis, setSelectedHypothesis] = useState(0);

    const incidentModel = useMemo(() => {
        if (!alert) return null;

        return buildIncidentModel({
            alert,
            selectedScenario,
            visibleStatus,
            coverage,
            activeControls,
        });
    }, [alert, selectedScenario, visibleStatus, coverage, activeControls]);

    if (!alert || !incidentModel) {
        return (
            <PanelCard variant="defense">
                <PanelHeader
                    icon={<Shield className="h-5 w-5 text-cyber-blue" />}
                    title="Incident Investigation Board"
                    subtitle="Analyst cockpit for correlated investigation"
                />

                <div className="mt-4">
                    <PanelCard variant="glass" className="border-dashed">
                        <EmptyState
                            compact
                            icon={<SearchCheck className="h-6 w-6" />}
                            title="No incident selected"
                            description="Select an alert from the triage queue to inspect correlated activity, assess signal quality and define an analyst disposition."
                        />
                    </PanelCard>
                </div>
            </PanelCard>
        );
    }

    const {
        confidence,
        actionability,
        noiseRisk,
        severity,
        triageStatus,
        timeline,
        entities,
        assessment,
        nextActions,
        hypotheses,
        quickInsight,
    } = incidentModel;

    const activeHypothesis = hypotheses[selectedHypothesis] ?? hypotheses[0];

    return (
        <PanelCard variant="defense" glow>
            <PanelHeader
                icon={<Shield className="h-5 w-5 text-cyber-blue" />}
                title="Incident Investigation Board"
                subtitle="Correlated analyst workflow for the selected incident"
            />

            <div className="mt-4 space-y-4">
                {/* ========================================
                   🚨 Incident Header
                ========================================= */}
                <PanelCard
                    variant={severity === "high" ? "hot" : "defense"}
                    className="p-5"
                    live
                    hotLevel={severity === "high" ? "high" : "medium"}
                >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge kind="severity" value={alert.severity ?? "medium"} />
                                <span className="rounded-lg border border-cyber-border bg-black/10 px-3 py-1 text-[11px] font-semibold tracking-[0.02em] text-cyber-muted">
                                    {alert.source ?? "siem"}
                                </span>
                                <span className="rounded-lg border border-cyber-border bg-black/10 px-3 py-1 text-[11px] font-semibold tracking-[0.02em] text-cyber-muted">
                                    {triageStatus}
                                </span>
                            </div>

                            <h3 className="mt-3 text-xl font-bold tracking-[-0.02em] text-cyber-text">
                                {alert.title ?? "Detection alert"}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-7 text-cyber-muted">
                                {alert.message ??
                                    "Suspicious activity has been surfaced by the defensive stack and requires analyst validation."}
                            </p>
                        </div>

                        <div className="grid min-w-[260px] grid-cols-2 gap-3">
                            <HeaderMetric
                                label="Confidence"
                                value={`${confidence}%`}
                                tone={confidence >= 75 ? "text-cyber-green" : confidence >= 45 ? "text-cyber-amber" : "text-cyber-red"}
                            />
                            <HeaderMetric
                                label="Actionability"
                                value={`${actionability}%`}
                                tone={actionability >= 70 ? "text-cyber-green" : actionability >= 45 ? "text-cyber-amber" : "text-cyber-red"}
                            />
                            <HeaderMetric
                                label="Noise Risk"
                                value={`${noiseRisk}%`}
                                tone={noiseRisk >= 65 ? "text-cyber-red" : noiseRisk >= 40 ? "text-cyber-amber" : "text-cyber-green"}
                            />
                            <HeaderMetric
                                label="Coverage"
                                value={`${coverage}%`}
                                tone="text-cyber-blue"
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <MetricStrip label="Incident confidence" value={confidence} tone="auto" />
                        <MetricStrip label="Analyst actionability" value={actionability} tone="violet" />
                        <MetricStrip label="Noise / ambiguity" value={noiseRisk} tone="red" />
                    </div>
                </PanelCard>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_380px]">
                    <div className="space-y-4">
                        {/* ========================================
                           🕒 Correlated Timeline
                        ========================================= */}
                        <PanelCard variant="signal">
                            <PanelHeader
                                icon={<Activity className="h-5 w-5 text-cyber-blue" />}
                                title="Correlated Timeline"
                                subtitle="Related activity reconstructed around the selected alert"
                            />

                            <div className="mt-4 space-y-3">
                                {timeline.map((item, index) => (
                                    <TimelineEvent key={`${item.title}-${index}`} item={item} />
                                ))}
                            </div>
                        </PanelCard>

                        {/* ========================================
                           🧪 Detection Assessment
                        ========================================= */}
                        <PanelCard variant="intel">
                            <PanelHeader
                                icon={<Radar className="h-5 w-5 text-cyber-violet" />}
                                title="Detection Assessment"
                                subtitle="Signal quality, gaps and investigation relevance"
                            />

                            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <AssessmentBlock
                                    variant="defense"
                                    title="Analyst Read"
                                    items={assessment.analystRead}
                                />
                                <AssessmentBlock
                                    variant="threat"
                                    title="Weaknesses / Gaps"
                                    items={assessment.gaps}
                                />
                                <AssessmentBlock
                                    variant="signal"
                                    title="Active Controls"
                                    items={assessment.controls}
                                />
                                <AssessmentBlock
                                    variant="intel"
                                    title="MITRE / Scenario Context"
                                    items={assessment.context}
                                />
                            </div>
                        </PanelCard>

                        {/* ========================================
                           🧠 Analyst Hypotheses
                        ========================================= */}
                        <PanelCard variant="intel">
                            <PanelHeader
                                icon={<Bug className="h-5 w-5 text-cyber-violet" />}
                                title="Investigation Hypotheses"
                                subtitle="Mock analyst paths to test during triage"
                            />

                            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                                <div className="space-y-2">
                                    {hypotheses.map((hypothesis, index) => {
                                        const active = index === selectedHypothesis;

                                        return (
                                            <button
                                                key={hypothesis.title}
                                                onClick={() => setSelectedHypothesis(index)}
                                                className={[
                                                    "w-full rounded-xl border p-3 text-left transition-all duration-200",
                                                    active
                                                        ? "border-cyber-violet/30 bg-cyber-violet/10 text-white"
                                                        : "border-cyber-border bg-cyber-panel2 text-cyber-muted hover:border-cyber-violet/20 hover:text-white",
                                                ].join(" ")}
                                            >
                                                <p className="text-sm font-semibold">
                                                    {hypothesis.title}
                                                </p>
                                                <p className="mt-1 text-xs leading-5">
                                                    {hypothesis.summary}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <PanelCard variant="signal" dense>
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                                        Active hypothesis
                                    </p>
                                    <p className="mt-3 text-sm font-semibold text-cyber-text">
                                        {activeHypothesis.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-cyber-muted">
                                        {activeHypothesis.details}
                                    </p>
                                </PanelCard>
                            </div>
                        </PanelCard>
                    </div>

                    <div className="space-y-4">
                        {/* ========================================
                           🌐 Entities / Scope
                        ========================================= */}
                        <PanelCard variant="signal">
                            <PanelHeader
                                icon={<Server className="h-5 w-5 text-cyber-blue" />}
                                title="Entities & Scope"
                                subtitle="Assets and identities likely involved"
                            />

                            <div className="mt-4 space-y-3">
                                <EntityRow
                                    icon={<User className="h-4 w-4 text-cyber-violet" />}
                                    label="User"
                                    value={entities.user}
                                />
                                <EntityRow
                                    icon={<Server className="h-4 w-4 text-cyber-blue" />}
                                    label="Host / Asset"
                                    value={entities.host}
                                />
                                <EntityRow
                                    icon={<Globe className="h-4 w-4 text-cyber-amber" />}
                                    label="Source"
                                    value={entities.source}
                                />
                                <EntityRow
                                    icon={<Radar className="h-4 w-4 text-cyber-green" />}
                                    label="Technique"
                                    value={entities.technique}
                                />
                                <EntityRow
                                    icon={<Shield className="h-4 w-4 text-cyber-violet" />}
                                    label="Scenario"
                                    value={entities.scenario}
                                />
                            </div>
                        </PanelCard>

                        {/* ========================================
                           ✅ Recommended Next Actions
                        ========================================= */}
                        <PanelCard variant="defense">
                            <PanelHeader
                                icon={<CheckCircle2 className="h-5 w-5 text-cyber-green" />}
                                title="Recommended Next Actions"
                                subtitle="Suggested analyst follow-up for the incident"
                            />

                            <div className="mt-4 space-y-2">
                                {nextActions.map((action) => (
                                    <div
                                        key={action}
                                        className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-3 text-sm leading-6 text-cyber-text"
                                    >
                                        {action}
                                    </div>
                                ))}
                            </div>
                        </PanelCard>

                        {/* ========================================
                           🧑‍💼 Analyst Workbench
                        ========================================= */}
                        <PanelCard variant="hot" hotLevel="medium">
                            <PanelHeader
                                icon={<NotebookPen className="h-5 w-5 text-cyber-violet" />}
                                title="Analyst Workbench"
                                subtitle="Mock triage actions and final disposition"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {ANALYST_DISPOSITIONS.map((item) => {
                                    const active = analystDisposition === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setAnalystDisposition(item.id)}
                                            className={[
                                                "rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200",
                                                active
                                                    ? getDispositionActiveClass(item.variant)
                                                    : "border-cyber-border bg-cyber-panel2 text-cyber-text hover:border-cyber-violet/20",
                                            ].join(" ")}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 rounded-xl border border-cyber-border bg-black/10 p-3">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                                    Analyst note
                                </p>
                                <textarea
                                    value={analystNote}
                                    onChange={(event) => setAnalystNote(event.target.value)}
                                    placeholder="Write a quick analyst note, finding or escalation rationale..."
                                    className="mt-3 min-h-[110px] w-full resize-none rounded-xl border border-cyber-border bg-cyber-panel px-3 py-2 text-sm leading-6 text-cyber-text outline-none transition focus:border-cyber-violet/30"
                                />
                            </div>
                        </PanelCard>

                        {/* ========================================
                           🤖 Quick Analyst Insight
                        ========================================= */}
                        <PanelCard variant="intel">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 p-2">
                                    <Sparkles className="h-4 w-4 text-cyber-violet" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                        Quick Insight
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-cyber-text">
                                        {quickInsight}
                                    </p>
                                </div>
                            </div>
                        </PanelCard>
                    </div>
                </div>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function HeaderMetric({ label, value, tone = "text-cyber-text" }) {
    return (
        <div className="rounded-xl border border-cyber-border bg-black/10 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                {label}
            </p>
            <p className={`mt-2 text-sm font-semibold break-words ${tone}`}>
                {value}
            </p>
        </div>
    );
}

function MetricStrip({ label, value, tone = "auto" }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-xs text-cyber-muted">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <MetricBar value={value} showValue={false} size="sm" tone={tone} />
        </div>
    );
}

function TimelineEvent({ item }) {
    return (
        <div className="relative rounded-xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className={`absolute inset-y-0 left-0 w-[3px] ${getTimelineRail(item.type)}`} />

            <div className="pl-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-cyber-text">
                            {item.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">
                            {item.type}
                        </p>
                    </div>

                    <span className="text-xs text-cyber-muted">
                        {item.time}
                    </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-cyber-muted">
                    {item.message}
                </p>
            </div>
        </div>
    );
}

function EntityRow({ icon, label, value }) {
    return (
        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-3">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[11px] uppercase tracking-[0.16em] text-cyber-muted">
                    {label}
                </span>
            </div>

            <p className="mt-2 text-sm font-medium break-words text-cyber-text">
                {value}
            </p>
        </div>
    );
}

function AssessmentBlock({ variant = "signal", title, items = [] }) {
    return (
        <PanelCard variant={variant} dense>
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                {title}
            </p>

            <div className="mt-3 space-y-2">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item}
                            className="rounded-lg border border-white/[0.06] bg-black/10 px-3 py-2 text-sm leading-6 text-cyber-text"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border border-white/[0.06] bg-black/10 px-3 py-2 text-sm text-cyber-muted">
                        No context available
                    </div>
                )}
            </div>
        </PanelCard>
    );
}

function getDispositionActiveClass(variant) {
    if (variant === "defense") {
        return "border-cyber-green/30 bg-cyber-green/10 text-cyber-green";
    }

    if (variant === "hot") {
        return "border-cyber-red/30 bg-cyber-red/10 text-cyber-red";
    }

    if (variant === "intel") {
        return "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet";
    }

    return "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";
}

/* ========================================
   🧠 Derived Data
======================================== */

function buildIncidentModel({
    alert,
    selectedScenario,
    visibleStatus,
    coverage,
    activeControls,
}) {
    const severity = normalizeSeverity(alert?.severity);
    const triageStatus = normalizeTriageStatus(alert?.triageStatus);

    const confidence = computeIncidentConfidence({
        alert,
        visibleStatus,
        coverage,
        activeControls,
    });

    const actionability = computeActionability({
        visibleStatus,
        coverage,
        activeControls,
        selectedScenario,
    });

    const noiseRisk = computeNoiseRisk({
        alert,
        visibleStatus,
        activeControls,
        selectedScenario,
    });

    return {
        confidence,
        actionability,
        noiseRisk,
        severity,
        triageStatus,
        timeline: buildCorrelatedTimeline(alert, selectedScenario),
        entities: buildIncidentEntities(alert, selectedScenario),
        assessment: buildDetectionAssessment({
            alert,
            selectedScenario,
            visibleStatus,
            coverage,
            activeControls,
            confidence,
            actionability,
            noiseRisk,
        }),
        nextActions: buildNextActions({
            alert,
            selectedScenario,
            visibleStatus,
            coverage,
            activeControls,
        }),
        hypotheses: buildHypotheses({ alert, selectedScenario, visibleStatus }),
        quickInsight: buildQuickInsight({
            selectedScenario,
            visibleStatus,
            confidence,
            actionability,
            noiseRisk,
        }),
    };
}

function computeIncidentConfidence({
    alert,
    visibleStatus,
    coverage,
    activeControls,
}) {
    let score = 25;
    const severity = normalizeSeverity(alert?.severity);

    if (severity === "high") score += 25;
    else if (severity === "medium") score += 15;
    else score += 8;

    if (visibleStatus === "Detected") score += 20;
    else if (visibleStatus === "Partially Detected") score += 10;

    score += Math.round((coverage ?? 0) * 0.2);
    score += Math.min(activeControls.length * 4, 16);

    return clamp(score);
}

function computeActionability({
    visibleStatus,
    coverage,
    activeControls,
    selectedScenario,
}) {
    let score = 20;

    if (visibleStatus === "Detected") score += 30;
    else if (visibleStatus === "Partially Detected") score += 18;
    else score += 8;

    score += Math.round((coverage ?? 0) * 0.18);
    score += Math.min(activeControls.length * 5, 20);

    if (selectedScenario?.detections?.length) {
        score += Math.min(selectedScenario.detections.length * 5, 15);
    }

    return clamp(score);
}

function computeNoiseRisk({
    alert,
    visibleStatus,
    activeControls,
    selectedScenario,
}) {
    let score = 42;

    if (visibleStatus === "Detected") score -= 12;
    if (visibleStatus === "Missed") score += 14;

    if ((selectedScenario?.gaps?.length ?? 0) > 1) score += 10;
    if (activeControls.includes("SIEM")) score -= 8;
    if (activeControls.includes("EDR")) score -= 6;

    if (/low confidence/i.test(alert?.message ?? "")) score += 12;
    if (/partial/i.test(alert?.message ?? "")) score += 8;

    return clamp(score);
}

function buildCorrelatedTimeline(alert, selectedScenario) {
    const scenarioEvents = Array.isArray(selectedScenario?.events)
        ? selectedScenario.events
        : [];

    const fallback = [
        {
            time: "T-02m",
            type: "log",
            title: "Telemetry correlation",
            message: "Relevant telemetry started accumulating around the suspicious activity window.",
        },
        {
            time: "T-01m",
            type: "attack",
            title: "Suspicious behavior",
            message: alert?.message ?? "Potential malicious activity was observed in the environment.",
        },
        {
            time: "T+00m",
            type: "alert",
            title: alert?.title ?? "Detection alert",
            message: "The defensive stack escalated the activity into an analyst-facing signal.",
        },
    ];

    if (!scenarioEvents.length) {
        return fallback;
    }

    const mappedEvents = scenarioEvents.slice(0, 5).map((event) => ({
        time: event.time,
        type: event.type,
        title: event.title,
        message: event.message,
    }));

    const hasAlertEvent = mappedEvents.some((event) => event.type === "alert");

    if (!hasAlertEvent) {
        mappedEvents.push({
            time: "current",
            type: "alert",
            title: alert?.title ?? "Detection alert",
            message: alert?.message ?? "Alert created from correlated scenario activity.",
        });
    }

    return mappedEvents;
}

function buildIncidentEntities(alert, selectedScenario) {
    return {
        user: extractUser(alert, selectedScenario),
        host: extractHost(alert, selectedScenario),
        source: extractSource(alert, selectedScenario),
        technique: selectedScenario?.technique ?? "Unknown technique",
        scenario: selectedScenario?.name ?? "Unmapped scenario",
    };
}

function buildDetectionAssessment({
    alert,
    selectedScenario,
    visibleStatus,
    coverage,
    activeControls,
    confidence,
    actionability,
    noiseRisk,
}) {
    const controlsText =
        activeControls.length > 0 ? activeControls.join(", ") : "No active controls";

    return {
        analystRead: [
            `Incident confidence is ${confidence}% and actionability is ${actionability}%, which means the signal is ${actionability >= 70 ? "strong enough for confident analyst workflow" : actionability >= 45 ? "useful but incomplete" : "informative but still weak"
            }.`,
            `Analyst-visible status is ${visibleStatus}, while noise risk sits at ${noiseRisk}%.`,
        ],
        gaps: [
            selectedScenario?.gaps?.[0] ?? "Additional enrichment may be needed to improve investigation depth.",
            selectedScenario?.gaps?.[1] ?? "Correlation quality may still be incomplete for full incident confidence.",
        ],
        controls: [
            controlsText,
            activeControls.length > 0
                ? "Active controls are contributing to visibility and triage confidence."
                : "Detection quality is likely constrained by limited active controls.",
        ],
        context: [
            `Scenario: ${selectedScenario?.name ?? "Unknown scenario"}`,
            `Technique: ${selectedScenario?.technique ?? "N/A"}`,
            `Source: ${alert?.source ?? "siem"}`,
            `Coverage: ${coverage}%`,
        ],
    };
}

function buildNextActions({
    alert,
    selectedScenario,
    visibleStatus,
    coverage,
    activeControls,
}) {
    const actions = [
        `Validate whether "${alert?.title ?? "this alert"}" aligns with the surrounding timeline and expected scenario behavior.`,
        `Review the mapped technique (${selectedScenario?.technique ?? "N/A"}) and confirm whether the signal supports the expected attack path.`,
    ];

    if (visibleStatus !== "Detected") {
        actions.push("Tune correlation or detection logic to improve confidence and reduce partial visibility.");
    }

    if ((coverage ?? 0) < 60) {
        actions.push("Improve telemetry depth or enable additional controls to raise coverage on similar incidents.");
    }

    if (!activeControls.includes("EDR")) {
        actions.push("Strengthen endpoint visibility to improve host-side investigation fidelity.");
    }

    if (!activeControls.includes("SIEM")) {
        actions.push("Improve SIEM-style correlation so isolated events become stronger incidents.");
    }

    return actions.slice(0, 5);
}

function buildHypotheses({ alert, selectedScenario, visibleStatus }) {
    return [
        {
            title: "Confirmed malicious chain",
            summary: "Signal aligns with expected attack flow.",
            details: `The alert, correlated timeline and selected scenario (${selectedScenario?.name ?? "unknown"}) suggest the incident is consistent with the simulated chain and should likely be treated as a meaningful signal.`,
        },
        {
            title: "Partial but useful visibility",
            summary: "Alert is valid, context is incomplete.",
            details: `The environment may be surfacing a valid signal, but supporting telemetry is incomplete. This often maps to ${visibleStatus} states where analysts can investigate but not confidently conclude end-to-end detection maturity.`,
        },
        {
            title: "Noisy detection path",
            summary: "Signal exists but confidence may be inflated.",
            details: `The incident may still contain useful behavior, but weak enrichment, low control depth or broad correlation could make the alert harder to trust operationally without more validation.`,
        },
    ];
}

function buildQuickInsight({
    selectedScenario,
    visibleStatus,
    confidence,
    actionability,
    noiseRisk,
}) {
    if (visibleStatus === "Detected" && confidence >= 70 && actionability >= 65) {
        return `This incident looks investigation-ready. The scenario context (${selectedScenario?.name ?? "unknown"}) aligns well with the current signal, and the board suggests the analyst can move from triage into decision-making quickly.`;
    }

    if (visibleStatus === "Partially Detected" || noiseRisk >= 55) {
        return `This incident is promising but still ambiguous. The signal is valuable enough to review, yet the current combination of coverage, context depth and noise risk suggests further tuning or correlation would improve analyst confidence.`;
    }

    return `This incident should be treated as both an alert and a detection-quality indicator. The signal may be useful, but it also highlights where the defensive stack remains underpowered or under-correlated for this scenario.`;
}

/* ========================================
   🧠 Extraction Helpers
======================================== */

function extractUser(alert, selectedScenario) {
    const raw = `${alert?.title ?? ""} ${alert?.message ?? ""} ${selectedScenario?.summary ?? ""}`;

    if (/admin/i.test(raw)) return "admin";
    if (/privileged/i.test(raw)) return "privileged account";
    return "unknown user";
}

function extractHost(alert, selectedScenario) {
    const raw = `${alert?.title ?? ""} ${alert?.message ?? ""} ${selectedScenario?.summary ?? ""}`;

    if (/ws-?07/i.test(raw)) return "WS-07";
    if (/endpoint/i.test(raw)) return "user endpoint";
    if (/server/i.test(raw)) return "application server";
    if (/database|archive|data/i.test(raw)) return "database / data tier";
    return "unknown asset";
}

function extractSource(alert, selectedScenario) {
    const raw = `${alert?.title ?? ""} ${alert?.message ?? ""} ${selectedScenario?.summary ?? ""}`;

    if (/10\.\d+\.\d+\.\d+/.test(raw)) {
        return raw.match(/10\.\d+\.\d+\.\d+/)?.[0] ?? "internal source";
    }

    if (/172\.\d+\.\d+\.\d+/.test(raw)) {
        return raw.match(/172\.\d+\.\d+\.\d+/)?.[0] ?? "internal source";
    }

    if (/185\.\d+\.\d+\.\w+/i.test(raw)) {
        return raw.match(/185\.\d+\.\d+\.\w+/i)?.[0] ?? "external source";
    }

    if (/external/i.test(raw)) return "external source";
    if (/internal/i.test(raw)) return "internal source";

    return "unknown source";
}

/* ========================================
   🧠 Utils
======================================== */

function normalizeSeverity(value) {
    const severity = String(value ?? "medium").toLowerCase();
    return severity === "high" || severity === "critical"
        ? "high"
        : severity === "low"
            ? "low"
            : "medium";
}

function normalizeTriageStatus(value) {
    return String(value ?? "open")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function getTimelineRail(type) {
    if (type === "attack") {
        return "bg-cyber-red shadow-[0_0_12px_rgba(239,68,68,0.35)]";
    }

    if (type === "alert") {
        return "bg-cyber-blue shadow-[0_0_12px_rgba(59,130,246,0.35)]";
    }

    if (type === "purple") {
        return "bg-cyber-violet shadow-[0_0_12px_rgba(139,92,246,0.35)]";
    }

    return "bg-cyber-green shadow-[0_0_12px_rgba(34,197,94,0.30)]";
}