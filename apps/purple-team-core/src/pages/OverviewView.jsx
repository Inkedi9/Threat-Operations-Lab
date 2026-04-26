import {
    Shield,
    Swords,
    Radar,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Layers3,
} from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";
import MetricCard from "../components/ui/MetricCard";

import IncidentEcosystemHub from "../components/ecosystem/IncidentEcosystemHub";
import { defaultEcosystemIncident } from "../data/ecosystem/incidents";

/* ========================================
   🏠 Overview View
======================================== */

export default function OverviewView({
    scenariosCount,
    displayedEventsCount,
    alertCount,
    visibleCoverage,
    mode,
    selectedScenario,
    selectedCampaignScenarios,
    visibleStatus,
    purpleSummary,
}) {
    const headerStats = [
        {
            label: "Scenarios",
            value: scenariosCount,
            icon: <Swords className="h-4 w-4 text-cyber-red" />,
        },
        {
            label: "Telemetry",
            value: displayedEventsCount,
            icon: <Radar className="h-4 w-4 text-cyber-blue" />,
        },
        {
            label: "Alerts",
            value: alertCount,
            icon: <AlertTriangle className="h-4 w-4 text-cyber-amber" />,
        },
        {
            label: "Coverage",
            value: `${visibleCoverage}%`,
            icon: <CheckCircle2 className="h-4 w-4 text-cyber-green" />,
        },
    ];

    return (
        <PageShell
            header={
                <PageHeader
                    eyebrow="PURPLE TEAM VALIDATION PLATFORM"
                    title="Purple Team Lab"
                    description="Simule des scénarios uniques ou des campagnes complètes, active des contrôles défensifs et mesure leur impact sur la détection."
                    stats={headerStats}
                />
            }
            left={
                <PanelCard variant="elevated">
                    <PanelHeader
                        icon={<Shield className="h-5 w-5 text-cyber-violet" />}
                        title="Platform Areas"
                        subtitle="Use the floating topbar to navigate the lab"
                    />

                    <div className="mt-4 space-y-3">
                        <QuickItem
                            variant="threat"
                            title="Red"
                            text="Attack launcher, campaign setup and offensive workflow."
                        />
                        <QuickItem
                            variant="intel"
                            title="Purple"
                            text="Timeline, kill chain and detection gap analysis."
                        />
                        <QuickItem
                            variant="defense"
                            title="Blue"
                            text="Alert triage queue and analyst investigation flow."
                        />
                        <QuickItem
                            variant="signal"
                            title="Output"
                            text="Reports, analytics and simulation results."
                        />
                        <QuickItem
                            variant="signal"
                            title="War Room"
                            text="Immersive operator console with live cyber ops view."
                        />
                    </div>
                </PanelCard>
            }
            center={
                <>
                    <PanelCard variant="default">
                        <PanelHeader
                            icon={<Radar className="h-5 w-5 text-cyber-blue" />}
                            title="Current Operation"
                            subtitle="Live summary of the active simulation context"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
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
                                        ? `${selectedCampaignScenarios.length} scenarios`
                                        : selectedScenario?.name ?? "n/a"
                                }
                                variant="signal"
                                accent="blue"
                            />
                            <MetricCard
                                label="Status"
                                value={visibleStatus}
                                variant={getStatusVariant(visibleStatus)}
                                accent={getStatusAccent(visibleStatus)}
                                tone={getStatusTone(visibleStatus)}
                            />
                        </div>

                        <div className="mt-4">
                            <PanelCard variant="intel" dense>
                                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyber-muted">
                                    Summary
                                </p>
                                <p className="text-sm leading-7 text-cyber-text">
                                    {purpleSummary}
                                </p>
                            </PanelCard>
                        </div>
                    </PanelCard>

                    <IncidentEcosystemHub incident={defaultEcosystemIncident} />

                    <PanelCard variant="default">
                        <PanelHeader
                            icon={<CheckCircle2 className="h-5 w-5 text-cyber-green" />}
                            title="Mission"
                            subtitle="What this platform is designed to demonstrate"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <QuickItem
                                variant="threat"
                                title="Attack Simulation"
                                text="Execute offensive scenarios and chained campaigns in a controlled environment."
                            />
                            <QuickItem
                                variant="glass"
                                title="Telemetry Visibility"
                                text="Observe logs, alerts and validation signals generated by the simulation engine."
                            />
                            <QuickItem
                                variant="defense"
                                title="Defensive Tuning"
                                text="Enable controls like MFA, EDR, IDS, SIEM and DLP to improve outcomes."
                            />
                            <QuickItem
                                variant="intel"
                                title="Purple Validation"
                                text="Measure detection quality, identify gaps and produce meaningful outputs."
                            />
                        </div>
                    </PanelCard>
                </>
            }
            right={
                <PanelCard variant="intel" glow>
                    <PanelHeader
                        icon={<Sparkles className="h-5 w-5 text-cyber-violet" />}
                        title="Overview Snapshot"
                        subtitle="Quick at-a-glance platform context"
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3">
                        <MetricCard
                            label="Active Mode"
                            value={mode}
                            variant="intel"
                            accent="violet"
                        />
                        <MetricCard
                            label="Scenario Scope"
                            value={
                                mode === "campaign"
                                    ? `${selectedCampaignScenarios.length} selected`
                                    : selectedScenario?.technique ?? "n/a"
                            }
                            variant="signal"
                            accent="blue"
                        />
                        <MetricCard
                            label="Current Status"
                            value={visibleStatus}
                            variant={getStatusVariant(visibleStatus)}
                            accent={getStatusAccent(visibleStatus)}
                            tone={getStatusTone(visibleStatus)}
                        />
                        <MetricCard
                            label="Coverage"
                            value={`${visibleCoverage}%`}
                            variant="defense"
                            accent="green"
                            tone="text-cyber-green"
                        />
                    </div>
                </PanelCard>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function QuickItem({ title, text, variant = "signal" }) {
    return (
        <PanelCard variant={variant} dense>
            <p className="text-sm font-semibold text-cyber-text">{title}</p>
            <p className="mt-2 text-sm leading-6 text-cyber-muted">{text}</p>
        </PanelCard>
    );
}

function getStatusVariant(status) {
    if (status === "Missed") return "threat";
    if (status === "Detected") return "defense";
    return "signal";
}

function getStatusAccent(status) {
    if (status === "Missed") return "red";
    if (status === "Detected") return "green";
    return "amber";
}

function getStatusTone(status) {
    if (status === "Missed") return "text-cyber-red";
    if (status === "Detected") return "text-cyber-green";
    return "text-cyber-amber";
}