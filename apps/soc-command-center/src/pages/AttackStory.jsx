import { AlertTriangle, CheckCircle2, Network, ShieldAlert } from "lucide-react";

import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

const phases = [
    { id: "initial", label: "Initial Access", match: ["phishing", "initial access", "t1566"] },
    { id: "credential", label: "Credential Access", match: ["credential", "valid accounts", "bruteforce", "t1078", "t1110"] },
    { id: "execution", label: "Execution", match: ["powershell", "execution", "encoded"] },
    { id: "privilege", label: "Privilege Escalation", match: ["privilege", "sudo", "admin"] },
    { id: "exfil", label: "Exfiltration", match: ["exfiltration", "data transfer"] },
];



export default function AttackStory({ alerts = [] }) {
    const story = buildAttackStory(alerts);

    return (
        <div className="space-y-6">
            <HeaderCard
                eyebrow="Correlated Attack Story"
                title={story.title}
                description={story.summary}
            >
                <Badge tone={story.alertCount > 0 ? "red" : "slate"}>
                    {story.alertCount} Correlated Alerts
                </Badge>
                <Badge tone="orange">Risk {story.risk}/100</Badge>
                <Badge tone="cyan">Confidence {story.confidence}%</Badge>
            </HeaderCard>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <KPI label="Correlated Alerts" value={story.alertCount} tone="blue" />
                <KPI label="Source IP" value={story.sourceIp} tone="red" />
                <KPI label="User" value={story.user} tone="violet" />
                <KPI label="Risk" value={`${story.risk}/100`} tone="orange" />
                <KPI label="Confidence" value={`${story.confidence}%`} tone="cyan" />
            </section>

            <CyberPanel>
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
                        <Network className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white">MITRE Attack Path</h3>
                        <p className="text-sm text-slate-400">
                            Mapped from correlated SOC alerts and PhishScope context.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-5">
                    {phases.map((phase, index) => {
                        const phaseAlerts = story.phaseMap[phase.id] || [];
                        const active = phaseAlerts.length > 0;

                        return (
                            <div
                                key={phase.id}
                                className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${active
                                    ? "border-red-500/35 bg-red-500/10 shadow-[0_0_24px_rgba(239,68,68,0.12)]"
                                    : "border-blue-400/10 bg-slate-950/50"
                                    }`}
                            >
                                {active && (
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.18),transparent_45%)]" />
                                )}

                                <div className="relative z-10">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="font-mono text-xs text-slate-500">
                                            0{index + 1}
                                        </span>

                                        {active ? (
                                            <AlertTriangle className="h-4 w-4 text-red-300" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 text-slate-500" />
                                        )}
                                    </div>

                                    <p className="font-semibold text-white">{phase.label}</p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        {active ? `${phaseAlerts.length} signal(s)` : "No signal"}
                                    </p>

                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className={`h-full rounded-full transition-all ${active
                                                ? "bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.55)]"
                                                : "bg-slate-600"
                                                }`}
                                            style={{ width: active ? "100%" : "12%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CyberPanel>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <CyberPanel>
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            📜 Attack Timeline
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Correlated Event Flow
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            Chronological view of related alerts and attacker progression.
                        </p>
                    </div>

                    {story.timeline.length ? (
                        <div className="relative pl-4">
                            <div className="absolute left-1 top-0 h-full w-[2px] bg-blue-500/20" />

                            <div className="space-y-4">
                                {story.timeline.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="relative flex gap-3">
                                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.65)]" />

                                        <div className="flex-1 rounded-2xl border border-blue-400/10 bg-slate-950/55 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {item.time} · {item.tag}
                                                    </p>
                                                </div>

                                                <SeverityBadge severity={item.severity} />
                                            </div>

                                            <div className="mt-3 rounded-xl border border-emerald-500/10 bg-black/35 p-3 font-mono text-xs">
                                                {(item.logs || []).slice(0, 3).map((log, i) => (
                                                    <p key={i} className="text-emerald-300">
                                                        <span className="text-blue-500">&gt;</span> {log}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-5 text-sm text-slate-400">
                            No correlated alerts yet.
                        </div>
                    )}
                </CyberPanel>

                <div className="space-y-6">
                    <CyberPanel variant="defense">
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            🧠 Analyst Narrative
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Attack Hypothesis
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {story.narrative}
                        </p>
                    </CyberPanel>

                    <CyberPanel>
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            🛡️ Recommended Actions
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Response Plan
                        </h3>

                        <div className="mt-4 space-y-2">
                            {story.actions.map((action, index) => (
                                <div
                                    key={action}
                                    className="flex gap-3 rounded-2xl border border-blue-400/10 bg-slate-950/55 px-3 py-3 text-sm text-slate-300"
                                >
                                    <span className="font-mono text-xs text-blue-300">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span>{action}</span>
                                </div>
                            ))}
                        </div>
                    </CyberPanel>
                </div>
            </section>
        </div>
    );
}

function KPI({ label, value, tone = "blue" }) {
    const tones = {
        blue: "text-blue-300 border-blue-500/20 bg-blue-500/10",
        red: "text-red-300 border-red-500/20 bg-red-500/10",
        violet: "text-violet-300 border-violet-500/20 bg-violet-500/10",
        orange: "text-orange-300 border-orange-500/20 bg-orange-500/10",
        cyan: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <p className="text-xs uppercase tracking-[0.16em] opacity-80">{label}</p>
            <p className="mt-2 truncate text-xl font-black text-white">
                {value || "N/A"}
            </p>
        </div>
    );
}

function buildAttackStory(alerts) {
    const correlated = alerts.filter((alert) => {
        const text = stringifyAlert(alert);
        return (
            text.includes("phishscope") ||
            text.includes("secure-login-support") ||
            text.includes("185.77.44.21") ||
            text.includes("j.smith") ||
            text.includes("t1566") ||
            text.includes("t1078") ||
            text.includes("valid accounts") ||
            text.includes("initial access")
        );
    });

    const confidence = Math.min(100, correlated.length * 25);

    const sourceIp =
        correlated.find((a) => a.ip === "185.77.44.21")?.ip ||
        correlated.find((a) => a.ip)?.ip ||
        "185.77.44.21";
    const user = correlated.find((a) => a.user)?.user || "j.smith";
    const risk =
        correlated.some(a => a.severity === "critical") ? 95 :
            correlated.some(a => a.severity === "high") ? 80 :
                50;

    const phaseMap = phases.reduce((acc, phase) => {
        acc[phase.id] = correlated.filter((alert) => {
            const text = stringifyAlert(alert);
            return phase.match.some((keyword) => text.includes(keyword));
        });
        return acc;
    }, {});

    return {
        title: correlated.length ? "Phishing-led Identity Compromise" : "No correlated attack story yet",
        summary: correlated.length
            ? "SOC telemetry indicates a phishing-led compromise path involving credential harvesting, suspicious authentication, and identity abuse signals."
            : "Open SOC from PhishScope or load a linked incident to generate a correlated attack story.",
        alertCount: correlated.length,
        confidence,
        sourceIp,
        user,
        risk,
        phaseMap,
        timeline: correlated,
        narrative: correlated.length
            ? `The attacker appears to have used phishing infrastructure to target ${user}. Subsequent SOC alerts indicate suspicious activity from ${sourceIp}, suggesting credential use or valid-account abuse after initial access.`
            : "No linked incident telemetry is currently available.",
        actions: [
            "Reset the affected user's credentials.",
            "Invalidate active sessions and review MFA status.",
            "Block or monitor the suspicious source IP.",
            "Correlate phishing domain with OSINT and threat intelligence.",
            "Open an incident report and document containment actions.",
        ],
    };
}

function stringifyAlert(alert) {
    return [
        alert?.id,
        alert?.name,
        alert?.severity,
        alert?.ip,
        alert?.user,
        alert?.tag,
        alert?.technique,
        alert?.source,
        alert?.description,
        ...(alert?.logs || []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function severityScore(severity) {
    if (severity === "critical") return 35;
    if (severity === "high") return 25;
    if (severity === "medium") return 15;
    return 8;
}

