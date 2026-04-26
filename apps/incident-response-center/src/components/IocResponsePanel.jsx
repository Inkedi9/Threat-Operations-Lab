import { Globe2, Hash, Network, Send, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function IocResponsePanel({ incident, actions }) {
    const ipBlocked =
        actions.find((a) => a.id === "block-ip")?.status === "completed";
    const fileQuarantined =
        actions.find((a) => a.id === "quarantine-file")?.status === "completed";

    const rows = [
        ...incident.iocs.ips.map((value) => ({
            type: "IP",
            value,
            risk: "High",
            status: ipBlocked ? "blocked" : "pending",
            action: ipBlocked ? "Blocked at firewall" : "Firewall block pending",
            source: "SOC Simulator",
            icon: Network,
        })),
        ...incident.iocs.domains.map((value) => ({
            type: "Domain",
            value,
            risk: "High",
            status: "watchlist",
            action: "DNS sinkhole recommended",
            source: "Threat Intel Platform",
            icon: Globe2,
        })),
        ...incident.iocs.hashes.map((value) => ({
            type: "Hash",
            value,
            risk: "Critical",
            status: fileQuarantined ? "completed" : "pending",
            action: fileQuarantined ? "File quarantined" : "Quarantine pending",
            source: "OSINT Investigator",
            icon: Hash,
        })),
    ];

    const completed = rows.filter((row) =>
        ["blocked", "completed", "watchlist"].includes(row.status)
    ).length;

    return (
        <section className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        IoC Response Panel
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-command-text">
                        Indicator Handling
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-command-muted">
                        Track malicious IPs, domains and hashes discovered during the
                        investigation and simulate their containment across connected
                        modules.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/5 bg-black/30 p-3">
                    <Mini label="IoCs" value={rows.length} />
                    <Mini label="Handled" value={completed} />
                    <Mini label="Source" value="3" />
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {rows.map((row) => (
                    <IocCard key={`${row.type}-${row.value}`} row={row} />
                ))}
            </div>
        </section>
    );
}

function IocCard({ row }) {
    const Icon = row.icon;

    const riskTone =
        row.risk === "Critical" ? "text-red-300" : "text-orange-300";

    return (
        <div className="premium-hover rounded-3xl border border-white/5 bg-black/35 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                        <Icon size={19} />
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-command-muted">
                            {row.type}
                        </p>
                        <p className="mt-1 break-all font-mono text-sm font-black text-command-text">
                            {row.value}
                        </p>
                    </div>
                </div>

                <StatusBadge status={row.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <Info label="Risk" value={row.risk} tone={riskTone} />
                <Info label="Source" value={row.source} tone="text-amber-300" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-black/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-300" />
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-command-muted">
                        Action Taken
                    </p>
                </div>

                <p className="text-sm font-bold text-command-text">{row.action}</p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-500/10 bg-amber-500/5 px-3 py-2 text-xs">
                <span className="text-command-muted">Forwarding</span>
                <span className="flex items-center gap-2 font-bold text-amber-300">
                    <Send size={13} />
                    Ready for TIP
                </span>
            </div>
        </div>
    );
}

function Info({ label, value, tone }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/35 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                {label}
            </p>
            <p className={`mt-1 text-xs font-black ${tone}`}>{value}</p>
        </div>
    );
}

function Mini({ label, value }) {
    return (
        <div className="min-w-20 rounded-2xl border border-white/5 bg-black/35 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                {label}
            </p>
            <p className="mt-1 text-xl font-black text-command-text">{value}</p>
        </div>
    );
}