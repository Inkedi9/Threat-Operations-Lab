import {
    FileText,
    CheckCircle2,
    Copy,
    ClipboardCheck,
    Eye,
    BarChart3,
    Shield,
    Network,
    Radar,
    Globe,
    MailWarning,
    UserRound,
} from "lucide-react";
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
import { defaultEcosystemIncident } from "../data/ecosystem/incidents";
import { jsPDF } from "jspdf";

import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";

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

    const incident = defaultEcosystemIncident;

    const reportReadiness = simulationFinished
        ? reportGenerated
            ? 100
            : 72
        : 35;

    const evidenceCount =
        (incident?.iocs?.length ?? 0) +
        (incident?.mitre?.length ?? 0) +
        alertCount +
        logCount;

    function exportClientPDF() {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        let y = 18;

        function section(title) {
            y += 8;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.text(title, 14, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
        }

        function line(label, value) {
            const text = `${label}: ${value ?? "N/A"}`;
            const wrapped = doc.splitTextToSize(text, pageWidth - 28);
            doc.text(wrapped, 14, y);
            y += wrapped.length * 6;
        }

        function ensureSpace(space = 30) {
            if (y + space > 280) {
                doc.addPage();
                y = 18;
            }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Purple Team Lab - Client Incident Report", 14, y);

        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);

        section("Executive Summary");
        line("Incident", `${incident.id} - ${incident.title}`);
        line("Status", visibleStatus);
        line("Severity", incident.severity);
        line("Summary", incident.summary);
        line("Report Readiness", `${reportReadiness}%`);
        line("Evidence Count", evidenceCount);

        ensureSpace();
        section("Victim / Attacker Context");
        line("Victim User", incident.victim.user);
        line("Victim Email", incident.victim.email);
        line("Role", incident.victim.role);
        line("Attacker IP", incident.attacker.ip);
        line("Attacker Domain", incident.attacker.domain);
        line("Attacker URL", incident.attacker.url);

        ensureSpace();
        section("Simulation Results");
        line("Mode", mode);
        line("Detection Status", visibleStatus);
        line("Coverage", `${mode === "campaign" ? selectedCampaignCoverage : adjustedState?.adjustedCoverage ?? 0}%`);
        line("Observed Logs", logCount);
        line("Triggered Alerts", alertCount);
        line("Enabled Controls", activeControls.length ? activeControls.join(", ") : "None");

        ensureSpace();
        section("MITRE Mapping");
        incident.mitre.forEach((technique) => {
            ensureSpace(12);
            line(technique.id, `${technique.name} - ${technique.tactic}`);
        });

        ensureSpace();
        section("Indicators of Compromise");
        incident.iocs.forEach((ioc) => {
            ensureSpace(12);
            line(ioc.type.toUpperCase(), ioc.value);
        });

        ensureSpace();
        section("Timeline");
        incident.timeline.forEach((event) => {
            ensureSpace(16);
            line(`${event.time} / ${event.stage}`, `${event.title} - ${event.message}`);
        });

        ensureSpace();
        section("Analyst Summary");
        line("Purple Summary", purpleSummary);

        doc.save(`${incident.id}-purple-team-client-report.pdf`);
    }

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
                    <PanelCard variant="elevated">
                        <PanelHeader
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
                    </PanelCard>
                </>
            }
            center={
                <>
                    {/* ========================================
             📄 Purple Report
          ======================================== */}
                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<Shield className="h-5 w-5 text-cyber-violet" />}
                            title="Executive Incident Report"
                            subtitle="Client-ready summary generated from the shared ecosystem incident"
                        />

                        <div className="mt-4 rounded-2xl border border-cyber-violet/20 bg-cyber-violet/10 p-4">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-cyber-violet">
                                        {incident.id}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold text-cyber-text">
                                        {incident.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-cyber-muted">
                                        {incident.summary}
                                    </p>
                                </div>

                                <div className="grid min-w-[220px] grid-cols-2 gap-2">
                                    <MiniStat label="Readiness" value={`${reportReadiness}%`} tone="text-cyber-green" />
                                    <MiniStat label="Evidence" value={evidenceCount} tone="text-cyber-blue" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                            <EvidenceCard
                                icon={<UserRound className="h-4 w-4 text-cyber-violet" />}
                                label="Victim"
                                value={incident.victim.user}
                            />
                            <EvidenceCard
                                icon={<Globe className="h-4 w-4 text-cyber-red" />}
                                label="Source IP"
                                value={incident.attacker.ip}
                            />
                            <EvidenceCard
                                icon={<MailWarning className="h-4 w-4 text-cyber-amber" />}
                                label="Domain"
                                value={incident.attacker.domain}
                            />
                            <EvidenceCard
                                icon={<Radar className="h-4 w-4 text-cyber-blue" />}
                                label="Technique"
                                value={incident.context.technique}
                            />
                        </div>
                    </PanelCard>

                    <PanelCard variant="signal">
                        <PanelHeader
                            icon={<FileText className="h-5 w-5 text-cyber-blue" />}
                            title="Purple Report"
                            subtitle={mode === "campaign" ? "Generate a global campaign report" : "Generate a final report for the active scenario"}
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button
                                onClick={() => setReportGenerated(true)}
                                disabled={false}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-blue/30 bg-cyber-blue/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-blue/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FileText className="h-4 w-4" />
                                Generate Report
                            </button>

                            <button
                                onClick={exportClientPDF}
                                disabled={false}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-green/30 bg-cyber-green/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-green/20 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FileText className="h-4 w-4" />
                                Export Client PDF
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
                    </PanelCard>
                </>
            }
            right={
                <>
                    {/* ========================================
             📊 Coverage Analytics
          ======================================== */}
                    <PanelCard variant="threat">
                        <PanelHeader
                            icon={<Network className="h-5 w-5 text-cyber-violet" />}
                            title="Report Evidence"
                            subtitle="MITRE mapping and IoC bundle for the final report"
                        />
                        <p className="text-xs text-cyber-muted mt-2">
                            {incident.mitre.length} MITRE techniques · {incident.iocs.length} indicators
                        </p>

                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="mb-2 text-xs uppercase tracking-wide text-cyber-muted">
                                    MITRE Techniques
                                </p>
                                <div className="space-y-2">
                                    {incident.mitre.map((technique) => (
                                        <PanelCard variant="glass" dense>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-cyber-text">
                                                        {technique.id}
                                                    </p>
                                                    <p className="text-xs text-cyber-muted">
                                                        {technique.name}
                                                    </p>
                                                </div>

                                                <span className="rounded-lg border border-cyber-violet/30 bg-cyber-violet/10 px-2 py-0.5 text-[10px] font-semibold text-cyber-violet">
                                                    {technique.tactic}
                                                </span>
                                            </div>
                                        </PanelCard>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs uppercase tracking-wide text-cyber-muted">
                                    Indicators
                                </p>
                                <div className="space-y-2">
                                    {incident.iocs.map((ioc) => (
                                        <PanelCard variant="threat" dense>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] uppercase tracking-[0.18em] text-cyber-muted">
                                                    {ioc.type}
                                                </p>

                                                <span className="rounded-md border border-cyber-red/30 bg-cyber-red/10 px-2 py-0.5 text-[10px] text-cyber-red">
                                                    IOC
                                                </span>
                                            </div>

                                            <p className="mt-2 break-words font-mono text-xs text-cyber-text">
                                                {ioc.value}
                                            </p>
                                        </PanelCard>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PanelCard>

                    <PanelCard variant="elevated">
                        <PanelHeader
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
                    </PanelCard>
                </>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

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
        <PanelCard variant="glass" dense>
            <p className="text-xs uppercase tracking-wide text-cyber-muted">{label}</p>
            <p className={`mt-2 break-words text-xl font-bold ${tone}`}>{value}</p>
        </PanelCard>
    );
}

function EvidenceCard({ icon, label, value }) {
    return (
        <PanelCard variant="glass" dense>
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-xs uppercase tracking-wide text-cyber-muted">
                    {label}
                </p>
            </div>
            <p className="mt-2 break-words text-sm font-semibold text-cyber-text">
                {value}
            </p>
        </PanelCard>
    );
}