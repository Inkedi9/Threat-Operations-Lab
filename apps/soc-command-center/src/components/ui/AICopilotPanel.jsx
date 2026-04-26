import { Bot, Sparkles, ShieldAlert, Route, Lightbulb } from "lucide-react";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { Badge } from "@/components/ui/Badge";

export function AICopilotPanel({ alerts = [], page = "dashboard" }) {
    const critical = alerts.filter((a) => a.severity === "critical").length;
    const high = alerts.filter((a) => a.severity === "high").length;
    const open = alerts.filter((a) => a.status === "open").length;

    const pageContext = {
        dashboard: {
            title: "Executive SOC Overview",
            tip: "Use the dashboard to identify pressure points: critical count, open incidents, closure rate and attack source concentration.",
        },
        alerts: {
            title: "Triage Mode",
            tip: "Prioritize P1/P2 alerts first, then pivot on repeated IPs, success logs and critical MITRE techniques.",
        },
        attackstory: {
            title: "Attack Narrative Mode",
            tip: "Validate whether the observed sequence forms a credible kill chain: initial access, credential access, execution, privilege escalation and exfiltration.",
        },
        attackmap: {
            title: "Threat Geography Mode",
            tip: "Use repeated source IPs and severity clusters to identify suspicious origin patterns and likely coordinated activity.",
        },
        logs: {
            title: "Log Hunting Mode",
            tip: "Search for success, failed, encoded, mimikatz, scan, nmap and flag indicators to surface key investigation pivots.",
        },
        investigations: {
            title: "Correlation Mode",
            tip: "Select a source IP and reconstruct related events chronologically before deciding containment actions.",
        },
        ctf: {
            title: "Training Mode",
            tip: "Read the raw logs carefully. Success indicators often reveal the compromised account or the correct investigation answer.",
        },
    };

    const currentContext = pageContext[page] || pageContext.dashboard;

    const recommendation =
        critical > 0
            ? "Critical incidents detected. Start with containment, then validate blast radius and related alerts."
            : high > 0
                ? "High-severity activity detected. Correlate repeated IPs, users and successful authentication events."
                : alerts.length > 0
                    ? currentContext.tip
                    : "No telemetry available yet. Start a simulation to generate SOC context.";

    const intel = analyzeSOC(alerts);

    function analyzeSOC(alerts) {
        if (!alerts.length) {
            return {
                threatLevel: "Idle",
                message: "No active telemetry. SOC is currently idle.",
                priority: "low",
            };
        }

        const critical = alerts.filter(a => a.severity === "critical").length;
        const high = alerts.filter(a => a.severity === "high").length;

        const hasBruteforce = alerts.some(a =>
            a.name.toLowerCase().includes("brute")
        );

        const hasMimikatz = alerts.some(a =>
            a.logs?.some(log => log.toLowerCase().includes("mimikatz"))
        );

        const repeatedIPs = alerts
            .map(a => a.ip)
            .filter((ip, i, arr) => arr.indexOf(ip) !== i);

        if (hasMimikatz) {
            return {
                threatLevel: "CRITICAL",
                message:
                    "Post-exploitation behavior detected (credential dumping). Immediate containment required.",
                priority: "critical",
            };
        }

        if (hasBruteforce && repeatedIPs.length > 0) {
            return {
                threatLevel: "HIGH",
                message:
                    "Brute force activity followed by repeated access attempts suggests account compromise.",
                priority: "high",
            };
        }

        if (critical > 0) {
            return {
                threatLevel: "HIGH",
                message:
                    "Critical alerts detected. Investigate immediately and isolate affected systems.",
                priority: "high",
            };
        }

        return {
            threatLevel: "MODERATE",
            message:
                "Ongoing suspicious activity detected. Continue monitoring and correlation.",
            priority: "medium",
        };
    }

    return (
        <CyberPanel variant={critical > 0 ? "threat" : "defense"} className="xl:sticky xl:top-6">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-blue-300">
                        AI Copilot
                    </p>
                    <h3 className="mt-2 text-xl font-black text-white">
                        SOC Assistant
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Context-aware guidance for analyst workflow.
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-3 text-blue-300">
                    <Bot className="h-6 w-6" />
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="blue">{alerts.length} Alerts</Badge>
                <Badge tone={critical > 0 ? "red" : "green"}>{critical} Critical</Badge>
                <Badge tone="orange">{open} Open</Badge>
            </div>

            <div className="space-y-3">
                <CopilotCard
                    icon={ShieldAlert}
                    label="Current Assessment"
                    text={
                        critical > 0
                            ? "Critical pressure detected. The SOC should switch to containment-first triage."
                            : "Current telemetry does not indicate immediate critical pressure."
                    }
                    tone={critical > 0 ? "red" : "blue"}
                />

                <CopilotCard
                    icon={Route}
                    label="Suggested Next Step"
                    text={recommendation}
                    tone="cyan"
                />

                <CopilotCard
                    icon={Lightbulb}
                    label="Investigation Tip"
                    text="Pivot on repeated IPs, affected users, MITRE techniques and logs containing success indicators."
                    tone="green"
                />

                <CopilotCard
                    icon={ShieldAlert}
                    label="Threat Intelligence"
                    text={`${intel.threatLevel} — ${intel.message}`}
                    tone={
                        intel.priority === "critical"
                            ? "red"
                            : intel.priority === "high"
                                ? "orange"
                                : "blue"
                    }
                />
            </div>
        </CyberPanel>
    );
}

function CopilotCard({ icon: Icon, label, text, tone = "blue" }) {
    const tones = {
        blue: "border-blue-500/15 bg-blue-500/10 text-blue-300",
        cyan: "border-cyan-500/15 bg-cyan-500/10 text-cyan-300",
        green: "border-emerald-500/15 bg-emerald-500/10 text-emerald-300",
        red: "border-red-500/15 bg-red-500/10 text-red-300",
        slate: "border-slate-500/15 bg-slate-500/10 text-slate-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{text}</p>
        </div>
    );
}