import { useMemo, useState } from "react";
import MetricCard from "../components/ui/MetricCard";
import ScenarioPanel from "../components/scenario/ScenarioPanel";
import TimelinePanel from "../components/timeline/TimelinePanel";
import EventTable from "../components/events/EventTable";
import IdentityCard from "../components/identities/IdentityCard";
import AttackPathPanel from "../components/attack/AttackPathPanel";
import Panel from "../components/ui/Panel";
import IncidentStatusBar from "../components/status/IncidentStatusBar";
import RiskEvolutionChart from "../components/status/RiskEvolutionChart";
import ImpactTrendChart from "../components/status/ImpactTrendChart";
import ThreatGaugeCard from "../components/status/ThreatGaugeCard";
import InteractiveAccessGraph from "../components/graph/interactive/InteractiveAccessGraph";
import ScenarioProgressionMap from "../components/scenario/ScenarioProgressionMap";
import MitreCoveragePanel from "../components/attack/MitreCoveragePanel";
import OffensiveRecommendationsPanel from "../components/attack/OffensiveRecommendationsPanel";
import ReplayControlPanel from "../components/replay/ReplayControlPanel";

import LinkedIncidentBanner from "../components/ecosystem/LinkedIncidentBanner";
import PurpleTeamContextPanel from "../components/ecosystem/PurpleTeamContextPanel";
import CampaignSummaryPanel from "../components/overview/CampaignSummaryPanel";
import BestNextActionPanel from "../components/overview/BestNextActionPanel";
import AttackStoryMode from "../components/story/AttackStoryMode";
import AttackExplanationLayer from "../components/entities/AttackExplanationLayer";
import StoryDebriefPanel from "../components/story/StoryDebriefPanel";

const viewMeta = {
    overview: {
        eyebrow: "Operator Overview",
        title: "Identity Threat Console",
        subtitle:
            "Live campaign posture, identity compromise pressure and recommended next operator moves.",
    },
    scenarios: {
        eyebrow: "Attack Launcher",
        title: "Scenario Control",
        subtitle:
            "Run chained identity-centric attacks and track which phases are locked, ready or complete.",
    },
    graph: {
        eyebrow: "Access Pathing",
        title: "Identity Graph",
        subtitle:
            "Inspect enterprise identities, access groups, systems and offensive routes to crown jewels.",
    },
    replay: {
        eyebrow: "Timeline Replay",
        title: "Attack Replay",
        subtitle:
            "Step through the active scenario and correlate replay focus with timeline and event evidence.",

    },
    story: {
        eyebrow: "Attack Narrative",
        title: "Attack Story Mode",
        subtitle:
            "Replay the active identity attack as a narrated operator sequence.",
    },
    intelligence: {
        eyebrow: "Threat Intelligence",
        title: "Campaign Intelligence",
        subtitle:
            "Analyze risk evolution, MITRE coverage and the current attack path completion state.",
    },
    entities: {
        eyebrow: "Identity Inventory",
        title: "Entities",
        subtitle:
            "Review compromised, privileged and safe identities in the simulated enterprise estate.",
    },
};

function PageHeader({ activeView, incidentProfile }) {
    const meta = viewMeta[activeView] || viewMeta.overview;

    return (
        <header className="panel-red grid-bg overflow-hidden p-5">
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.32em] text-danger">
                        {meta.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                        {meta.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                        {meta.subtitle}
                    </p>
                </div>

                {incidentProfile ? (
                    <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.08)]">
                        Linked incident:{" "}
                        <span className="font-semibold">{incidentProfile.id}</span>
                    </div>
                ) : null}
            </div>
        </header>
    );
}

function CampaignSummary({ state, currentReplayStep }) {
    const latestRisk = state.riskHistory?.[state.riskHistory.length - 1]?.risk ?? 0;
    const latestEvent = state.events?.[state.events.length - 1];
    const completedSteps = state.attackPath.filter((step) => step.complete).length;

    const cards = [
        {
            label: "Risk Score",
            value: latestRisk,
            hint: "current pressure",
            tone: "text-red-200",
        },
        {
            label: "Completed Steps",
            value: `${completedSteps}/${state.attackPath.length}`,
            hint: "attack chain",
            tone: "text-amber-200",
        },
        {
            label: "Last Event",
            value: latestEvent?.technique || "Baseline",
            hint: latestEvent?.timestamp || "ready",
            tone: "text-zinc-100",
        },
    ];

    return (
        <Panel
            title="Current Campaign"
            subtitle="Condensed operational context for the active identity attack simulation."
        >
            <div className="grid gap-4 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-line/70 bg-black/25 p-4"
                    >
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            {card.label}
                        </p>
                        <p className={`mt-3 text-xl font-bold ${card.tone}`}>
                            {card.value}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">{card.hint}</p>
                    </div>
                ))}
            </div>

            {currentReplayStep ? (
                <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Replay Focus
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {currentReplayStep.technique} from{" "}
                        <span className="font-semibold text-red-200">
                            {currentReplayStep.sourceIdentity}
                        </span>{" "}
                        toward{" "}
                        <span className="font-semibold text-zinc-100">
                            {currentReplayStep.targetSystem}
                        </span>
                        .
                    </p>
                </div>
            ) : null}
        </Panel>
    );
}

function RecentEventsPanel({ events = [] }) {
    const recentEvents = events.slice(-5).reverse();

    return (
        <Panel
            title="Recent Activity"
            subtitle="Latest simulated identity and access events."
        >
            <div className="space-y-3">
                {recentEvents.map((event) => (
                    <div
                        key={event.id}
                        className="rounded-2xl border border-line/70 bg-black/25 p-4"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="font-semibold text-zinc-100">{event.technique}</p>
                                <p className="mt-1 text-sm text-zinc-400">
                                    {event.sourceIdentity} → {event.targetSystem}
                                </p>
                            </div>
                            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                {event.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function EntityFilters({ value, onChange }) {
    const filters = [
        { id: "all", label: "All" },
        { id: "compromised", label: "Compromised" },
        { id: "privileged", label: "Privileged" },
        { id: "safe", label: "Safe" },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    type="button"
                    onClick={() => onChange(filter.id)}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${value === filter.id
                        ? "border-danger/30 bg-danger/10 text-red-200"
                        : "border-line/70 bg-black/30 text-zinc-300 hover:border-danger/20 hover:bg-danger/10"
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

export default function DashboardPage({
    state,
    activeView,
    onRunScenario,
    currentReplayStep,
    incidentParams,
    incidentProfile,
    onReplayPlayPause,
    onReplayNext,
    onReplayPrevious,
    onReplayReset,
    onReplaySpeedChange,
}) {
    const [entityFilter, setEntityFilter] = useState("all");

    const metricList = [
        { label: "Users", value: state.metrics.users, hint: "managed identities" },
        {
            label: "Privileged Accounts",
            value: state.metrics.privilegedAccounts,
            hint: "elevated exposure",
        },
        {
            label: "Compromised Identities",
            value: state.metrics.compromisedIdentities,
            hint: "currently impacted",
        },
        {
            label: "Active Sessions",
            value: state.metrics.activeSessions,
            hint: "live access contexts",
        },
        {
            label: "Lateral Movement Attempts",
            value: state.metrics.lateralMovementAttempts,
            hint: "pivot activity",
        },
        {
            label: "Critical Assets Reached",
            value: state.metrics.criticalAssetsReached,
            hint: "objective pressure",
        },
    ];

    const incidentStatus =
        state.metrics.criticalAssetsReached > 0
            ? {
                tone: "critical",
                label: "Critical",
                message: "Critical identity attack path has reached sensitive assets.",
            }
            : state.metrics.compromisedIdentities > 0
                ? {
                    tone: "high",
                    label: "Identity Breach",
                    message: "Compromised identities are active in the environment.",
                }
                : state.metrics.lateralMovementAttempts > 0
                    ? {
                        tone: "medium",
                        label: "Suspicious Movement",
                        message: "Lateral movement activity has been observed.",
                    }
                    : {
                        tone: "stable",
                        label: "Stable",
                        message:
                            "The corporate identity environment is currently operating within its baseline state.",
                    };

    const filteredUsers = useMemo(() => {
        return state.users.filter((user) => {
            if (entityFilter === "compromised") {
                return ["compromised", "privileged-compromised"].includes(user.status);
            }

            if (entityFilter === "privileged") {
                return ["elevated", "privileged"].includes(user.privilege);
            }

            if (entityFilter === "safe") {
                return user.status === "safe";
            }

            return true;
        });
    }, [entityFilter, state.users]);

    return (
        <div className="space-y-6">
            <PageHeader activeView={activeView} incidentProfile={incidentProfile} />

            <LinkedIncidentBanner
                params={incidentParams}
                incidentProfile={incidentProfile}
            />

            {activeView === "overview" && (
                <div className="space-y-6">
                    <section id="overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {metricList.map((metric) => (
                            <MetricCard key={metric.label} {...metric} />
                        ))}
                    </section>

                    <IncidentStatusBar status={incidentStatus} />

                    <CampaignSummaryPanel state={state} />

                    <div className="grid gap-6 2xl:grid-cols-[1fr_0.9fr]">
                        <BestNextActionPanel state={state} />
                        <RecentEventsPanel events={state.events} />
                    </div>
                </div>
            )}

            {activeView === "scenarios" && (
                <div id="scenarios" className="space-y-6">
                    <ScenarioPanel
                        launchedScenarios={state.launchedScenarios}
                        onRunScenario={onRunScenario}
                    />

                    <ScenarioProgressionMap launchedScenarios={state.launchedScenarios} />
                </div>
            )}

            {activeView === "graph" && (
                <div id="graph" className="space-y-6">
                    <PurpleTeamContextPanel incidentProfile={incidentProfile} />

                    <InteractiveAccessGraph
                        users={state.users}
                        groups={state.groups}
                        systems={state.systems}
                        currentReplayStep={currentReplayStep}
                        linkedUser={incidentParams?.user}
                    />
                </div>
            )}

            {activeView === "replay" && (
                <div id="replay" className="space-y-6">
                    <ReplayControlPanel
                        replay={state.replay}
                        onPlayPause={onReplayPlayPause}
                        onNext={onReplayNext}
                        onPrevious={onReplayPrevious}
                        onReset={onReplayReset}
                        onSpeedChange={onReplaySpeedChange}
                    />

                    <TimelinePanel
                        items={state.timeline}
                        currentReplayStep={currentReplayStep}
                    />

                    <EventTable events={state.events} />
                </div>
            )}

            {activeView === "story" && (
                <div id="story" className="space-y-6">
                    <AttackStoryMode
                        replay={state.replay}
                        currentReplayStep={currentReplayStep}
                        onPlayPause={onReplayPlayPause}
                        onNext={onReplayNext}
                        onPrevious={onReplayPrevious}
                        onReset={onReplayReset}
                    />

                    <StoryDebriefPanel state={state} />
                </div>
            )}

            {activeView === "intelligence" && (
                <div id="intelligence" className="space-y-6">
                    <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
                        <RiskEvolutionChart riskHistory={state.riskHistory} />
                        <ImpactTrendChart riskHistory={state.riskHistory} />
                    </div>

                    <ThreatGaugeCard data={state.riskHistory} />

                    <AttackPathPanel steps={state.attackPath} />

                    <MitreCoveragePanel launchedScenarios={state.launchedScenarios} />
                </div>
            )}

            {activeView === "entities" && (
                <div id="entities" className="space-y-6">
                    <Panel
                        title="Identity Inventory"
                        subtitle="Filter identities by compromise state, privilege tier and offensive value."
                        actions={
                            <EntityFilters
                                value={entityFilter}
                                onChange={setEntityFilter}
                            />
                        }
                    >
                        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                            {filteredUsers.map((user) => (
                                <IdentityCard key={user.id} user={user} />
                            ))}
                        </div>
                    </Panel>
                    <AttackExplanationLayer state={state} />
                </div>
            )}

        </div>
    );
}
