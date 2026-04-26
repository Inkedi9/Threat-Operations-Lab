import {
    Shield,
    Activity,
    Radar,
    AlertTriangle,
    MonitorSmartphone,
    Sparkles,
    Layers3,
    PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { useSimulationStore } from "../app/store/simulationStore";

import KillChainVisualizer from "../components/live/KillChainVisualizer";
import KillChainLogConsole from "../components/live/KillChainLogConsole";
import AlertQueueTable from "../components/alerts/AlertQueueTable";
import Scoreboard from "../components/coverage/Scoreboard";
import LiveEventStream from "../components/live/LiveEventStream";
import AttackNarrative from "../components/live/AttackNarrative";
import NetworkMap from "../components/network/NetworkMap";
import AIAssistantPanel from "../components/assistant/AIAssistantPanel";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";
import MetricCard from "../components/ui/MetricCard";
import {
    formatCoverage,
    formatCount,
    formatMomentum,
} from "../lib/metricFormatters";

/* ========================================
   🖥️ Operator Console (War Room)
======================================== */

export default function OperatorConsole({
    selectedScenario,
    selectedCampaignScenarios,
    visibleStatus,
    isFullscreen = false,
    onToggleFullscreen,
    onExitFullscreen,
}) {
    const { getActiveSession, updateAlertTriageStatus } = useSimulationStore();

    const [activeKillChainStepId, setActiveKillChainStepId] = useState("recon");
    const [selectedKillChainStepId, setSelectedKillChainStepId] = useState("recon");

    const session = getActiveSession();
    const alerts = session?.alerts ?? [];
    const metrics = session?.metrics;
    const timeline = session?.timeline ?? [];
    const coverage = session?.metrics?.coverage ?? 0;
    const sessionMode = session?.mode ?? "single";
    const sessionStatus = session?.status ?? "idle";
    const isRunning = sessionStatus === "running";

    const activeControls = Object.entries(session?.controls ?? {})
        .filter(([, enabled]) => enabled)
        .map(([key]) => key.toUpperCase());

    const campaignSize = selectedCampaignScenarios?.length ?? 0;
    const hasCampaignSelection = campaignSize > 0;

    const operatorSummary =
        sessionMode === "campaign"
            ? `Campaign execution ${isRunning ? "in progress" : "staged"} across ${campaignSize} scenario${campaignSize > 1 ? "s" : ""}.`
            : selectedScenario?.summary ||
            "Single-scenario execution workspace ready for telemetry, alerts and analyst validation.";

    const headerStats = [
        {
            label: "Mode",
            value: sessionMode,
            icon: <Shield className="h-4 w-4 text-cyber-violet" />,
        },
        {
            label: "Status",
            value: sessionStatus,
            icon: <Activity className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Events",
            value: timeline.length,
            icon: <Radar className="h-4 w-4 text-cyan-400" />,
        },
        {
            label: "Alerts",
            value: alerts.length,
            icon: <AlertTriangle className="h-4 w-4 text-cyber-amber" />,
        },
    ];

    return (
        <div
            className={
                isFullscreen
                    ? "fixed inset-0 z-[70] h-screen w-screen overflow-hidden bg-cyber-bg"
                    : ""
            }
        >
            <div className="fixed right-6 top-24 z-[80]">
                {!isFullscreen ? (
                    <button
                        onClick={onToggleFullscreen}
                        className="rounded-2xl px-4 py-2 text-sm font-semibold text-white liquid-glass liquid-glass-hover"
                    >
                        FULL
                    </button>
                ) : (
                    <button
                        onClick={onExitFullscreen}
                        className="rounded-2xl border border-cyber-red/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.16),rgba(239,68,68,0.07))] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] hover:bg-[linear-gradient(180deg,rgba(239,68,68,0.2),rgba(239,68,68,0.1))]"
                    >
                        EXIT
                    </button>
                )}
            </div>

            <PageShell
                leftWidth="340px"
                rightWidth="380px"
                fullscreen={isFullscreen}
                variant="dense"
                header={
                    <WarRoomHeader
                        headerStats={headerStats}
                        isFullscreen={isFullscreen}
                    />
                }
                left={
                    <>
                        <LiveEventStream
                            events={timeline}
                            isRunning={isRunning}
                        />

                        <AttackNarrative events={timeline} />

                        <PanelCard
                            dense={isFullscreen}
                            variant="intel"
                            className="hover:border-white/[0.08]"
                        >
                            <PanelHeader
                                icon={<Layers3 className="h-5 w-5 text-cyber-blue" />}
                                title="Execution Snapshot"
                                subtitle="Current run overview"
                            />

                            <div className="mt-4 space-y-3">
                                <SnapshotRow
                                    label="Execution"
                                    value={isRunning ? "Live run in progress" : "Idle / awaiting execution"}
                                />
                                <SnapshotRow
                                    label="Selection"
                                    value={
                                        sessionMode === "campaign"
                                            ? hasCampaignSelection
                                                ? `${campaignSize} stages selected`
                                                : "No campaign stages selected"
                                            : selectedScenario?.name ?? "No scenario selected"
                                    }
                                />
                                <SnapshotRow
                                    label="Controls"
                                    value={activeControls.length ? activeControls.join(", ") : "No active controls"}
                                />
                                <SnapshotRow
                                    label="Summary"
                                    value={operatorSummary}
                                />
                            </div>
                        </PanelCard>

                        <PanelCard
                            dense={isFullscreen}
                            variant="signal"
                            className="hover:border-white/[0.08]"
                        >
                            <PanelHeader
                                icon={<MonitorSmartphone className="h-5 w-5 text-cyber-violet" />}
                                title="Session Context"
                                subtitle="Quick operator snapshot"
                            />

                            <div className="mt-4 grid grid-cols-1 gap-3">
                                <MetricCard
                                    label="Scenario"
                                    value={
                                        sessionMode === "campaign"
                                            ? "Campaign execution"
                                            : selectedScenario?.name ?? "n/a"
                                    }
                                    compact={isFullscreen}
                                    variant="intel"
                                    accent="violet"
                                />
                                <MetricCard
                                    label="Campaign Scope"
                                    value={`${campaignSize} stages`}
                                    compact={isFullscreen}
                                    variant="signal"
                                    accent="blue"
                                />
                                <MetricCard
                                    label="Coverage"
                                    value={formatCoverage(coverage)}
                                    compact={isFullscreen}
                                    variant="defense"
                                    accent="green"
                                    tone="text-cyber-green"
                                />
                                <MetricCard
                                    label="Active Controls"
                                    value={activeControls.length ? activeControls.join(", ") : "None"}
                                    compact={isFullscreen}
                                    variant="signal"
                                    accent="amber"
                                />
                            </div>
                        </PanelCard>
                    </>
                }
                center={
                    <>
                        <KillChainVisualizer
                            displayedEvents={timeline}
                            visibleStatus={visibleStatus}
                            selectedScenario={selectedScenario}
                            isRunning={isRunning}
                            selectedStepId={selectedKillChainStepId}
                            onSelectedStepChange={setSelectedKillChainStepId}
                            onActiveStepChange={setActiveKillChainStepId}
                        />

                        <KillChainLogConsole
                            displayedEvents={timeline}
                            visibleStatus={visibleStatus}
                            isRunning={isRunning}
                        />

                        <NetworkMap
                            events={timeline}
                            selectedScenario={selectedScenario}
                            selectedCampaignScenarios={selectedCampaignScenarios}
                            mode={sessionMode}
                            activeKillChainStepId={activeKillChainStepId}
                            selectedKillChainStepId={selectedKillChainStepId}
                        />
                    </>
                }
                right={
                    <>
                        <Scoreboard metrics={metrics} />

                        <AlertQueueTable
                            alerts={alerts}
                            onSelectAlert={() => { }}
                            onUpdateAlertStatus={updateAlertTriageStatus}
                        />

                        <AIAssistantPanel
                            selectedAlert={alerts[0] ?? null}
                            visibleStatus={visibleStatus}
                            coverage={coverage}
                            activeControls={activeControls}
                            mode={sessionMode}
                            selectedScenario={selectedScenario}
                        />

                        <PanelCard
                            dense={isFullscreen}
                            variant="defense"
                            glow
                            className="hover:border-white/[0.08]"
                        >
                            <PanelHeader
                                icon={<Sparkles className="h-5 w-5 text-cyber-green" />}
                                title="Operator Status"
                                subtitle="Live command center indicators"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <MetricCard
                                    label="Detection"
                                    value={visibleStatus}
                                    tone={getStatusTone(visibleStatus)}
                                    compact={isFullscreen}
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
                                />
                                <MetricCard
                                    label="Momentum"
                                    value={formatMomentum(metrics?.momentum)}
                                    tone="text-cyber-violet"
                                    compact={isFullscreen}
                                    variant="intel"
                                    accent="violet"
                                />
                                <MetricCard
                                    label="Logs"
                                    value={formatCount(metrics?.totalLogs)}
                                    tone="text-cyber-blue"
                                    compact={isFullscreen}
                                    variant="signal"
                                    accent="blue"
                                />
                                <MetricCard
                                    label="Alerts"
                                    value={formatCount(metrics?.totalAlerts)}
                                    tone="text-cyber-amber"
                                    compact={isFullscreen}
                                    variant="threat"
                                    accent="amber"
                                />
                            </div>
                        </PanelCard>

                        <PanelCard
                            dense={isFullscreen}
                            variant="glass"
                            className="hover:border-white/[0.08]"
                        >
                            <PanelHeader
                                icon={<PlayCircle className="h-5 w-5 text-cyber-violet" />}
                                title="Run Focus"
                                subtitle="Operator guidance"
                            />

                            <div className="mt-4 space-y-3">
                                <HintRow
                                    title="Primary objective"
                                    text={
                                        sessionMode === "campaign"
                                            ? "Track progression, coverage gaps and analyst response across chained stages."
                                            : "Follow one scenario from telemetry to alert triage and validation outcome."
                                    }
                                />
                                <HintRow
                                    title="What to watch"
                                    text={
                                        isRunning
                                            ? "Live event stream, kill chain status, triage queue growth and topology propagation."
                                            : "Selection state, active controls and whether the run context is ready."
                                    }
                                />
                            </div>
                        </PanelCard>
                    </>
                }
            />
        </div>
    );
}

/* ========================================
   🧭 War Room Header
======================================== */

function WarRoomHeader({ headerStats, isFullscreen }) {
    return (
        <div
            className={
                isFullscreen
                    ? "sticky top-0 z-30 border-b border-cyber-border bg-cyber-panel/95 px-4 py-4 backdrop-blur-xl"
                    : ""
            }
        >
            <PageHeader
                variant={isFullscreen ? "immersive" : "default"}
                eyebrow="WAR ROOM / OPERATOR CONSOLE"
                title="Live Purple Team Operations"
                description="Monitor the simulation in real time through a dense cyber ops layout combining logs, attack narrative, topology, detections and analyst support."
                stats={headerStats}
            />
        </div>
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function SnapshotRow({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">{label}</p>
            <p className="mt-2 text-sm leading-6 text-cyber-text">{value}</p>
        </div>
    );
}

function HintRow({ title, text }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
            <p className="text-sm font-semibold text-cyber-text">{title}</p>
            <p className="mt-2 text-sm leading-6 text-cyber-muted">{text}</p>
        </div>
    );
}

function getStatusTone(status) {
    if (status === "Detected") return "text-cyber-green";
    if (status === "Partially Detected") return "text-cyber-amber";
    if (status === "Missed") return "text-cyber-red";
    return "text-cyber-blue";
}