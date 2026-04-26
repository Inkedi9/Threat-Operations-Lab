import {
    ArrowUpRight,
    Crosshair,
    Fingerprint,
    Globe,
    MailWarning,
    Network,
    Radar,
    Shield,
    UserRound,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import StatusBadge from "../ui/StatusBadge";

import {
    buildAttackSurfaceLink,
    buildIncidentDeepLinks,
    buildTimelineEventLink,
    getModuleStatus,
} from "../../lib/ecosystemLinks";
import { buildGlobalAttackStory } from "../../lib/attackStoryBuilder";
import { INCIDENT_STATES, normalizeIncidentState } from "../../data/ecosystem/incidentStates";
import { buildIncidentEvolution } from "../../lib/incidentEvolution";

/* ========================================
   🌐 Incident Ecosystem Hub
======================================== */

export default function IncidentEcosystemHub({ incident }) {
    const links = buildIncidentDeepLinks(incident);
    const evolution = buildIncidentEvolution(incident);
    const primaryCTA = getPrimaryIncidentCTA(
        { ...incident, status: evolution.derivedState },
        links
    );
    const attackStory = buildGlobalAttackStory(incident);

    if (!incident) return null;

    return (
        <PanelCard variant="elevated" >
            <PanelHeader
                icon={<Network className="h-5 w-5 text-cyber-violet" />}
                title="Incident Ecosystem Hub"
                subtitle="Shared incident context linked across external cyber modules"
            />

            <div className="mt-4 space-y-4">
                <PanelCard variant="signal" dense>
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge kind="severity" value={incident.severity} />
                                <StatusBadge kind="status" value={incident.status} />
                                <span className="rounded-lg border border-cyber-border bg-black/10 px-3 py-1 text-[11px] font-semibold text-cyber-muted">
                                    {incident.id}
                                </span>
                            </div>

                            <h3 className="mt-3 text-xl font-bold tracking-[-0.02em] text-cyber-text">
                                {incident.title}
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-cyber-muted">
                                {incident.summary}
                            </p>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <a
                                href={primaryCTA.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative overflow-hidden rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-200 hover:-translate-y-[1px] hover:border-cyber-violet/50 hover:bg-cyber-violet/20"
                            >
                                ▶ {primaryCTA.label}
                            </a>

                            <span className="self-center text-xs text-cyber-muted">
                                {primaryCTA.helper}
                            </span>

                            <span className="text-xs text-cyber-muted self-center">
                                Launch entry module with shared context
                            </span>
                        </div>

                        <div className="grid min-w-[260px] grid-cols-2 gap-2">
                            <MiniEntity
                                icon={<UserRound className="h-4 w-4 text-cyber-violet" />}
                                label="User"
                                value={incident.victim.user}
                            />
                            <MiniEntity
                                icon={<Globe className="h-4 w-4 text-cyber-red" />}
                                label="IP"
                                value={incident.attacker.ip}
                            />
                            <MiniEntity
                                icon={<Fingerprint className="h-4 w-4 text-cyber-blue" />}
                                label="Domain"
                                value={incident.attacker.domain}
                            />
                            <MiniEntity
                                icon={<MailWarning className="h-4 w-4 text-cyber-amber" />}
                                label="Vector"
                                value="Phishing"
                            />
                        </div>
                    </div>
                </PanelCard>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <PanelCard variant="intel">
                        <PanelHeader
                            icon={<Crosshair className="h-5 w-5 text-cyber-violet" />}
                            title="Incident Flow"
                            subtitle="Modular path across the ecosystem"
                            compact
                        />

                        <div className="mt-4 flex flex-wrap gap-2">
                            {incident.flow.map((step, index) => (
                                <div
                                    key={step}
                                    className="rounded-xl border border-cyber-violet/20 bg-cyber-violet/10 px-3 py-2 text-xs font-semibold text-cyber-violet"
                                >
                                    {String(index + 1).padStart(2, "0")} · {step}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                            {incident.mitre.map((technique) => (
                                <div
                                    key={technique.id}
                                    className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-3"
                                >
                                    <p className="text-xs font-semibold text-cyber-text">
                                        {technique.id} — {technique.name}
                                    </p>
                                    <p className="mt-1 text-xs text-cyber-muted">
                                        {technique.tactic}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </PanelCard>

                    <PanelCard variant="threat">
                        <PanelHeader
                            icon={<Radar className="h-5 w-5 text-cyber-red" />}
                            title="IoC Bundle"
                            subtitle="Shared indicators"
                            compact
                        />

                        <div className="mt-4 space-y-2">
                            {incident.iocs.map((ioc) => (
                                <div
                                    key={`${ioc.type}-${ioc.value}`}
                                    className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyber-muted">
                                        {ioc.type}
                                    </p>
                                    <p className="mt-1 break-words text-xs font-semibold text-cyber-text">
                                        {ioc.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </PanelCard>
                </div>

                <PanelCard variant="signal">
                    <PanelHeader
                        icon={<Radar className="h-5 w-5 text-cyber-blue" />}
                        title="Cross-App Incident Timeline"
                        subtitle="Click each stage to pivot into the matching investigation module"
                        compact
                    />

                    <div className="mt-4 space-y-3">
                        {attackStory.stages.map((event, index) => {
                            const status = getModuleStatus(event.app);
                            const href = buildTimelineEventLink(incident, event);

                            return (
                                <div
                                    key={`${event.time}-${event.stage}`}
                                    className={`rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-[1px] ${event.riskTone === "hot"
                                        ? "border-cyber-red/35 bg-cyber-red/10 shadow-[0_0_24px_rgba(239,68,68,0.10)]"
                                        : event.riskTone === "threat"
                                            ? "border-cyber-red/25 bg-cyber-red/5"
                                            : event.riskTone === "defense"
                                                ? "border-cyber-blue/25 bg-cyber-blue/5"
                                                : event.riskTone === "intel"
                                                    ? "border-cyber-violet/25 bg-cyber-violet/5"
                                                    : "border-cyber-border bg-cyber-panel2"
                                        }`}
                                >
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group block"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 text-xs font-bold text-cyber-violet">
                                                    {String(index + 1).padStart(2, "0")}
                                                </div>

                                                {index < incident.timeline.length - 1 && (
                                                    <div className="mt-2 h-10 w-px bg-cyber-border" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-cyber-text">
                                                            {event.title}
                                                        </p>
                                                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyber-muted">
                                                            {event.time} · {event.stage}
                                                        </p>
                                                    </div>

                                                    <ModuleStatusBadge status={status} />
                                                    <CorrelationStatusBadge status={event.status} />
                                                </div>

                                                <p className="mt-3 text-sm leading-6 text-cyber-muted">
                                                    {event.message}
                                                </p>
                                                <p className="mt-2 text-xs leading-5 text-cyber-text/80">
                                                    {event.intent}
                                                </p>
                                            </div>

                                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-cyber-muted transition group-hover:text-cyber-violet" />
                                        </div>
                                    </a>

                                    {event.stage === "osint" && (
                                        <div className="mt-4 ml-[52px] grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-cyber-blue/30 bg-cyber-blue/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyber-blue/20"
                                            >
                                                Open Live Host Intel
                                            </a>

                                            <a
                                                href={buildAttackSurfaceLink(incident)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-cyber-violet/30 bg-cyber-violet/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyber-violet/20"
                                            >
                                                Open Attack Surface Scanner
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </PanelCard>

                <PanelCard variant="intel">
                    <PanelHeader
                        icon={<Shield className="h-5 w-5 text-cyber-violet" />}
                        title="Attack Intelligence"
                        subtitle="Cross-app correlated attack understanding"
                        compact
                    />

                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <KPI label="Risk" value={`${attackStory.risk}/100`} tone="text-red-400" />
                            <KPI label="Confidence" value={`${attackStory.confidence}%`} tone="text-cyan-400" />
                            <KPI label="Techniques" value={incident.mitre.length} tone="text-violet-400" />
                        </div>

                        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 p-4">
                            <p className="text-sm font-semibold text-white">
                                {attackStory.title}
                            </p>

                            <p className="mt-2 text-sm text-cyber-muted">
                                {attackStory.summary}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {attackStory.keyFindings.map((f) => (
                                <div
                                    key={f}
                                    className="rounded-lg border border-cyber-border bg-black/10 px-3 py-2 text-xs text-slate-300"
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="signal">
                    <PanelHeader
                        icon={<Radar className="h-5 w-5 text-cyber-blue" />}
                        title="Incident Evolution"
                        subtitle="Derived state from the shared incident timeline"
                        compact
                    />

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-cyber-muted">
                            <span>Progression</span>
                            <span>{evolution.completion}%</span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-cyber-panel2">
                            <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(139,92,246,0.9),rgba(59,130,246,0.9),rgba(34,197,94,0.9))] transition-all duration-500"
                                style={{ width: `${evolution.completion}%` }}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
                            {evolution.steps.map((step, index) => (
                                <div
                                    key={`${step.state}-${index}`}
                                    className={`rounded-xl border p-3 ${step.completed
                                        ? "border-cyber-green/30 bg-cyber-green/10"
                                        : "border-cyber-border bg-cyber-panel2"
                                        }`}
                                >
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyber-muted">
                                        Step {index + 1}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-cyber-text">
                                        {step.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </PanelCard>

                <PanelCard variant="defense">
                    <PanelHeader
                        icon={<Shield className="h-5 w-5 text-cyber-blue" />}
                        title="Connected Modules"
                        subtitle="Launch external modules with shared incident query params"
                        compact
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {links.map((link) => {
                            const status = getModuleStatus(link.appId);

                            return (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group rounded-xl border border-cyber-border bg-cyber-panel2 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-cyber-violet/30 hover:bg-cyber-panel"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-cyber-text">
                                                    {link.label}
                                                </p>
                                                <ModuleStatusBadge status={status} />
                                            </div>

                                            <p className="mt-2 text-xs leading-5 text-cyber-muted">
                                                {link.label === "PhishScope" && "Analyze phishing vector and validate attack entry point."}
                                                {link.label === "SOC Simulator" && "Investigate alerts and reconstruct attacker activity."}
                                                {link.label === "OSINT Investigator" && "Enrich attacker infrastructure and pivot on IoCs."}
                                                {link.label === "Threat Intelligence" && "Correlate indicators with known threat campaigns."}
                                            </p>
                                        </div>
                                        {link.id === "phishscope" && (
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-violet/20 text-cyber-violet border border-cyber-violet/30">
                                                ENTRY
                                            </span>
                                        )}
                                        <ArrowUpRight className="h-4 w-4 text-cyber-muted transition group-hover:text-cyber-violet" />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function MiniEntity({ icon, label, value }) {
    return (
        <div className="rounded-xl border border-cyber-border bg-black/10 px-3 py-3">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] uppercase tracking-[0.18em] text-cyber-muted">
                    {label}
                </span>
            </div>
            <p className="mt-2 break-words text-xs font-semibold text-cyber-text">
                {value}
            </p>
        </div>
    );
}

function ModuleStatusBadge({ status }) {
    const styles =
        status === "live"
            ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
            : status === "planned"
                ? "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber"
                : "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";

    const label =
        status === "live"
            ? "Live"
            : status === "planned"
                ? "Planned"
                : "Mock";

    return (
        <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
            {label}
        </span>
    );
}

function CorrelationStatusBadge({ status }) {
    const styles =
        status === "confirmed"
            ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
            : status === "detected"
                ? "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue"
                : status === "suspected"
                    ? "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber"
                    : status === "enriched"
                        ? "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet"
                        : "border-cyber-border bg-cyber-panel2 text-cyber-muted";

    return (
        <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold capitalize ${styles}`}>
            {status}
        </span>
    );
}

function KPI({ label, value, tone }) {
    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-3">
            <p className="text-[10px] uppercase tracking-wide text-cyber-muted">
                {label}
            </p>
            <p className={`mt-1 text-lg font-bold ${tone}`}>
                {value || "N/A"}
            </p>
        </div>
    );
}

function getPrimaryIncidentCTA(incident, links) {
    if (!incident || !links?.length) {
        return {
            label: "Start Incident Flow",
            href: "#",
            helper: "No incident context available",
        };
    }

    const status = normalizeIncidentState(incident.status);

    if (status === INCIDENT_STATES.NEW || status === INCIDENT_STATES.IN_PROGRESS) {
        const phishingLink = links.find((link) => link.id === "phishing");
        return {
            label: "Start with PhishScope",
            href: phishingLink?.href ?? links[0]?.href ?? "#",
            helper: "Begin investigation from the phishing entry point",
        };
    }

    if (status === INCIDENT_STATES.PARTIALLY_DETECTED) {
        const socLink = links.find((link) => link.id === "soc");
        return {
            label: "Continue in SOC",
            href: socLink?.href ?? links[0]?.href ?? "#",
            helper: "Review correlated alerts and detection evidence",
        };
    }

    if (status === INCIDENT_STATES.ENRICHMENT_NEEDED) {
        const osintLink = links.find((link) => link.id === "osint");
        return {
            label: "Enrich in OSINT",
            href: osintLink?.href ?? links[0]?.href ?? "#",
            helper: "Pivot on IP, domain and infrastructure indicators",
        };
    }

    if (status === INCIDENT_STATES.CORRELATION_NEEDED) {
        const intelLink = links.find((link) => link.id === "threat-intel");
        return {
            label: "Correlate Threat Intel",
            href: intelLink?.href ?? links[0]?.href ?? "#",
            helper: "Validate IoCs against threat intelligence context",
        };
    }

    const phishingLink = links.find((link) => link.id === "phishing");

    return {
        label: "Start Incident Flow",
        href: phishingLink?.href ?? links[0]?.href ?? "#",
        helper: "Launch entry module with shared context",
    };
}