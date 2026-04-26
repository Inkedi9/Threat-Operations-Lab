import { AlertTriangle, Clock3, ShieldCheck, TerminalSquare } from "lucide-react";

/* ========================================
   🔍 Alert Details Panel
======================================== */

export default function AlertDetailsPanel({ alert }) {
    if (!alert) {
        return (
            <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
                {/* 🏷️ Header */}
                <div className="mb-4">
                    <p className="text-lg font-semibold">Alert Details</p>
                    <p className="text-sm text-cyber-muted">
                        Select an alert from the queue to inspect it
                    </p>
                </div>

                {/* 📭 Empty state */}
                <div className="rounded-2xl border border-dashed border-cyber-border bg-cyber-panel2 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-border bg-cyber-bgSoft">
                        <ShieldCheck className="h-6 w-6 text-cyber-violet" />
                    </div>
                    <p className="text-sm font-medium text-cyber-text">No alert selected</p>
                    <p className="mt-2 text-sm text-cyber-muted">
                        Use the triage queue to inspect an alert.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
            {/* 🏷️ Header */}
            <div className="mb-4">
                <p className="text-lg font-semibold">Alert Details</p>
                <p className="text-sm text-cyber-muted">
                    Analyst context and detection metadata
                </p>
            </div>

            {/* 🚨 Main card */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-base font-semibold text-cyber-text">
                            {alert.title || "Detection alert"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-cyber-muted">
                            {alert.message}
                        </p>
                    </div>

                    <div className="rounded-xl border border-cyber-red/30 bg-cyber-red/10 p-2">
                        <AlertTriangle className="h-4 w-4 text-cyber-red" />
                    </div>
                </div>
            </div>

            {/* 📊 Metadata */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <MetaCard
                    icon={<AlertTriangle className="h-4 w-4 text-cyber-amber" />}
                    label="Severity"
                    value={alert.severity || "medium"}
                />
                <MetaCard
                    icon={<ShieldCheck className="h-4 w-4 text-cyber-violet" />}
                    label="Status"
                    value={alert.triageStatus || "open"}
                />
                <MetaCard
                    icon={<TerminalSquare className="h-4 w-4 text-cyan-400" />}
                    label="Source"
                    value={alert.source || "siem"}
                />
                <MetaCard
                    icon={<Clock3 className="h-4 w-4 text-cyber-blue" />}
                    label="Timestamp"
                    value={alert.time || alert.timestamp || "n/a"}
                />
            </div>

            {/* 🧠 Analyst notes */}
            <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-cyber-muted">
                    Detection Summary
                </p>
                <p className="text-sm leading-6 text-cyber-text">
                    This alert was generated from the active simulation stream and is intended
                    to represent a triage-ready SOC detection artifact.
                </p>
            </div>
        </div>
    );
}

/* ========================================
   🧩 Meta Card
======================================== */

function MetaCard({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-cyber-muted">
                    {label}
                </span>
                {icon}
            </div>
            <p className="text-sm font-semibold text-cyber-text break-words">{value}</p>
        </div>
    );
}