import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
} from "recharts";
import {
    ShieldAlert,
    Siren,
    FolderOpen,
    Activity,
    Radar,
    Server,
    CheckCircle2,
    Eye,
} from "lucide-react";
import {
    AreaChart,
    Area,
    Cell,
} from "recharts";
import { cn } from "@/lib/utils";

import { CyberPanel } from "@/components/ui/CyberPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MiniStat } from "@/components/ui/MiniStat";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { SidebarCard } from "@/components/ui/SidebarCard";
import { SidebarItem } from "@/components/ui/SidebarItem";






export default function Dashboard({ alerts = [] }) {
    const total = alerts.length;

    const critical = alerts.filter((a) => a.severity === "critical").length;
    const high = alerts.filter((a) => a.severity === "high").length;
    const medium = alerts.filter((a) => a.severity === "medium").length;
    const low = alerts.filter((a) => a.severity === "low").length;

    const openIncidents = alerts.filter((a) => a.status === "open").length;

    const avgRisk = alerts.length
        ? Math.round(
            alerts.reduce((sum, alert) => {
                const scoreMap = {
                    low: 25,
                    medium: 50,
                    high: 75,
                    critical: 100,
                };
                return sum + (scoreMap[alert.severity] || 0);
            }, 0) / alerts.length
        )
        : 0;

    const alertsByTime = alerts
        .slice(0, 10)
        .reverse()
        .map((a, i) => ({
            time: a.time,
            count: i + 1,
        }));

    const severityData = [
        { name: "Low", value: low },
        { name: "Medium", value: medium },
        { name: "High", value: high },
        { name: "Critical", value: critical },
    ];

    const ipCounts = alerts.reduce((acc, alert) => {
        acc[alert.ip] = (acc[alert.ip] || 0) + 1;
        return acc;
    }, {});

    const topAttackers = Object.entries(ipCounts)
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const statusCounts = {
        open: alerts.filter((a) => a.status === "open").length,
        investigating: alerts.filter((a) => a.status === "investigating").length,
        closed: alerts.filter((a) => a.status === "closed").length,
    };

    const reviewedIncidents = alerts.filter(
        (a) => a.status === "investigating" || a.status === "closed"
    ).length;

    const closedIncidents = statusCounts.closed;

    const closureRate =
        alerts.length > 0 ? Math.round((closedIncidents / alerts.length) * 100) : 0;

    const criticalReadiness = critical > 0 ? Math.max(0, 100 - critical * 5) : 100;

    const activityLog = (() => {
        const saved = localStorage.getItem("soc_activity_log");
        return saved ? JSON.parse(saved) : [];
    })();

    const recentActivity = activityLog.slice(0, 6);

    function getThreatInsight() {
        if (critical > 5) {
            return "Elevated critical activity detected. Immediate analyst review recommended.";
        }
        if (high > 5) {
            return "Sustained high-severity activity observed. Review attack sources and triage active incidents.";
        }
        if (alerts.length > 0) {
            return "SOC telemetry is active. Continue monitoring for correlated attack patterns.";
        }
        return "No active telemetry available yet. Awaiting events.";
    }

    function getAnalystInsight() {
        if (closureRate >= 70) {
            return "Analyst workflow is efficient. Incident closure rate is healthy and response performance appears stable.";
        }

        if (statusCounts.open > statusCounts.closed) {
            return "Open incidents currently exceed closed cases. Additional triage effort may be required.";
        }

        if (critical > 3) {
            return "Critical alert volume is elevated. Analyst attention should prioritize high-impact incidents.";
        }

        return "Analyst operations are active. Continue monitoring investigation throughput and closure performance.";
    }

    function getActivityTypeClass(type) {
        switch (type) {
            case "success":
                return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
            case "warning":
                return "text-orange-300 border-orange-500/20 bg-orange-500/10";
            case "error":
                return "text-red-300 border-red-500/20 bg-red-500/10";
            default:
                return "text-blue-300 border-blue-500/20 bg-blue-500/10";
        }
    }

    return (
        <div className="space-y-6">
            <HeaderCard
                eyebrow="SOC Command Center"
                title="Security Operations Overview"
                description="Real-time view of alert volume, incident pressure, analyst activity, and operational readiness."
            >
                <Badge tone="blue">Telemetry Active</Badge>
                <Badge tone={critical > 0 ? "red" : "green"}>{critical} Critical</Badge>
                <Badge tone="orange">{openIncidents} Open</Badge>
            </HeaderCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Total Alerts" value={total} icon={ShieldAlert} tone="blue" />
                <MetricCard title="Critical Alerts" value={critical} icon={Siren} tone="red" />
                <MetricCard title="Open Incidents" value={openIncidents} icon={FolderOpen} tone="orange" />
                <MetricCard title="Average Risk" value={`${avgRisk}/100`} icon={Activity} tone="cyan" />
            </div>

            <CyberPanel>
                <div className="mb-4 flex items-center justify-between">
                    <SectionTitle
                        icon={Eye}
                        title="Recent Analyst Activity"
                        subtitle="Latest triage and response actions"
                    />
                    <Badge tone="blue">{activityLog.length} total</Badge>
                </div>

                {recentActivity.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-blue-400/20 bg-slate-950/40 p-5 text-sm text-slate-400">
                        No analyst activity recorded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {recentActivity.map((entry) => (
                            <div
                                key={entry.id}
                                className={cn(
                                    "rounded-xl border p-3 text-sm",
                                    getActivityTypeClass(entry.type)
                                )}
                            >
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <p className="font-semibold">{entry.action}</p>
                                    <span className="text-xs opacity-80">{entry.time}</span>
                                </div>
                                <p className="text-xs opacity-80">{entry.incidentName}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CyberPanel>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <CyberPanel>
                    <SectionTitle
                        icon={Activity}
                        title="Alert Activity Trend"
                        subtitle="Recent alert progression over time"
                    />
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={alertsByTime}>
                            <defs>
                                <linearGradient id="alertTrendGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.42} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />

                            <Tooltip
                                contentStyle={{
                                    background: "#020617",
                                    border: "1px solid rgba(56,189,248,0.28)",
                                    borderRadius: "14px",
                                    color: "#e2e8f0",
                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                }}
                                labelStyle={{ color: "#93c5fd" }}
                            />

                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#38bdf8"
                                strokeWidth={3}
                                fill="url(#alertTrendGlow)"
                                dot={{
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: "#38bdf8",
                                    fill: "#020617",
                                }}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 2,
                                    stroke: "#bae6fd",
                                    fill: "#38bdf8",
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CyberPanel>

                <CyberPanel>
                    <SectionTitle
                        icon={Radar}
                        title="Severity Distribution"
                        subtitle="Alert volume by severity level"
                    />
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={severityData}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />

                            <Tooltip
                                contentStyle={{
                                    background: "#020617",
                                    border: "1px solid rgba(59,130,246,0.25)",
                                    borderRadius: "14px",
                                    color: "#e2e8f0",
                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                }}
                                labelStyle={{ color: "#93c5fd" }}
                            />

                            <Bar dataKey="value" radius={[10, 10, 4, 4]}>
                                {severityData.map((entry) => {
                                    const colors = {
                                        Low: "#64748b",
                                        Medium: "#eab308",
                                        High: "#f97316",
                                        Critical: "#ef4444",
                                    };

                                    return (
                                        <Cell
                                            key={entry.name}
                                            fill={colors[entry.name]}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CyberPanel>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <CyberPanel variant={topAttackers.length > 0 ? "threat" : "default"}>
                    <SectionTitle
                        icon={Siren}
                        title="Top Attacker IPs"
                        subtitle="Most active suspicious sources"
                    />

                    <div className="space-y-3">
                        {topAttackers.length > 0 ? (
                            topAttackers.map((attacker, index) => (
                                <div
                                    key={attacker.ip}
                                    className="flex items-center justify-between rounded-xl border border-red-400/15 bg-black/20 px-3 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            #{index + 1} {attacker.ip}
                                        </p>
                                        <p className="text-xs text-slate-400">Suspicious source</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-black text-red-300">
                                            {attacker.count}
                                        </p>
                                        <p className="text-xs text-slate-400">events</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400">No attack sources yet.</p>
                        )}
                    </div>
                </CyberPanel>

                <CyberPanel>
                    <SectionTitle
                        icon={Server}
                        title="Incident Status"
                        subtitle="Current investigation pipeline"
                    />

                    <div className="grid grid-cols-1 gap-3">
                        <MiniStat label="Open" value={statusCounts.open} tone="orange" />
                        <MiniStat label="Investigating" value={statusCounts.investigating} tone="yellow" />
                        <MiniStat label="Closed" value={statusCounts.closed} tone="green" />
                    </div>
                </CyberPanel>

                <CyberPanel variant={critical > 0 || high > 0 ? "warning" : "defense"}>
                    <SectionTitle
                        icon={Radar}
                        title="Threat Insight"
                        subtitle="Automated operational assessment"
                    />

                    <p className="rounded-xl border border-blue-400/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-200">
                        {getThreatInsight()}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        <Badge tone="red">Critical: {critical}</Badge>
                        <Badge tone="orange">High: {high}</Badge>
                        <Badge tone="yellow">Medium: {medium}</Badge>
                        <Badge tone="slate">Low: {low}</Badge>
                    </div>
                </CyberPanel>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <CyberPanel variant="defense">
                    <SectionTitle
                        icon={CheckCircle2}
                        title="Analyst KPI"
                        subtitle="Response throughput and readiness"
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <MiniStat label="Incidents Reviewed" value={reviewedIncidents} tone="blue" />
                        <MiniStat label="Incidents Closed" value={closedIncidents} tone="green" />
                        <MiniStat label="Closure Rate" value={`${closureRate}%`} tone="blue" />
                        <MiniStat label="Critical Readiness" value={`${criticalReadiness}%`} tone="orange" />
                    </div>
                </CyberPanel>

                <CyberPanel>
                    <SectionTitle
                        icon={Activity}
                        title="Analyst Productivity Insight"
                        subtitle="Workflow interpretation"
                    />

                    <p className="rounded-xl border border-blue-400/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-200">
                        {getAnalystInsight()}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        <Badge tone="blue">Reviewed: {reviewedIncidents}</Badge>
                        <Badge tone="green">Closed: {closedIncidents}</Badge>
                        <Badge tone="orange">Open: {statusCounts.open}</Badge>
                        <Badge tone="yellow">Investigating: {statusCounts.investigating}</Badge>
                    </div>
                </CyberPanel>
            </div>
        </div>
    );
}