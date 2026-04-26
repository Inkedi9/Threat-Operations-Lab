import { Server, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AssetStatusCard({ name, contained, remediated }) {
    const risk = name === "DC-01" ? "Critical" : name === "FILE-SRV-02" ? "High" : "Medium";

    return (
        <div className="premium-hover rounded-3xl border border-white/5 bg-black/35 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-xl font-black text-command-text">{name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-command-muted">
                        Impacted Asset
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                    <Server size={20} />
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <Info label="Risk" value={risk} tone="text-red-300" />
                <Info
                    label="State"
                    value={contained ? "Contained" : "Exposed"}
                    tone={contained ? "text-green-300" : "text-orange-300"}
                />
            </div>

            <div className="mt-5 space-y-3">
                <StatusLine
                    icon={AlertTriangle}
                    label="Before"
                    value="Network reachable"
                    tone="text-red-300"
                />
                <StatusLine
                    icon={ShieldCheck}
                    label="Containment"
                    value={contained ? "Isolation applied" : "Awaiting action"}
                    tone={contained ? "text-green-300" : "text-command-muted"}
                />
                <StatusLine
                    icon={ShieldCheck}
                    label="Remediation"
                    value={remediated ? "Validation required" : "Not started"}
                    tone={remediated ? "text-green-300" : "text-command-muted"}
                />
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-900">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${contained
                            ? "w-2/3 bg-gradient-to-r from-green-700 to-green-400"
                            : "w-1/4 bg-gradient-to-r from-red-600 to-orange-400"
                        }`}
                />
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
            <p className={`mt-1 text-sm font-black ${tone}`}>{value}</p>
        </div>
    );
}

function StatusLine({ icon: Icon, label, value, tone }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/25 px-3 py-2">
            <div className="flex items-center gap-2">
                <Icon size={15} className={tone} />
                <span className="text-xs text-command-muted">{label}</span>
            </div>
            <span className={`text-xs font-bold ${tone}`}>{value}</span>
        </div>
    );
}