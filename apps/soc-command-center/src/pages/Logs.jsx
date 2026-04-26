import { useMemo, useState } from "react";
import { Search, TerminalSquare, Database, Radio } from "lucide-react";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

export default function Logs({ alerts = [] }) {
    const [filter, setFilter] = useState("");

    const logs = useMemo(() => {
        return alerts.flatMap((alert) =>
            alert.logs.map((log, index) => ({
                id: `${alert.id}-${index}`,
                time: alert.time,
                ip: alert.ip,
                severity: alert.severity,
                alertName: alert.name,
                message: log,
            }))
        );
    }, [alerts]);

    const filteredLogs = logs.filter((log) => {
        const q = filter.toLowerCase();
        return (
            log.message.toLowerCase().includes(q) ||
            log.ip.toLowerCase().includes(q) ||
            log.alertName.toLowerCase().includes(q)
        );
    });

    function getLogColor(message) {
        const msg = message.toLowerCase();

        if (msg.includes("success")) return "text-red-300";
        if (msg.includes("failed")) return "text-orange-300";
        if (msg.includes("scan") || msg.includes("nmap")) return "text-yellow-300";
        if (msg.includes("flag")) return "text-emerald-300";

        return "text-slate-300";
    }

    return (
        <div className="space-y-6">
            <HeaderCard
                eyebrow="SIEM Event Stream"
                title="Raw Logs"
                description="Centralized event stream for raw log analysis, telemetry search and SIEM-style monitoring."
            >
                <Badge tone="blue">{logs.length} Events</Badge>
                <Badge tone="cyan">{filteredLogs.length} Visible</Badge>
                <Badge tone={filter ? "orange" : "slate"}>
                    {filter ? "Filtered" : "Unfiltered"}
                </Badge>
            </HeaderCard>

            <CyberPanel>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
                            <Search className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                                Log Search
                            </p>
                            <p className="text-sm text-slate-400">
                                Search by IP, alert name or raw event content.
                            </p>
                        </div>
                    </div>

                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search by IP, alert, or log content..."
                        className="w-full rounded-2xl border border-blue-400/15 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500/40 xl:max-w-md"
                    />
                </div>
            </CyberPanel>

            <section className="grid gap-4 md:grid-cols-3">
                <LogMetric icon={Database} label="Total Events" value={logs.length} tone="blue" />
                <LogMetric icon={Radio} label="Visible Events" value={filteredLogs.length} tone="cyan" />
                <LogMetric
                    icon={TerminalSquare}
                    label="Critical Logs"
                    value={logs.filter((l) => l.severity === "critical").length}
                    tone="red"
                />
            </section>

            <CyberPanel className="overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/70 text-sm uppercase tracking-[0.16em] text-slate-400">
                        <tr>
                            <th className="p-3">Time</th>
                            <th className="p-3">IP</th>
                            <th className="p-3">Severity</th>
                            <th className="p-3">Alert</th>
                            <th className="p-3">Log</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLogs.map((log) => (
                            <tr
                                key={log.id}
                                className="border-t border-blue-400/10 transition-all duration-200 hover:bg-blue-500/5"
                            >
                                <td className="p-3 font-mono text-xs text-slate-500">{log.time}</td>
                                <td className="p-3 font-mono text-sm text-blue-300">{log.ip}</td>
                                <td className="p-3">
                                    <SeverityBadge severity={log.severity} />
                                </td>
                                <td className="p-3 text-sm text-slate-300">{log.alertName}</td>
                                <td className={`p-3 font-mono text-sm ${getLogColor(log.message)}`}>
                                    <span className="text-blue-500">&gt;</span> {log.message}
                                </td>
                            </tr>
                        ))}

                        {!filteredLogs.length && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-sm text-slate-400">
                                    No logs match the current search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CyberPanel>
        </div>
    );
}

function LogMetric({ icon: Icon, label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
        red: "border-red-500/20 bg-red-500/10 text-red-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] opacity-80">
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
    );
}