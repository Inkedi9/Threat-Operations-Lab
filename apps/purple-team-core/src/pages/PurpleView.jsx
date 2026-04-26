import { Activity, Radar, Shield, CheckCircle2, Sparkles, Layers3 } from "lucide-react";
import KillChainVisualizer from "../components/live/KillChainVisualizer";
import KillChainLogConsole from "../components/live/KillChainLogConsole";
import DetectionGapPanel from "../components/coverage/DetectionGapPanel";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";
import EmptyState from "../components/ui/EmptyState";
import MetricCard from "../components/ui/MetricCard";

/* ========================================
   🟣 Purple View
======================================== */

export default function PurpleView({
    mode,
    selectedScenario,
    selectedCampaignScenarios,
    visibleStatus,
    displayedEvents,
    activeControls,
    isRunning,
    coverage,
    eventAccent,
    eventIcon,
}) {
    const selectedCount =
        mode === "campaign"
            ? selectedCampaignScenarios.length
            : selectedScenario
                ? 1
                : 0;

    const headerStats = [
        {
            label: "Mode",
            value: mode,
            icon: <Shield className="h-4 w-4 text-cyber-violet" />,
        },
        {
            label: "Events",
            value: displayedEvents.length,
            icon: <Activity className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Status",
            value: visibleStatus,
            icon: <CheckCircle2 className="h-4 w-4 text-cyber-green" />,
        },
        {
            label: "Coverage",
            value: `${coverage}%`,
            icon: <Radar className="h-4 w-4 text-cyan-400" />,
        },
    ];

    return (
        <PageShell
            header={
                <PageHeader
                    eyebrow="PURPLE VALIDATION"
                    title="Telemetry, Kill Chain & Gap Analysis"
                    description="Inspect the live timeline, track attack progression across the kill chain, and validate defensive coverage through a purple team lens."
                    stats={headerStats}
                />
            }
            left={
                <>
                    <ActivityFeed
                        mode={mode}
                        selectedScenario={selectedScenario}
                        selectedCampaignScenarios={selectedCampaignScenarios}
                        isRunning={isRunning}
                        visibleStatus={visibleStatus}
                        activeControls={activeControls}
                    />

                    <DetectionGapPanel
                        selectedScenarios={
                            mode === "campaign" ? selectedCampaignScenarios : [selectedScenario].filter(Boolean)
                        }
                        visibleStatus={visibleStatus}
                        coverage={coverage}
                    />
                </>
            }
            center={
                <>
                    <PanelCard variant="signal">
                        <PanelHeader
                            icon={<Radar className="h-5 w-5 text-cyber-blue" />}
                            title="Timeline / Telemetry"
                            subtitle={
                                mode === "campaign"
                                    ? "Multi-stage campaign events and telemetry flow"
                                    : "Logs, alerts and purple validation events"
                            }
                        />

                        <div className="mt-4">
                            <PanelCard variant="intel" dense>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="border-cyber-border bg-cyber-bgSoft text-cyber-text">
                                        {mode === "campaign" ? "Campaign Mode" : selectedScenario?.name ?? "Single Mode"}
                                    </Badge>

                                    {mode === "single" ? (
                                        <Badge className="border-cyber-border bg-cyber-bgSoft text-cyber-muted">
                                            {selectedScenario?.technique ?? "No technique"}
                                        </Badge>
                                    ) : (
                                        <Badge className="border-cyber-border bg-cyber-bgSoft text-cyber-muted">
                                            {selectedCampaignScenarios.length} stages selected
                                        </Badge>
                                    )}

                                    <StatusBadge status={visibleStatus}>{visibleStatus}</StatusBadge>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-cyber-muted">
                                    {mode === "campaign"
                                        ? "A chained attack sequence is being simulated across multiple stages to evaluate broader defensive resilience."
                                        : selectedScenario?.summary ||
                                        "A focused validation run is prepared to inspect telemetry, detection quality and timeline visibility."}
                                </p>
                            </PanelCard>
                        </div>

                        <div className="mt-4">
                            {displayedEvents.length === 0 ? (
                                <PanelCard variant="signal" className="border-dashed">
                                    <EmptyState
                                        icon={<Radar className="h-6 w-6 text-cyber-blue" />}
                                        title="No telemetry yet"
                                        description="Launch the simulation to stream attack events, logs, alerts and purple validation steps."
                                    />
                                </PanelCard>
                            ) : (
                                <PanelCard variant="signal" dense className="p-2">
                                    <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1">
                                        {displayedEvents.map((event, index) => (
                                            <TelemetryEventCard
                                                key={`${event.time}-${index}-${event.scenarioName || "main"}`}
                                                event={event}
                                                accentClass={eventAccent(event.type)}
                                                icon={eventIcon(event.type)}
                                            />
                                        ))}
                                    </div>
                                </PanelCard>
                            )}
                        </div>
                    </PanelCard>

                    <KillChainVisualizer
                        displayedEvents={displayedEvents}
                        visibleStatus={visibleStatus}
                        selectedScenario={selectedScenario}
                        isRunning={isRunning}
                    />

                    <KillChainLogConsole
                        displayedEvents={displayedEvents}
                        visibleStatus={visibleStatus}
                        isRunning={isRunning}
                    />
                </>
            }
            right={
                <>
                    <PanelCard variant="defense" glow>
                        <PanelHeader
                            icon={<Sparkles className="h-5 w-5 text-cyber-violet" />}
                            title="Validation Context"
                            subtitle="Current purple team execution snapshot"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <MetricCard
                                label="Mode"
                                value={mode}
                                variant="intel"
                                accent="violet"
                            />
                            <MetricCard
                                label="Selection"
                                value={
                                    mode === "campaign"
                                        ? `${selectedCount} scenarios`
                                        : selectedScenario?.name ?? "n/a"
                                }
                                variant="signal"
                                accent="blue"
                            />
                            <MetricCard
                                label="Status"
                                value={visibleStatus}
                                variant={
                                    visibleStatus === "Missed"
                                        ? "threat"
                                        : visibleStatus === "Detected"
                                            ? "defense"
                                            : "signal"
                                }
                                accent={
                                    visibleStatus === "Missed"
                                        ? "red"
                                        : visibleStatus === "Detected"
                                            ? "green"
                                            : "amber"
                                }
                                tone={
                                    visibleStatus === "Missed"
                                        ? "text-cyber-red"
                                        : visibleStatus === "Detected"
                                            ? "text-cyber-green"
                                            : "text-cyber-amber"
                                }
                            />
                            <MetricCard
                                label="Coverage"
                                value={`${coverage}%`}
                                variant="defense"
                                accent="green"
                                tone="text-cyber-green"
                            />
                        </div>
                    </PanelCard>

                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<Layers3 className="h-5 w-5 text-cyber-blue" />}
                            title="Execution Snapshot"
                            subtitle="Quick reading aid"
                        />

                        <div className="mt-4 space-y-3">
                            <SnapshotRow
                                label="Telemetry"
                                value={
                                    displayedEvents.length > 0
                                        ? `${displayedEvents.length} events streamed`
                                        : "No events yet"
                                }
                            />
                            <SnapshotRow
                                label="Controls"
                                value={
                                    activeControls.length > 0
                                        ? activeControls.join(", ")
                                        : "No active controls"
                                }
                            />
                            <SnapshotRow
                                label="Execution"
                                value={isRunning ? "Live run in progress" : "Idle / awaiting execution"}
                            />
                            <SnapshotRow
                                label="Focus"
                                value={
                                    mode === "campaign"
                                        ? "Multi-stage validation"
                                        : selectedScenario?.technique ?? "Single scenario validation"
                                }
                            />
                        </div>
                    </PanelCard>
                </>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function TelemetryEventCard({ event, accentClass, icon }) {
    return (
        <div
            className={`rounded-2xl border border-cyber-border bg-cyber-panel2 p-4 border-l-4 ${accentClass} animate-slide-up`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-cyber-border bg-cyber-bgSoft p-2">
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-cyber-text">{event.title}</p>
                            <p className="text-xs uppercase tracking-wide text-cyber-muted">
                                {event.type}
                                {event.scenarioName ? ` • ${event.scenarioName}` : ""}
                            </p>
                        </div>

                        <span className="text-xs text-cyber-muted">{event.time}</span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-cyber-text">
                        {event.message}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className = "" }) {
    return (
        <span className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${className}`}>
            {children}
        </span>
    );
}

function StatusBadge({ status, children }) {
    const styles =
        status === "Detected"
            ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
            : status === "Partially Detected"
                ? "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber"
                : status === "Missed"
                    ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                    : "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";

    return <Badge className={styles}>{children}</Badge>;
}

function SnapshotRow({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">{label}</p>
            <p className="mt-2 text-sm leading-6 text-cyber-text">{value}</p>
        </div>
    );
}

/* ========================================
   📡 Activity Feed
======================================== */

function ActivityFeed({
    mode,
    selectedScenario,
    selectedCampaignScenarios,
    isRunning,
    visibleStatus,
    activeControls,
}) {
    const lines =
        mode === "campaign"
            ? [
                `campaign.init -- ${selectedCampaignScenarios.length} stages selected`,
                `controls.active -- ${activeControls.length > 0 ? activeControls.join(", ") : "none"}`,
                `campaign.status -- ${isRunning ? "running" : visibleStatus.toLowerCase()}`,
                `engine.mode -- chained purple validation`,
            ]
            : [
                `scenario.load -- ${selectedScenario?.name ?? "n/a"}`,
                `technique.map -- ${selectedScenario?.technique ?? "n/a"}`,
                `controls.active -- ${activeControls.length > 0 ? activeControls.join(", ") : "none"}`,
                `scenario.status -- ${isRunning ? "running" : visibleStatus.toLowerCase()}`,
            ];

    return (
        <PanelCard variant="signal" className="overflow-hidden">
            <div className="border-b border-cyber-border/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>

                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-text/90">
                        activity-feed.log
                    </p>

                    <span
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
                    </span>
                </div>
            </div>

            <div className="bg-[#0b0b0f] p-4 font-mono">
                <div className="mb-3 text-xs text-cyan-400">
                    purple-lab@ops:~$ monitor --live
                </div>

                <div className="space-y-2">
                    {lines.map((line, index) => (
                        <div key={index} className="break-words text-sm leading-6 text-slate-300">
                            <span className="text-cyber-violet">$</span>{" "}
                            <span>{line}</span>
                        </div>
                    ))}

                    <div className="pt-2 text-sm text-green-400">
                        {isRunning ? "streaming telemetry..." : "[system] idle — awaiting execution"}
                    </div>
                </div>
            </div>
        </PanelCard>
    );
}