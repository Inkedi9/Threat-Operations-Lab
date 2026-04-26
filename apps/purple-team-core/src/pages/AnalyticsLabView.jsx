import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    Radar,
    Shield,
    AlertTriangle,
    Activity,
    Sparkles,
    Crosshair,
    SearchCheck,
    ShieldCheck,
    BookOpenText,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    ZAxis,
} from "recharts";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";
import MetricCard from "../components/ui/MetricCard";

/* ========================================
   📊 Analytics Lab View
======================================== */

export default function AnalyticsLabView({
    sessions = [],
    scenarios = [],
    metrics = null,
    activeAlerts = [],
    visibleStatus = "In Progress",
    coverage = 0,
    controls = {},
    setActiveView,
    setSelectedScenarioId,
    setRulesLabFocus,
}) {
    const coverageTrend = useMemo(
        () => buildCoverageTrend(sessions, metrics, coverage),
        [sessions, metrics, coverage]
    );

    const statusBreakdown = useMemo(
        () => buildStatusBreakdown(scenarios),
        [scenarios]
    );

    const controlEffectiveness = useMemo(
        () => buildControlEffectiveness(scenarios, controls, coverage),
        [scenarios, controls, coverage]
    );

    const scenarioScatter = useMemo(
        () => buildScenarioScatter(scenarios),
        [scenarios]
    );

    const mitreMatrix = useMemo(
        () => buildMitreMatrix(scenarios),
        [scenarios]
    );

    const runComparison = useMemo(() => {
        return buildRunComparison(sessions, metrics, activeAlerts, coverage);
    }, [sessions, metrics, activeAlerts, coverage]);

    const [selectedMitreKey, setSelectedMitreKey] = useState(null);

    useEffect(() => {
        if (!mitreMatrix.length) {
            setSelectedMitreKey(null);
            return;
        }

        const firstRow = mitreMatrix[0];
        const firstItem = firstRow?.items?.[0];

        if (firstItem && !selectedMitreKey) {
            setSelectedMitreKey(`${firstRow.tactic}__${firstItem.technique}`);
        }
    }, [mitreMatrix, selectedMitreKey]);

    const selectedMitreCell = useMemo(() => {
        if (!selectedMitreKey) return null;

        for (const row of mitreMatrix) {
            for (const item of row.items) {
                const key = `${row.tactic}__${item.technique}`;
                if (key === selectedMitreKey) {
                    return {
                        tactic: row.tactic,
                        ...item,
                    };
                }
            }
        }

        return null;
    }, [mitreMatrix, selectedMitreKey]);

    const headerStats = [
        {
            label: "Coverage",
            value: `${coverage}%`,
            icon: <Shield className="h-4 w-4 text-cyber-green" />,
        },
        {
            label: "Alerts",
            value: activeAlerts.length,
            icon: <AlertTriangle className="h-4 w-4 text-cyber-amber" />,
        },
        {
            label: "Runs",
            value: coverageTrend.length,
            icon: <Activity className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Status",
            value: visibleStatus,
            icon: <Sparkles className="h-4 w-4 text-cyber-violet" />,
        },
    ];

    return (
        <PageShell
            header={
                <PageHeader
                    eyebrow="DETECTION INTELLIGENCE"
                    title="Analytics Lab"
                    description="Analyze coverage trends, control effectiveness, scenario performance and MITRE-aligned visibility through a dedicated premium analytics workspace."
                    stats={headerStats}
                />
            }
            left={
                <div className="space-y-4">
                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<BarChart3 className="h-5 w-5 text-cyber-violet" />}
                            title="Analytics Snapshot"
                            subtitle="High-level detection intelligence summary"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <MetricCard
                                label="Coverage"
                                value={`${coverage}%`}
                                variant="defense"
                                accent="green"
                                tone="text-cyber-green"
                            />
                            <MetricCard
                                label="Open Alerts"
                                value={activeAlerts.length}
                                variant="threat"
                                accent="red"
                                tone="text-cyber-red"
                            />
                            <MetricCard
                                label="Scenarios"
                                value={scenarios.length}
                                variant="signal"
                                accent="blue"
                            />
                            <MetricCard
                                label="Momentum"
                                value={`${metrics?.momentum ?? 0}%`}
                                variant="intel"
                                accent="violet"
                            />
                        </div>
                    </PanelCard>

                    <CompareRunsPanel comparison={runComparison} />

                    <PanelCard variant="defense">
                        <PanelHeader
                            icon={<ShieldCheck className="h-5 w-5 text-cyber-green" />}
                            title="Top Performing Areas"
                            subtitle="Where coverage is strongest right now"
                        />

                        <div className="mt-4 space-y-2">
                            {getTopCoverageScenarios(scenarios).map((item) => (
                                <InfoRow
                                    key={item.name}
                                    label={item.name}
                                    value={`${item.coverage}%`}
                                    tone="text-cyber-green"
                                />
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="threat">
                        <PanelHeader
                            icon={<AlertTriangle className="h-5 w-5 text-cyber-red" />}
                            title="Weakest Coverage Areas"
                            subtitle="Scenarios and techniques needing tuning"
                        />

                        <div className="mt-4 space-y-2">
                            {getWeakCoverageScenarios(scenarios).map((item) => (
                                <InfoRow
                                    key={item.name}
                                    label={`${item.name} • ${item.technique}`}
                                    value={`${item.coverage}%`}
                                    tone="text-cyber-red"
                                />
                            ))}
                        </div>
                    </PanelCard>
                </div>

            }
            center={
                <div className="space-y-4">
                    <ChartPanel
                        variant="signal"
                        icon={<Activity className="h-5 w-5 text-cyber-blue" />}
                        title="Coverage Trend"
                        subtitle="Coverage evolution across recent runs"
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={coverageTrend}>
                                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="label"
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CyberTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="coverage"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartPanel>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <ControlEffectivenessPanel data={controlEffectiveness} />

                        <DetectionOutcomePanel data={statusBreakdown} />
                    </div>

                    <ChartPanel
                        variant="intel"
                        icon={<Sparkles className="h-5 w-5 text-cyber-violet" />}
                        title="Scenario Risk vs Detection Quality"
                        subtitle="Severity pressure mapped against scenario coverage"
                    >
                        <ResponsiveContainer width="100%" height={320}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    type="number"
                                    dataKey="risk"
                                    name="Risk"
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="coverage"
                                    name="Coverage"
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ZAxis type="number" dataKey="size" range={[80, 320]} />
                                <Tooltip content={<CyberTooltip />} />
                                <Scatter data={scenarioScatter} fill="#8b5cf6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartPanel>

                    <PanelCard variant="intel" glow>
                        <PanelHeader
                            icon={<Radar className="h-5 w-5 text-cyber-violet" />}
                            title="MITRE Coverage Matrix"
                            subtitle="Clickable tactics and techniques with drilldown by scenario"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-3">
                                {mitreMatrix.map((row) => (
                                    <div
                                        key={row.tactic}
                                        className="rounded-xl border border-cyber-border bg-cyber-panel2 p-3"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-cyber-text">
                                                {row.tactic}
                                            </p>
                                            <span className="text-xs text-cyber-muted">
                                                {row.items.length} techniques
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {row.items.map((item) => {
                                                const key = `${row.tactic}__${item.technique}`;
                                                const active = key === selectedMitreKey;

                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => setSelectedMitreKey(key)}
                                                        className={[
                                                            "rounded-lg border px-3 py-2 text-left text-[11px] font-semibold transition-all duration-200",
                                                            getMitreChipClass(item.status),
                                                            active
                                                                ? "ring-1 ring-white/10 scale-[1.01] shadow-[0_0_18px_rgba(255,255,255,0.04)]"
                                                                : "hover:brightness-110",
                                                        ].join(" ")}
                                                    >
                                                        <div>{item.technique}</div>
                                                        <div className="mt-1 text-[10px] opacity-80">
                                                            {item.status}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <MitreDrilldownPanel
                                selectedCell={selectedMitreCell}
                                onOpenBlue={(scenarioId) => {
                                    setSelectedScenarioId?.(scenarioId);
                                    setActiveView?.("blue");
                                }}
                                onOpenRules={(scenarioId, technique) => {
                                    setSelectedScenarioId?.(scenarioId);
                                    setRulesLabFocus?.({
                                        scenarioId,
                                        technique,
                                        source: "mitre-drilldown",
                                    });
                                    setActiveView?.("rules");
                                }}
                            />
                        </div>
                    </PanelCard>
                </div>
            }
            right={
                <div className="space-y-4">
                    <PanelCard variant="signal">
                        <PanelHeader
                            icon={<Crosshair className="h-5 w-5 text-cyber-blue" />}
                            title="Key Observations"
                            subtitle="Fast interpretation of current analytics"
                        />

                        <div className="mt-4 space-y-2 text-sm leading-7 text-cyber-text">
                            <p>
                                Coverage trends become more meaningful once multiple sessions are compared over time.
                            </p>
                            <p>
                                Control effectiveness is intentionally simple in this demo, but already gives a strong product signal.
                            </p>
                            <p>
                                The MITRE matrix becomes much more useful once the analyst can click a technique and inspect its scenario-level context.
                            </p>
                        </div>
                    </PanelCard>

                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<BookOpenText className="h-5 w-5 text-cyber-violet" />}
                            title="Analytics Notes"
                            subtitle="How to read the current workspace"
                        />

                        <div className="mt-4 space-y-2">
                            <InfoRow
                                label="Best use"
                                value="Compare coverage, identify weak techniques, and evaluate controls."
                            />
                            <InfoRow
                                label="MITRE drilldown"
                                value="Click a technique chip to inspect scenario mapping, detections and gaps."
                            />
                            <InfoRow
                                label="Premium angle"
                                value="This page is strong for demos because it connects ops, rules and executive analytics."
                            />
                        </div>
                    </PanelCard>
                </div>
            }
        />
    );
}

/* ========================================
   🧩 MITRE Drilldown
======================================== */

function MitreDrilldownPanel({ selectedCell, onOpenBlue, onOpenRules }) {
    if (!selectedCell) {
        return (
            <PanelCard variant="signal">
                <PanelHeader
                    icon={<SearchCheck className="h-5 w-5 text-cyber-blue" />}
                    title="Technique Drilldown"
                    subtitle="Select a MITRE cell to inspect it"
                />

                <div className="mt-4">
                    <PanelCard variant="glass" className="border-dashed">
                        <div className="py-8 text-center">
                            <p className="text-sm font-semibold text-cyber-text">
                                No technique selected
                            </p>
                            <p className="mt-2 text-sm text-cyber-muted">
                                Click a MITRE technique chip to inspect tactic, scenario mapping, detections, gaps and recommendations.
                            </p>
                        </div>
                    </PanelCard>
                </div>
            </PanelCard>
        );
    }

    return (
        <PanelCard variant={getMitreDrilldownVariant(selectedCell.status)} glow>
            <PanelHeader
                icon={<Radar className="h-5 w-5 text-cyber-violet" />}
                title="Technique Drilldown"
                subtitle="Scenario-linked detail for the selected MITRE cell"
            />

            <div className="mt-4 space-y-4">
                <PanelCard variant="signal" dense>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                        Selected Mapping
                    </p>

                    <div className="mt-3 space-y-2">
                        <InfoRow label="Tactic" value={selectedCell.tactic} />
                        <InfoRow label="Technique" value={selectedCell.technique} />
                        <InfoRow label="Status" value={selectedCell.status} tone={getMitreTone(selectedCell.status)} />
                        <InfoRow label="Scenario" value={selectedCell.scenarioName} />
                        <InfoRow label="Coverage" value={`${selectedCell.coverage}%`} />
                    </div>
                </PanelCard>

                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => onOpenBlue?.(selectedCell.scenarioId)}
                        className="rounded-xl border border-cyber-blue/30 bg-cyber-blue/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyber-blue/20"
                    >
                        Open in Blue Investigation
                    </button>

                    <button
                        onClick={() => onOpenRules?.(selectedCell.scenarioId, selectedCell.technique)}
                        className="rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyber-violet/20"
                    >
                        Open in Rules Lab
                    </button>
                </div>

                <DrilldownList
                    title="Detections"
                    variant="defense"
                    items={selectedCell.detections}
                    emptyLabel="No detections mapped"
                />

                <DrilldownList
                    title="Known Gaps"
                    variant="threat"
                    items={selectedCell.gaps}
                    emptyLabel="No gap documented"
                />

                <DrilldownList
                    title="Recommendations"
                    variant="intel"
                    items={selectedCell.recommendations}
                    emptyLabel="No recommendation documented"
                />
            </div>
        </PanelCard>
    );
}

function DrilldownList({ title, variant = "signal", items = [], emptyLabel }) {
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
                        {emptyLabel}
                    </div>
                )}
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function ChartPanel({ variant = "signal", icon, title, subtitle, children }) {
    return (
        <PanelCard variant={variant}>
            <PanelHeader icon={icon} title={title} subtitle={subtitle} />
            <div className="mt-4">{children}</div>
        </PanelCard>
    );
}

function InfoRow({ label, value, tone = "text-cyber-text" }) {
    return (
        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-3">
            <p className="text-xs text-cyber-muted">{label}</p>
            <p className={`mt-1 text-sm font-semibold leading-6 ${tone}`}>
                {value}
            </p>
        </div>
    );
}

function CyberTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-white/[0.08] bg-[rgba(15,23,42,0.96)] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            {label ? (
                <p className="text-xs font-semibold text-cyber-text">{label}</p>
            ) : null}

            <div className="mt-1 space-y-1">
                {payload.map((entry) => (
                    <p
                        key={entry.dataKey}
                        className="text-xs text-cyber-muted"
                    >
                        <span className="text-cyber-text">{entry.name ?? entry.dataKey}</span>:{" "}
                        {entry.value}
                    </p>
                ))}
            </div>
        </div>
    );
}

function CompareRunsPanel({ comparison }) {
    return (
        <PanelCard variant="signal">
            <PanelHeader
                icon={<Activity className="h-5 w-5 text-cyber-blue" />}
                title="Compare Runs"
                subtitle="Previous run vs current state"
            />

            <div className="mt-4 grid grid-cols-1 gap-3">
                <DeltaRow
                    label="Coverage"
                    previous={`${comparison.previous.coverage}%`}
                    current={`${comparison.current.coverage}%`}
                    delta={comparison.delta.coverage}
                    suffix="%"
                />
                <DeltaRow
                    label="Alerts"
                    previous={comparison.previous.alerts}
                    current={comparison.current.alerts}
                    delta={comparison.delta.alerts}
                />
                <DeltaRow
                    label="Logs"
                    previous={comparison.previous.logs}
                    current={comparison.current.logs}
                    delta={comparison.delta.logs}
                />
                <DeltaRow
                    label="Momentum"
                    previous={`${comparison.previous.momentum}%`}
                    current={`${comparison.current.momentum}%`}
                    delta={comparison.delta.momentum}
                    suffix="%"
                />
            </div>
        </PanelCard>
    );
}

function DeltaRow({ label, previous, current, delta, suffix = "" }) {
    const positive = delta >= 0;

    return (
        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.16em] text-cyber-muted">
                    {label}
                </p>

                <span
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${positive
                        ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                        : "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                        }`}
                >
                    {positive ? "+" : ""}
                    {delta}
                    {suffix}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-[11px] text-cyber-muted">Previous</p>
                    <p className="mt-1 font-semibold text-cyber-text">{previous}</p>
                </div>
                <div>
                    <p className="text-[11px] text-cyber-muted">Current</p>
                    <p className="mt-1 font-semibold text-cyber-text">{current}</p>
                </div>
            </div>
        </div>
    );
}

function ControlEffectivenessPanel({ data = [] }) {
    return (
        <PanelCard variant="defense">
            <PanelHeader
                icon={<Shield className="h-5 w-5 text-cyber-green" />}
                title="Control Effectiveness"
                subtitle="Estimated defensive impact by enabled control"
            />

            <div className="mt-5 space-y-3">
                {data.map((item) => (
                    <ControlImpactRow key={item.name} item={item} />
                ))}
            </div>
        </PanelCard>
    );
}

function ControlImpactRow({ item }) {
    const enabled = item.impact >= 60;
    const toneClass = enabled
        ? "border-cyber-green/25 bg-cyber-green/10 text-cyber-green"
        : "border-cyber-amber/25 bg-cyber-amber/10 text-cyber-amber";

    return (
        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-cyber-text">
                        {item.name}
                    </p>
                    <p className="mt-1 text-xs text-cyber-muted">
                        {enabled ? "Strong visibility contribution" : "Limited or inactive contribution"}
                    </p>
                </div>

                <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${toneClass}`}>
                    {item.impact}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,197,94,0.35),rgba(34,197,94,0.95))] shadow-[0_0_14px_rgba(34,197,94,0.20)] transition-all duration-500"
                    style={{ width: `${item.impact}%` }}
                />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-cyber-muted">
                <span>Impact score</span>
                <span>{enabled ? "enabled posture" : "needs tuning"}</span>
            </div>
        </div>
    );
}

function DetectionOutcomePanel({ data = [] }) {
    const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

    return (
        <PanelCard variant="threat">
            <PanelHeader
                icon={<AlertTriangle className="h-5 w-5 text-cyber-red" />}
                title="Status Breakdown"
                subtitle="Detection outcomes across simulated scenarios"
            />

            <div className="mt-5 grid grid-cols-1 gap-3">
                {data.map((item) => {
                    const percent = Math.round((item.count / total) * 100);

                    return (
                        <OutcomeCard
                            key={item.label}
                            label={item.label}
                            count={item.count}
                            percent={percent}
                        />
                    );
                })}
            </div>
        </PanelCard>
    );
}

function OutcomeCard({ label, count, percent }) {
    const tone = getOutcomeTone(label);
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className={`rounded-xl border p-4 ${tone.card}`}>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-cyber-text">
                        {label}
                    </p>
                    <p className="mt-1 text-xs text-cyber-muted">
                        {count} scenario{count > 1 ? "s" : ""} mapped
                    </p>

                    <p className={`mt-3 text-2xl font-bold ${tone.text}`}>
                        {percent}%
                    </p>
                </div>

                <div className="relative h-20 w-20">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 88 88">
                        <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="none"
                            stroke={tone.stroke}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-700"
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-semibold ${tone.text}`}>
                            {count}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getOutcomeTone(label) {
    const value = String(label ?? "").toLowerCase();

    if (value.includes("detected")) {
        return {
            card: "border-cyber-green/25 bg-[linear-gradient(135deg,rgba(8,40,24,0.24),rgba(8,12,10,0.90))]",
            text: "text-cyber-green",
            stroke: "#22c55e",
        };
    }

    if (value.includes("partial")) {
        return {
            card: "border-cyber-amber/25 bg-[linear-gradient(135deg,rgba(82,52,8,0.20),rgba(18,12,8,0.90))]",
            text: "text-cyber-amber",
            stroke: "#f59e0b",
        };
    }

    return {
        card: "border-cyber-red/25 bg-[linear-gradient(135deg,rgba(56,10,14,0.26),rgba(12,8,10,0.92))]",
        text: "text-cyber-red",
        stroke: "#ef4444",
    };
}

/* ========================================
   🧠 Analytics Data Builders
======================================== */

function buildCoverageTrend(sessions, metrics, coverage) {
    const fromSessions = sessions.slice(-6).map((session, index) => ({
        label: session.name?.slice(0, 8) || `Run ${index + 1}`,
        coverage: session.metrics?.coverage ?? Math.max(20, Math.min(95, 40 + index * 8)),
    }));

    if (fromSessions.length > 0) {
        return fromSessions;
    }

    return [
        { label: "Run 1", coverage: 34 },
        { label: "Run 2", coverage: 48 },
        { label: "Run 3", coverage: 52 },
        { label: "Run 4", coverage: 61 },
        { label: "Run 5", coverage: coverage ?? metrics?.coverage ?? 68 },
    ];
}

function buildStatusBreakdown(scenarios) {
    const counts = {
        detected: 0,
        partial: 0,
        missed: 0,
    };

    scenarios.forEach((scenario) => {
        const status = String(scenario.status ?? "").toLowerCase();

        if (status === "detected") counts.detected += 1;
        else if (status === "partially detected") counts.partial += 1;
        else counts.missed += 1;
    });

    return [
        { label: "Detected", count: counts.detected },
        { label: "Partial", count: counts.partial },
        { label: "Missed", count: counts.missed },
    ];
}

function buildControlEffectiveness(scenarios, controls, coverage) {
    const base = [
        { name: "MFA", impact: controls?.mfa ? 72 : 34 },
        { name: "EDR", impact: controls?.edr ? 82 : 41 },
        { name: "IDS", impact: controls?.ids ? 68 : 36 },
        { name: "SIEM", impact: controls?.siem ? 79 : 40 },
        { name: "DLP", impact: controls?.dlp ? 64 : 28 },
    ];

    return base.map((item) => ({
        ...item,
        impact: Math.min(100, Math.round(item.impact + (coverage ?? 0) * 0.18)),
    }));
}

function buildScenarioScatter(scenarios) {
    return scenarios.map((scenario) => ({
        name: scenario.name,
        risk: severityToRisk(scenario.severity),
        coverage: scenario.coverage ?? 0,
        size: (scenario.coverage ?? 0) + 40,
    }));
}

function buildMitreMatrix(scenarios) {
    const rows = new Map();

    scenarios.forEach((scenario) => {
        const tactic = scenario.tactic ?? "Unknown";
        const items = rows.get(tactic) ?? [];

        items.push({
            scenarioId: scenario.id,
            technique: scenario.technique ?? "N/A",
            status: scenario.status ?? "Missed",
            scenarioName: scenario.name ?? "Unknown scenario",
            coverage: scenario.coverage ?? 0,
            detections: Array.isArray(scenario.detections) ? scenario.detections : [],
            gaps: Array.isArray(scenario.gaps) ? scenario.gaps : [],
            recommendations: Array.isArray(scenario.recommendations)
                ? scenario.recommendations
                : [],
        });

        rows.set(tactic, items);
    });

    return Array.from(rows.entries()).map(([tactic, items]) => ({
        tactic,
        items,
    }));
}

function getTopCoverageScenarios(scenarios) {
    return [...scenarios]
        .sort((a, b) => (b.coverage ?? 0) - (a.coverage ?? 0))
        .slice(0, 3);
}

function getWeakCoverageScenarios(scenarios) {
    return [...scenarios]
        .sort((a, b) => (a.coverage ?? 0) - (b.coverage ?? 0))
        .slice(0, 3);
}

function severityToRisk(severity) {
    const value = String(severity ?? "").toLowerCase();
    if (value === "critical") return 95;
    if (value === "high") return 78;
    if (value === "medium") return 56;
    return 32;
}

function getMitreChipClass(status) {
    const value = String(status ?? "").toLowerCase();

    if (value === "detected") {
        return "border-cyber-green/30 bg-cyber-green/10 text-cyber-green";
    }

    if (value === "partially detected") {
        return "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber";
    }

    return "border-cyber-red/30 bg-cyber-red/10 text-cyber-red";
}

function getMitreDrilldownVariant(status) {
    const value = String(status ?? "").toLowerCase();

    if (value === "detected") return "defense";
    if (value === "partially detected") return "signal";
    return "threat";
}

function getMitreTone(status) {
    const value = String(status ?? "").toLowerCase();

    if (value === "detected") return "text-cyber-green";
    if (value === "partially detected") return "text-cyber-amber";
    return "text-cyber-red";
}

function buildRunComparison(sessions, metrics, activeAlerts, coverage) {
    const previousSession = sessions?.[sessions.length - 2];
    const currentSession = sessions?.[sessions.length - 1];

    const previous = {
        coverage: previousSession?.metrics?.coverage ?? Math.max(0, (coverage ?? 0) - 12),
        alerts: previousSession?.alerts?.length ?? Math.max(0, (activeAlerts?.length ?? 0) - 1),
        logs: previousSession?.metrics?.totalLogs ?? Math.max(0, (metrics?.totalLogs ?? 0) - 4),
        momentum: previousSession?.metrics?.momentum ?? Math.max(0, (metrics?.momentum ?? 0) - 10),
    };

    const current = {
        coverage: currentSession?.metrics?.coverage ?? coverage ?? 0,
        alerts: currentSession?.alerts?.length ?? activeAlerts?.length ?? 0,
        logs: currentSession?.metrics?.totalLogs ?? metrics?.totalLogs ?? 0,
        momentum: currentSession?.metrics?.momentum ?? metrics?.momentum ?? 0,
    };

    return {
        previous,
        current,
        delta: {
            coverage: current.coverage - previous.coverage,
            alerts: current.alerts - previous.alerts,
            logs: current.logs - previous.logs,
            momentum: current.momentum - previous.momentum,
        },
    };
}