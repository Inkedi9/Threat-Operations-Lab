import { useEffect, useMemo, useState } from "react";
import { Activity, ShieldCheck, Clock3, Radio } from "lucide-react";
import socLogo from "../assets/soc-logo.svg";

const pageMeta = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Real-time SOC overview and security monitoring metrics.",
    },
    alerts: {
        title: "Alerts",
        subtitle: "Live security alerts, triage workflow, and incident response actions.",
    },
    attackstory: {
        title: "Attack Story",
        subtitle: "Correlated attack narrative, MITRE path, and response recommendations.",
    },
    attackmap: {
        title: "Attack Map",
        subtitle: "Visual overview of hostile activity targeting the environment.",
    },
    logs: {
        title: "Logs",
        subtitle: "SIEM-style raw event stream for monitoring and investigation.",
    },
    investigations: {
        title: "Investigations",
        subtitle: "Correlate events and reconstruct attack flow by source activity.",
    },
    ctf: {
        title: "CTF Lab",
        subtitle: "Hands-on security investigations based on simulated incidents.",
    },
};

export default function Header({
    page = "dashboard",
    demoMode = false,
    alerts = [],
}) {
    const [now, setNow] = useState(new Date());
    const [heartbeat, setHeartbeat] = useState(true);
    const [ingestionRate, setIngestionRate] = useState(42);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const pulse = setInterval(() => {
            setHeartbeat((prev) => !prev);
            setIngestionRate(Math.floor(20 + Math.random() * 80));
        }, 2000);

        return () => clearInterval(pulse);
    }, []);

    const meta = useMemo(() => {
        return pageMeta[page] || {
            title: "SOC Simulator v2",
            subtitle: "Security Operations Center command interface.",
        };
    }, [page]);

    const activeAlerts = alerts.filter((a) => a.status === "open").length;
    const pipelineHealth = alerts.length > 0 ? "Healthy" : "Idle";

    const formattedTime = now.toLocaleTimeString();
    const formattedDate = now.toLocaleDateString();

    return (
        <div className="mb-6 rounded-2xl border border-soc-border bg-soc-panel px-5 py-4 shadow-lg shadow-black/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                {/* LEFT */}
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 p-1">
                            <img src={socLogo} alt="SOC Logo" className="w-full h-full object-contain" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-soc-text leading-tight">
                                {meta.title}
                            </h2>
                            <p className="text-sm text-soc-muted">
                                {meta.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:w-auto">
                    {/* TIME */}
                    <div className="rounded-xl border border-soc-border bg-soc-bg px-4 py-3">
                        <div className="flex items-center gap-2 text-soc-muted text-xs uppercase tracking-wide mb-1">
                            <Clock3 className="h-4 w-4" />
                            Local Time
                        </div>
                        <p className="text-sm font-semibold text-soc-text">
                            {formattedTime}
                        </p>
                        <p className="text-xs text-soc-muted">
                            {formattedDate}
                        </p>
                    </div>

                    {/* PIPELINE HEALTH */}
                    <div className="rounded-xl border border-soc-border bg-soc-bg px-4 py-3">
                        <div className="flex items-center gap-2 text-soc-muted text-xs uppercase tracking-wide mb-1">
                            <Activity className="h-4 w-4" />
                            Pipeline Health
                        </div>
                        <p className={`text-sm font-semibold ${pipelineHealth === "Healthy" ? "text-green-400" : "text-yellow-300"}`}>
                            {pipelineHealth}
                        </p>
                        <p className="text-xs text-soc-muted">
                            Event processing online
                        </p>
                    </div>

                    {/* LIVE TELEMETRY */}
                    <div className="rounded-xl border border-soc-border bg-soc-bg px-4 py-3">
                        <div className="flex items-center gap-2 text-soc-muted text-xs uppercase tracking-wide mb-1">
                            <Radio className="h-4 w-4" />
                            Live Telemetry
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-block h-2.5 w-2.5 rounded-full ${heartbeat ? "bg-green-400" : "bg-green-700"}`} />
                            <p className="text-sm font-semibold text-soc-text">
                                {ingestionRate} EPS
                            </p>
                        </div>
                        <p className="text-xs text-soc-muted">
                            Simulated events per second
                        </p>
                    </div>

                    {/* ACTIVE ALERTS */}
                    <div className="rounded-xl border border-soc-border bg-soc-bg px-4 py-3">
                        <div className="flex items-center gap-2 text-soc-muted text-xs uppercase tracking-wide mb-1">
                            <ShieldCheck className="h-4 w-4" />
                            Active Alerts
                        </div>
                        <p className={`text-sm font-semibold ${demoMode ? "text-blue-400" : "text-slate-200"}`}>
                            {activeAlerts}
                        </p>
                        <p className="text-xs text-soc-muted">
                            {demoMode ? "Recruiter demo active" : "Standard monitoring"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}