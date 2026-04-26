import {
    ListChecks,
    Swords,
    SlidersHorizontal,
    Lock,
    ShieldCheck,
    Network,
    Radar,
    Database,
    Play,
    RotateCcw,
    Shield,
    FolderPlus,
} from "lucide-react";

import SessionList from "../components/sessions/SessionList";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import MiniKillChainProgress from "../components/red/MiniKillChainProgress";
import SimulationLiveTerminal from "../components/red/SimulationLiveTerminal";
import OffensiveNarrativePanel from "../components/red/OffensiveNarrativePanel";
import ThreatActorProfilesPanel from "../components/red/ThreatActorProfilesPanel";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";

/* ========================================
   🔴 Red View
======================================== */

export default function RedView({
    sessions,
    activeSessionId,
    setActiveSession,
    createSession,
    mode,
    setMode,
    scenarios,
    selectedScenario,
    selectedCampaignScenarios,
    campaignScenarioIds,
    setSelectedScenarioId,
    toggleCampaignScenarioId,
    controls,
    toggleControl,
    handleResetControls,
    runSimulation,
    resetSimulation,
    isRunning,
    getScenarioAdjustedState,
    severityClasses,
    statusClasses,
    displayedEvents,
}) {
    const selectedCount =
        mode === "campaign" ? selectedCampaignScenarios.length : 1;

    const headerStats = [
        {
            label: "Mode",
            value: mode,
            icon: <ListChecks className="h-4 w-4 text-cyber-violet" />,
        },
        {
            label: "Scenarios",
            value: scenarios.length,
            icon: <Swords className="h-4 w-4 text-cyber-red" />,
        },
        {
            label: "Selected",
            value: selectedCount,
            icon: <Shield className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Status",
            value: isRunning ? "Running" : "Ready",
            icon: <Play className="h-4 w-4 text-cyber-green" />,
        },
    ];

    return (
        <PageShell
            header={
                <PageHeader
                    eyebrow="RED OPERATIONS"
                    title="Attack Launcher & Control Tuning"
                    description="Configure scenarios, build campaigns, manage sessions and prepare the offensive side of the simulation workflow."
                    stats={headerStats}
                />
            }
            left={
                <>
                    <PanelCard variant="signal" dense>
                        <button
                            onClick={() => createSession()}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-violet/20"
                        >
                            <FolderPlus className="h-4 w-4" />
                            New Session
                        </button>
                    </PanelCard>

                    <SessionList
                        sessions={sessions}
                        activeSessionId={activeSessionId}
                        onSelectSession={setActiveSession}
                    />

                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<ListChecks className="h-5 w-5 text-cyber-violet" />}
                            title="Execution Mode"
                            subtitle="Choose single scenario or campaign mode"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <ModeButton
                                active={mode === "single"}
                                onClick={() => setMode("single")}
                                label="Single"
                            />
                            <ModeButton
                                active={mode === "campaign"}
                                onClick={() => setMode("campaign")}
                                label="Campaign"
                            />
                        </div>
                    </PanelCard>

                    <PanelCard variant="threat" dense glow={mode === "campaign"}>
                        <PanelHeader
                            icon={<Swords className="h-5 w-5 text-cyber-red" />}
                            title={mode === "campaign" ? "Campaign Builder" : "Scenario Selection"}
                            subtitle={
                                mode === "campaign"
                                    ? "Select multiple scenarios to chain together"
                                    : "Choose the active offensive scenario"
                            }
                        />

                        <div className="mt-4 space-y-3">
                            {scenarios.map((scenario) => {
                                const activeSingle = selectedScenario?.id === scenario.id;
                                const activeCampaign = campaignScenarioIds.includes(scenario.id);
                                const active = mode === "campaign" ? activeCampaign : activeSingle;
                                const scenarioAdjusted = getScenarioAdjustedState(scenario, controls);

                                return (
                                    <ScenarioCard
                                        key={scenario.id}
                                        scenario={scenario}
                                        active={active}
                                        adjustedStatus={scenarioAdjusted.adjustedStatus}
                                        onClick={() =>
                                            mode === "campaign"
                                                ? toggleCampaignScenarioId(scenario.id)
                                                : setSelectedScenarioId(scenario.id)
                                        }
                                        severityClasses={severityClasses}
                                        statusClasses={statusClasses}
                                    />
                                );
                            })}
                        </div>
                    </PanelCard>
                </>
            }
            center={
                <>
                    <MiniKillChainProgress
                        displayedEvents={displayedEvents}
                        isRunning={isRunning}
                    />

                    <SimulationLiveTerminal
                        events={displayedEvents}
                        isRunning={isRunning}
                    />

                    <OffensiveNarrativePanel
                        events={displayedEvents}
                        selectedScenario={selectedScenario}
                        mode={mode}
                        selectedCampaignScenarios={selectedCampaignScenarios}
                        isRunning={isRunning}
                    />

                    <ThreatActorProfilesPanel
                        scenarios={scenarios}
                        mode={mode}
                        setMode={setMode}
                        setSelectedScenarioId={setSelectedScenarioId}
                        campaignScenarioIds={campaignScenarioIds}
                        toggleCampaignScenarioId={toggleCampaignScenarioId}
                    />
                </>
            }
            right={
                <>
                    <PanelCard
                        variant="hot"
                        live={isRunning}
                        stress={isRunning}
                        scan={isRunning}
                        hotLevel={isRunning ? "high" : "medium"}
                    >
                        <PanelHeader
                            icon={<Play className="h-5 w-5 text-cyber-green" />}
                            title="Execution Controls"
                            subtitle="Launch or reset the live offensive simulation"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <button
                                onClick={runSimulation}
                                disabled={isRunning || (mode === "campaign" && selectedCampaignScenarios.length === 0)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-violet/30 bg-cyber-violet/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyber-violet/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Play className="h-4 w-4" />
                                {isRunning
                                    ? "Running..."
                                    : mode === "campaign"
                                        ? "Run Campaign"
                                        : "Run Scenario"}
                            </button>

                            <button
                                onClick={resetSimulation}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyber-border bg-cyber-panel2 px-4 py-3 text-sm font-semibold text-cyber-text transition hover:border-cyber-violet/40"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                        </div>
                    </PanelCard>

                    <PanelCard variant="defense">
                        <PanelHeader
                            icon={<SlidersHorizontal className="h-5 w-5 text-cyber-violet" />}
                            title="Defensive Controls"
                            subtitle="Enable controls to improve detection coverage"
                        />

                        <div className="mt-4 space-y-3">
                            <ControlToggle
                                label="MFA"
                                description="Strengthens authentication and access scenarios."
                                enabled={controls.mfa}
                                onClick={() => toggleControl("mfa")}
                                icon={<Lock className="h-4 w-4 text-cyber-violet" />}
                                tone="violet"
                            />
                            <ControlToggle
                                label="EDR"
                                description="Improves behavioral detections on endpoints."
                                enabled={controls.edr}
                                onClick={() => toggleControl("edr")}
                                icon={<ShieldCheck className="h-4 w-4 text-cyber-green" />}
                                tone="green"
                            />
                            <ControlToggle
                                label="IDS"
                                description="Improves network visibility and recon detections."
                                enabled={controls.ids}
                                onClick={() => toggleControl("ids")}
                                icon={<Network className="h-4 w-4 text-cyber-blue" />}
                                tone="blue"
                            />
                            <ControlToggle
                                label="SIEM Correlation"
                                description="Correlates multiple signals to improve detection quality."
                                enabled={controls.siem}
                                onClick={() => toggleControl("siem")}
                                icon={<Radar className="h-4 w-4 text-cyber-amber" />}
                                tone="amber"
                            />
                            <ControlToggle
                                label="DLP"
                                description="Monitors sensitive data movement and exfiltration."
                                enabled={controls.dlp}
                                onClick={() => toggleControl("dlp")}
                                icon={<Database className="h-4 w-4 text-cyan-400" />}
                                tone="blue"
                            />
                        </div>

                        <button
                            onClick={handleResetControls}
                            className="mt-4 w-full rounded-2xl border border-cyber-border bg-cyber-panel2 px-4 py-3 text-sm font-semibold text-cyber-text transition hover:border-cyber-violet/40"
                        >
                            Reset Controls
                        </button>
                    </PanelCard>
                </>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function ScenarioCard({
    scenario,
    active,
    adjustedStatus,
    onClick,
    severityClasses,
    statusClasses,
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-200",
                active
                    ? "border-cyber-violet bg-[linear-gradient(180deg,rgba(40,18,72,0.22),rgba(12,10,20,0.88))] shadow-[0_0_22px_rgba(139,92,246,0.14)]"
                    : "border-cyber-border bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,24,0.96))] hover:border-cyber-violet/30 hover:bg-[linear-gradient(180deg,rgba(22,28,42,0.96),rgba(12,16,26,0.98))]",
            ].join(" ")}
        >
            <div
                className={`absolute inset-y-0 left-0 w-[3px] transition-all ${active
                    ? "bg-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.35)]"
                    : "bg-transparent group-hover:bg-cyber-violet/40"
                    }`}
            />

            <div className="flex items-start justify-between gap-3 pl-1">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-cyber-text md:text-base">
                        {scenario.name}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-cyber-muted">
                        {scenario.summary}
                    </p>
                </div>

                <span className="rounded-lg border border-cyber-border bg-black/10 px-2 py-1 text-[11px] text-cyber-muted">
                    {scenario.technique}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 pl-1">
                <Badge className={severityClasses(scenario.severity)}>
                    {scenario.severity}
                </Badge>
                <Badge className={statusClasses(adjustedStatus)}>
                    {adjustedStatus}
                </Badge>
            </div>
        </button>
    );
}

function Badge({ children, className = "" }) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-semibold tracking-[0.02em]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

function ModeButton({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={[
                "rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200",
                active
                    ? "border-cyber-violet bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(139,92,246,0.08))] text-cyber-violet shadow-[0_0_16px_rgba(139,92,246,0.12)]"
                    : "border-cyber-border bg-cyber-panel2 text-cyber-text hover:border-cyber-violet/30 hover:bg-cyber-panel",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function ControlToggle({
    label,
    description,
    enabled,
    onClick,
    icon,
    tone = "violet",
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "group w-full rounded-xl border p-4 text-left transition-all duration-200",
                enabled
                    ? getEnabledControlCardClass(tone)
                    : "border-cyber-border bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,24,0.96))] hover:border-cyber-violet/25 hover:bg-[linear-gradient(180deg,rgba(21,28,42,0.96),rgba(11,16,24,0.98))]",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div
                        className={[
                            "mt-0.5 rounded-xl border p-2 transition-all",
                            enabled
                                ? getEnabledControlIconClass(tone)
                                : "border-cyber-border bg-cyber-bgSoft text-cyber-muted group-hover:border-cyber-violet/20",
                        ].join(" ")}
                    >
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-cyber-text">
                            {label}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-cyber-muted">
                            {description}
                        </p>
                    </div>
                </div>

                <div
                    className={[
                        "mt-1 flex h-6 w-11 items-center rounded-full border px-[2px] transition-all duration-200",
                        enabled
                            ? getToggleTrackClass(tone)
                            : "border-cyber-border bg-cyber-bgSoft",
                    ].join(" ")}
                >
                    <div
                        className={[
                            "h-5 w-5 rounded-full bg-white transition-transform duration-200",
                            enabled ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                    />
                </div>
            </div>
        </button>
    );
}

function getEnabledControlCardClass(tone) {
    if (tone === "green") {
        return "border-cyber-green/30 bg-[linear-gradient(180deg,rgba(8,40,24,0.22),rgba(8,12,10,0.92))] shadow-[0_0_16px_rgba(34,197,94,0.10)]";
    }

    if (tone === "blue") {
        return "border-cyber-blue/30 bg-[linear-gradient(180deg,rgba(16,34,72,0.20),rgba(10,14,24,0.94))] shadow-[0_0_16px_rgba(59,130,246,0.10)]";
    }

    if (tone === "amber") {
        return "border-cyber-amber/30 bg-[linear-gradient(180deg,rgba(82,52,8,0.18),rgba(18,12,8,0.90))] shadow-[0_0_16px_rgba(245,158,11,0.08)]";
    }

    return "border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(40,18,72,0.22),rgba(12,10,20,0.90))] shadow-[0_0_16px_rgba(139,92,246,0.10)]";
}

function getEnabledControlIconClass(tone) {
    if (tone === "green") {
        return "border-cyber-green/25 bg-cyber-green/10";
    }

    if (tone === "blue") {
        return "border-cyber-blue/25 bg-cyber-blue/10";
    }

    if (tone === "amber") {
        return "border-cyber-amber/25 bg-cyber-amber/10";
    }

    return "border-cyber-violet/25 bg-cyber-violet/10";
}

function getToggleTrackClass(tone) {
    if (tone === "green") return "border-cyber-green bg-cyber-green/30";
    if (tone === "blue") return "border-cyber-blue bg-cyber-blue/30";
    if (tone === "amber") return "border-cyber-amber bg-cyber-amber/30";
    return "border-cyber-violet bg-cyber-violet/30";
}