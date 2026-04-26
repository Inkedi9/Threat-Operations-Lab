import { FileText, CheckCircle2, Copy, ClipboardCheck, Eye, BarChart3 } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar as RechartsRadar,
} from "recharts";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import EmptyState from "../components/ui/EmptyState";

/* ========================================
   📤 Output View
======================================== */

export default function OutputView({
    mode,
    visibleStatus,
    selectedScenario,
    selectedCampaignScenarios,
    selectedCampaignCount,
    selectedScenarioCount,
    selectedCampaignCoverage,
    reportGenerated,
    setReportGenerated,
    simulationFinished,
    copyReport,
    copied,
    purpleSummary,
    activeControls,
    logCount,
    alertCount,
    adjustedState,
    campaignAdjustedStates,
    selectedRadarData,
    globalCoverageData,
    globalStats,
    coverageTone,
    startReplay,
    stopReplay,
    isReplayMode,
    hasReplayData,
    pauseReplay,
    resumeReplay,
    scrubReplay,
    replayIndex,
    replaySpeed,
    setReplaySpeed,
    isReplayPaused,
    replayTotal,
}) {
    const headerStats = [
        {
            label: "Status",
            value: visibleStatus,
            icon: <CheckCircle2 className="h-4 w-4 text-cyber-green" />,
        },
        {
            label: "Alerts",
            value: alertCount,
            icon: <Eye className="h-4 w-4 text-cyber-amber" />,
        },
        {
            label: "Logs",
            value: logCount,
            icon: <BarChart3 className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Coverage",
            value: `${mode === "campaign" ? selectedCampaignCoverage : adjustedState?.adjustedCoverage ?? 0}%`,
            icon: <FileText className="h-4 w-4 text-cyber-violet" />,
        },
    ];

    return (
        <PageShell
            header={
                <PageHeader
                    eyebrow="OUTPUT & REPORTING"
                    title="Reports, Metrics & Coverage Outputs"
                    description="Review final reports, compare visual outputs and track lab-wide validation metrics from the simulation results."
                    stats={headerStats}
                />
            }
            left={
                <>
                    {/* ========================================
             ✅ Global Purple Snapshot
          ======================================== */}
                    <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
                        <SectionTitle
                            icon={<CheckCircle2 className="h-5 w-5 text-cyber-green" />}
                            title="Global Purple Snapshot"
                            subtitle="High-level detection distribution across the lab"
                        />

                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <MiniStat label="Detected" value={globalStats.detected} tone="text-cyber-green" />
                            <MiniStat label="Partial" value={globalStats.partial} tone="text-cyber-amber" />
                            <MiniStat label="Missed" value={globalStats.missed} tone="text-cyber-red" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <MiniStat label="Mode" value={mode} tone="text-cyber-violet" />
                            <MiniStat
                                label="Scope"
                                value={mode === "campaign" ? selectedCampaignCount : selectedScenarioCount}
                                tone="text-cyber-blue"
                            />
                            <MiniStat
                                label="Status"
                                value={visibleStatus}
                                tone={coverageTone(
                                    mode === "campaign"
                                        ? selectedCampaignCoverage
                                        : adjustedState?.adjustedCoverage ?? 0
                                )}
                            />
                        </div>
                    </div>
                </>
            }
            center={
                <>
                    {/* ========================================
             📄 Purple Report
          ======================================== */}
                    <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
                        <SectionTitle
                            icon={<FileText className="h-5 w-5 text-cyber-blue" />}
                            title="Purple Report"
                            subtitle={
                                mode === "campaign"
                                    ? "Generate a global campaign report"
                                    : "Generate a final report for the active scenario"
                            }
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                onClick={() => setReportGenerated(true)}
                                disabled={!simulationFinished}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-blue/30 bg-cyber-blue/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-blue/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FileText className="h-4 w-4" />
                                Generate Report
                            </button>

                            <button
                                onClick={copyReport}
                                disabled={!reportGenerated}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-border bg-cyber-panel2 px-4 py-3 text-sm font-semibold text-cyber-text transition hover:border-cyber-violet/40 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {copied ? <ClipboardCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied" : "Copy Report"}
                            </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                onClick={startReplay}
                                disabled={!hasReplayData}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-violet/30 bg-cyber-violet/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-violet/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Replay Session
                            </button>

                            <button
                                onClick={stopReplay}
                                disabled={!isReplayMode}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-border bg-cyber-panel2 px-4 py-3 text-sm font-semibold text-cyber-text transition hover:border-cyber-violet/40 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Stop Replay
                            </button>
                        </div>
                        {hasReplayData && (
                            <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                                <p className="mb-3 text-xs uppercase tracking-wide text-cyber-muted">
                                    Replay Controls
                                </p>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        onClick={isReplayPaused ? resumeReplay : pauseReplay}
                                        disabled={!isReplayMode}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-border bg-cyber-panel/70 px-4 py-3 text-sm font-semibold text-cyber-text transition hover:border-cyber-violet/40 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {isReplayPaused ? "Resume Replay" : "Pause Replay"}
                                    </button>

                                    <div className="flex items-center gap-2 rounded-2xl border border-cyber-border bg-cyber-panel/70 px-4 py-3">
                                        <span className="text-sm text-cyber-muted">Speed</span>

                                        <button
                                            onClick={() => setReplaySpeed(1)}
                                            className={`rounded-lg px-2 py-1 text-xs transition ${replaySpeed === 1
                                                ? "bg-cyber-violet/15 text-white"
                                                : "text-cyber-muted hover:text-white"
                                                }`}
                                        >
                                            x1
                                        </button>

                                        <button
                                            onClick={() => setReplaySpeed(2)}
                                            className={`rounded-lg px-2 py-1 text-xs transition ${replaySpeed === 2
                                                ? "bg-cyber-violet/15 text-white"
                                                : "text-cyber-muted hover:text-white"
                                                }`}
                                        >
                                            x2
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="mb-2 flex items-center justify-between text-xs text-cyber-muted">
                                        <span>Replay Progress</span>
                                        <span>
                                            {replayIndex} / {replayTotal}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min={0}
                                        max={replayTotal}
                                        value={replayIndex}
                                        onChange={(event) => scrubReplay(Number(event.target.value))}
                                        className="w-full accent-violet-500"
                                    />
                                </div>
                            </div>
                        )}

                        {!simulationFinished && (
                            <div className="mt-4 rounded-2xl border border-dashed border-cyber-border bg-cyber-panel2 p-4">
                                <EmptyState
                                    title="No replay available"
                                    description="Run a scenario first to record a playable session timeline."
                                    compact
                                />
                            </div>
                        )}

                        {reportGenerated && simulationFinished && (
                            <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-cyber-text">
                                        {mode === "campaign" ? "Campaign Report" : "Final Report"}
                                    </p>
                                    <StatusBadge status={visibleStatus}>{visibleStatus}</StatusBadge>
                                </div>

                                {mode === "campaign" ? (
                                    <>
                                        <div className="space-y-3 text-sm">
                                            <ReportRow
                                                label="Scenarios"
                                                value={selectedCampaignScenarios.map((s) => s.name).join(", ")}
                                            />
                                            <ReportRow
                                                label="Campaign Coverage"
                                                value={`${selectedCampaignCoverage}%`}
                                            />
                                            <ReportRow label="Observed Logs" value={logCount} />
                                            <ReportRow label="Triggered Alerts" value={alertCount} />
                                            <ReportRow
                                                label="Enabled Controls"
                                                value={activeControls.length ? activeControls.join(", ") : "None"}
                                            />
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-bgSoft p-4">
                                            <p className="mb-2 text-xs uppercase tracking-wide text-cyber-muted">
                                                Campaign Summary
                                            </p>
                                            <p className="text-sm leading-6 text-cyber-text">{purpleSummary}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p className="mb-3 text-xs uppercase tracking-wide text-cyber-muted">
                                                Per-Scenario Results
                                            </p>
                                            <div className="space-y-2">
                                                {campaignAdjustedStates.map((item, index) => (
                                                    <div
                                                        key={item.scenario.id}
                                                        className="rounded-xl border border-cyber-border bg-cyber-bgSoft p-3"
                                                    >
                                                        <p className="text-sm text-cyber-text">
                                                            {index + 1}. {item.scenario.name} — {item.adjusted.adjustedStatus} —{" "}
                                                            {item.adjusted.adjustedCoverage}%
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-3 text-sm">
                                            <ReportRow label="Scenario" value={selectedScenario?.name} />
                                            <ReportRow label="Tactic" value={selectedScenario?.tactic} />
                                            <ReportRow label="Technique" value={selectedScenario?.technique} />
                                            <ReportRow label="Severity" value={selectedScenario?.severity} />
                                            <ReportRow
                                                label="Coverage"
                                                value={`${adjustedState?.adjustedCoverage ?? 0}%`}
                                            />
                                            <ReportRow label="Observed Logs" value={logCount} />
                                            <ReportRow label="Triggered Alerts" value={alertCount} />
                                            <ReportRow
                                                label="Enabled Controls"
                                                value={activeControls.length ? activeControls.join(", ") : "None"}
                                            />
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-bgSoft p-4">
                                            <p className="mb-2 text-xs uppercase tracking-wide text-cyber-muted">
                                                Summary
                                            </p>
                                            <p className="text-sm leading-6 text-cyber-text">{purpleSummary}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p className="mb-3 text-xs uppercase tracking-wide text-cyber-muted">
                                                Recommendations
                                            </p>
                                            <div className="space-y-2">
                                                {selectedScenario?.recommendations?.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-xl border border-cyber-border bg-cyber-bgSoft p-3"
                                                    >
                                                        <p className="text-sm text-cyber-text">
                                                            {index + 1}. {item}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
            }
            right={
                <>
                    {/* ========================================
             📊 Coverage Analytics
          ======================================== */}
                    <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
                        <SectionTitle
                            icon={<Eye className="h-5 w-5 text-cyan-400" />}
                            title="Coverage Analytics"
                            subtitle="Scenario and lab-wide visual outputs"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-4">
                            <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                                <p className="mb-3 text-sm font-semibold">
                                    {mode === "campaign" ? "Campaign Radar" : "Selected Scenario Radar"}
                                </p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={selectedRadarData}>
                                            <PolarGrid stroke="#334155" />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                            />
                                            <RechartsRadar
                                                name="Coverage"
                                                dataKey="value"
                                                stroke="#8b5cf6"
                                                fill="#8b5cf6"
                                                fillOpacity={0.35}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                                <p className="mb-3 text-sm font-semibold">Global Coverage Snapshot</p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={globalCoverageData}>
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: "#94a3b8", fontSize: 10 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#0f172a",
                                                    border: "1px solid #1e293b",
                                                    borderRadius: "12px",
                                                    color: "#e2e8f0",
                                                }}
                                            />
                                            <Bar dataKey="coverage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function SectionTitle({ icon, title, subtitle }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <p className="mt-1 text-sm text-cyber-muted">{subtitle}</p>
        </div>
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

    return (
        <span className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${styles}`}>
            {children}
        </span>
    );
}

function ReportRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-bgSoft p-3">
            <span className="text-cyber-muted">{label}</span>
            <span className="text-right font-medium text-cyber-text">{value}</span>
        </div>
    );
}

function MiniStat({ label, value, tone = "text-cyber-text" }) {
    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
            <p className="text-xs uppercase tracking-wide text-cyber-muted">{label}</p>
            <p className={`mt-2 text-xl font-bold break-words ${tone}`}>{value}</p>
        </div>
    );
}