import { useMemo, useState } from "react";
import { Search, GitBranch, Radar, ShieldAlert } from "lucide-react";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

export default function Investigations({ alerts = [] }) {
    const [selectedIP, setSelectedIP] = useState("");

    const uniqueIPs = useMemo(() => {
        return [...new Set(alerts.map((a) => a.ip))];
    }, [alerts]);

    const relatedAlerts = useMemo(() => {
        return alerts.filter((a) => a.ip === selectedIP);
    }, [alerts, selectedIP]);

    const timeline = useMemo(() => {
        return relatedAlerts.map((alert) => ({
            time: alert.time,
            name: alert.name,
            severity: alert.severity,
            status: alert.status,
        }));
    }, [relatedAlerts]);

    const criticalCount = relatedAlerts.filter((a) => a.severity === "critical").length;
    const highCount = relatedAlerts.filter((a) => a.severity === "high").length;

    function buildSummary() {
        if (!selectedIP || relatedAlerts.length === 0) {
            return "Select an IP to begin the investigation.";
        }

        const hasCritical = relatedAlerts.some((a) => a.severity === "critical");
        const hasBruteforce = relatedAlerts.some((a) =>
            a.name.toLowerCase().includes("brute")
        );
        const hasRecon = relatedAlerts.some((a) =>
            a.name.toLowerCase().includes("scan")
        );

        if (hasCritical && hasBruteforce) {
            return "This host appears linked to a multi-stage intrusion involving brute force activity followed by high-impact actions.";
        }

        if (hasRecon) {
            return "This source shows reconnaissance behavior that may precede exploitation attempts.";
        }

        return "This source generated multiple related alerts and requires analyst review.";
    }

    return (
        <div className="space-y-6">
            <HeaderCard
                eyebrow="Investigation Workspace"
                title="Incident Investigations"
                description="Correlate events by source IP, reconstruct attack flow and support analyst-driven response decisions."
            >
                <Badge tone="blue">{uniqueIPs.length} Sources</Badge>
                <Badge tone={selectedIP ? "cyan" : "slate"}>
                    {selectedIP || "No IP Selected"}
                </Badge>
                <Badge tone={criticalCount > 0 ? "red" : "green"}>
                    {criticalCount} Critical
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
                                Source Selector
                            </p>
                            <p className="text-sm text-slate-400">
                                Select a suspicious IP to open correlated evidence.
                            </p>
                        </div>
                    </div>

                    <select
                        value={selectedIP}
                        onChange={(e) => setSelectedIP(e.target.value)}
                        className="w-full rounded-2xl border border-blue-400/15 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/40 xl:max-w-md"
                    >
                        <option value="">Choose an IP...</option>
                        {uniqueIPs.map((ip) => (
                            <option key={ip} value={ip}>
                                {ip}
                            </option>
                        ))}
                    </select>
                </div>
            </CyberPanel>

            <section className="grid gap-4 md:grid-cols-3">
                <InvestigationMetric
                    icon={Radar}
                    label="Related Alerts"
                    value={relatedAlerts.length}
                    tone="blue"
                />
                <InvestigationMetric
                    icon={ShieldAlert}
                    label="Critical"
                    value={criticalCount}
                    tone="red"
                />
                <InvestigationMetric
                    icon={GitBranch}
                    label="High Severity"
                    value={highCount}
                    tone="orange"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <CyberPanel variant={criticalCount > 0 ? "threat" : "defense"}>
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            🧠 Incident Summary
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Correlation Assessment
                        </h3>
                    </div>

                    <p className="text-sm leading-6 text-slate-300">{buildSummary()}</p>

                    {selectedIP && (
                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl border border-blue-400/10 bg-slate-950/45 p-3">
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                                    Selected IP
                                </p>
                                <p className="mt-2 font-mono font-bold text-blue-300">
                                    {selectedIP}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-blue-400/10 bg-slate-950/45 p-3">
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                                    Related Alerts
                                </p>
                                <p className="mt-2 text-2xl font-black text-white">
                                    {relatedAlerts.length}
                                </p>
                            </div>
                        </div>
                    )}
                </CyberPanel>

                <CyberPanel>
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            📜 Attack Timeline
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Source Event Flow
                        </h3>
                    </div>

                    {!selectedIP ? (
                        <div className="rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-5 text-sm text-slate-400">
                            No IP selected yet.
                        </div>
                    ) : timeline.length ? (
                        <div className="relative pl-4">
                            <div className="absolute left-1 top-0 h-full w-[2px] bg-blue-500/20" />

                            <div className="space-y-4">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative flex gap-3">
                                        <span
                                            className={`mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_12px] ${item.severity === "critical"
                                                    ? "bg-red-400 shadow-red-400/60"
                                                    : item.severity === "high"
                                                        ? "bg-orange-400 shadow-orange-400/60"
                                                        : "bg-blue-400 shadow-blue-400/60"
                                                }`}
                                        />

                                        <div className="flex-1 rounded-2xl border border-blue-400/10 bg-slate-950/55 p-3">
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="mt-1 font-mono text-xs text-slate-500">
                                                        {item.time}
                                                    </p>
                                                </div>

                                                <SeverityBadge severity={item.severity} />
                                            </div>

                                            <p className="text-xs text-slate-400">
                                                Status: <span className="text-slate-200">{item.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-5 text-sm text-slate-400">
                            No related alerts for this source.
                        </div>
                    )}
                </CyberPanel>
            </section>

            {selectedIP && (
                <CyberPanel className="overflow-hidden p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/70 text-sm uppercase tracking-[0.16em] text-slate-400">
                            <tr>
                                <th className="p-3">Time</th>
                                <th className="p-3">Alert</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {relatedAlerts.map((alert) => (
                                <tr
                                    key={alert.id}
                                    className="border-t border-blue-400/10 transition-all duration-200 hover:bg-blue-500/5"
                                >
                                    <td className="p-3 font-mono text-xs text-slate-500">
                                        {alert.time}
                                    </td>
                                    <td className="p-3 text-sm font-semibold text-slate-200">
                                        {alert.name}
                                    </td>
                                    <td className="p-3">
                                        <SeverityBadge severity={alert.severity} />
                                    </td>
                                    <td className="p-3 text-sm text-slate-300">{alert.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CyberPanel>
            )}
        </div>
    );
}

function InvestigationMetric({ icon: Icon, label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        red: "border-red-500/20 bg-red-500/10 text-red-300",
        orange: "border-orange-500/20 bg-orange-500/10 text-orange-300",
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