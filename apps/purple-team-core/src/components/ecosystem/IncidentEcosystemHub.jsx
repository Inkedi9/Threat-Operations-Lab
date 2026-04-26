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

/* ========================================
   🌐 Incident Ecosystem Hub
======================================== */

export default function IncidentEcosystemHub({ incident }) {
    const links = buildIncidentDeepLinks(incident);


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
                        {incident.timeline.map((event, index) => {
                            const status = getModuleStatus(event.app);
                            const href = buildTimelineEventLink(incident, event);

                            return (
                                <div
                                    key={`${event.time}-${event.stage}`}
                                    className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4 transition-all duration-200 hover:border-cyber-violet/30 hover:bg-cyber-panel"
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
                                                </div>

                                                <p className="mt-3 text-sm leading-6 text-cyber-muted">
                                                    {event.message}
                                                </p>
                                            </div>

                                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-cyber-muted transition group-hover:text-cyber-violet" />
                                        </div>
                                    </a>

                                    {event.stage === "osint" && (
                                        <div className="mt-4 ml-13 grid grid-cols-1 gap-2 sm:grid-cols-2">
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

                <PanelCard variant="defense">
                    <PanelHeader
                        icon={<Shield className="h-5 w-5 text-cyber-blue" />}
                        title="Connected Modules"
                        subtitle="Launch external modules with shared incident query params"
                        compact
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {links.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group rounded-xl border border-cyber-border bg-cyber-panel2 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-cyber-violet/30 hover:bg-cyber-panel"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-cyber-text">
                                            {link.label}
                                        </p>
                                        <p className="mt-2 text-xs leading-5 text-cyber-muted">
                                            Opens module with incident context and IoCs.
                                        </p>
                                    </div>

                                    <ArrowUpRight className="h-4 w-4 text-cyber-muted transition group-hover:text-cyber-violet" />
                                </div>
                            </a>
                        ))}
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