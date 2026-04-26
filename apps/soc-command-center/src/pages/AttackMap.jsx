import { Crosshair, Globe2, Radio, Server } from "lucide-react";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

export default function AttackMap({ alerts = [] }) {
    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    const locations = safeAlerts.slice(0, 20).map((a, index) => ({
        ...a,
        x: ((index * 37) % 86) + 6,
        y: ((index * 53) % 76) + 10,
    }));

    const critical = safeAlerts.filter((a) => a.severity === "critical").length;
    const high = safeAlerts.filter((a) => a.severity === "high").length;

    return (
        <div className="space-y-6">
            <HeaderCard
                eyebrow="Global Threat View"
                title="Attack Map"
                description="Simulated visualization of hostile attack sources targeting the SOC environment."
            >
                <Badge tone="blue">{safeAlerts.length} Active Attacks</Badge>
                <Badge tone={critical > 0 ? "red" : "green"}>
                    {critical} Critical
                </Badge>
                <Badge tone={high > 0 ? "orange" : "slate"}>{high} High</Badge>
            </HeaderCard>

            <CyberPanel className="relative h-[560px] overflow-hidden p-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.18),transparent_34%),linear-gradient(135deg,#020617,#0f172a,#020617)]" />

                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(59,130,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

                <div className="absolute left-6 top-6 z-10 flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-slate-950/60 px-4 py-3 backdrop-blur">
                    <Globe2 className="h-5 w-5 text-blue-300" />
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Threat Surface
                        </p>
                        <p className="text-sm font-semibold text-white">
                            Global inbound telemetry
                        </p>
                    </div>
                </div>

                {locations.map((a, i) => (
                    <div
                        key={`${a.id}-${i}`}
                        className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
                        style={{ left: `${a.x}%`, top: `${a.y}%` }}
                    >
                        <span
                            className={`relative flex h-4 w-4 ${a.severity === "critical"
                                    ? "text-red-400"
                                    : a.severity === "high"
                                        ? "text-orange-400"
                                        : "text-yellow-300"
                                }`}
                        >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-current shadow-[0_0_18px_currentColor]" />
                        </span>

                        <div className="rounded-xl border border-blue-400/10 bg-black/45 px-2 py-1 text-xs text-slate-300 opacity-80 backdrop-blur transition group-hover:opacity-100">
                            {a.ip}
                        </div>
                    </div>
                ))}

                <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/15 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
                        <Server className="relative z-10 h-8 w-8 text-blue-200" />
                    </div>

                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                        SOC Server
                    </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 md:grid-cols-3">
                    <MapMetric icon={Radio} label="Telemetry" value="Streaming" tone="blue" />
                    <MapMetric icon={Crosshair} label="Attack Sources" value={locations.length} tone="red" />
                    <MapMetric icon={Server} label="Target" value="SOC Core" tone="cyan" />
                </div>
            </CyberPanel>

            <CyberPanel>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                            Source Intelligence
                        </p>
                        <h3 className="mt-2 text-xl font-black text-white">
                            Active Attack Sources
                        </h3>
                    </div>

                    <Badge tone="blue">{locations.length} displayed</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {locations.length ? (
                        locations.slice(0, 9).map((alert, index) => (
                            <div
                                key={`${alert.id}-source-${index}`}
                                className="rounded-2xl border border-blue-400/10 bg-slate-950/55 p-4"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="font-mono text-sm font-semibold text-blue-300">
                                        {alert.ip}
                                    </p>
                                    <SeverityBadge severity={alert.severity} />
                                </div>

                                <p className="text-sm font-semibold text-white">{alert.name}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                    {alert.time} · {alert.tag || "Unknown vector"}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-5 text-sm text-slate-400">
                            No hostile sources detected yet.
                        </div>
                    )}
                </div>
            </CyberPanel>
        </div>
    );
}

function MapMetric({ icon: Icon, label, value, tone = "blue" }) {
    const tones = {
        blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        red: "border-red-500/20 bg-red-500/10 text-red-300",
        cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    };

    return (
        <div className={`rounded-2xl border px-4 py-3 backdrop-blur ${tones[tone]}`}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] opacity-80">
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <p className="mt-2 text-lg font-black text-white">{value}</p>
        </div>
    );
}