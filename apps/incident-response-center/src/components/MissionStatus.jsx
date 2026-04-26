import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function MissionStatus({
    riskScore,
    remediationProgress,
    completedActions,
    totalActions,
}) {
    const readyForRecovery =
        riskScore <= 35 && remediationProgress >= 75 && completedActions >= totalActions / 2;

    return (
        <section
            className={`rounded-[2rem] border p-5 ${readyForRecovery
                    ? "border-green-500/25 bg-green-500/10"
                    : "border-orange-500/25 bg-orange-500/10"
                }`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div
                        className={`rounded-2xl border p-3 ${readyForRecovery
                                ? "border-green-500/25 bg-green-500/10 text-green-300"
                                : "border-orange-500/25 bg-orange-500/10 text-orange-300"
                            }`}
                    >
                        {readyForRecovery ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-command-muted">
                            Mission Status
                        </p>

                        <h2
                            className={`mt-1 text-2xl font-black ${readyForRecovery ? "text-green-300" : "text-orange-300"
                                }`}
                        >
                            {readyForRecovery ? "Ready for Recovery" : "Containment in Progress"}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-command-muted">
                            {readyForRecovery
                                ? "Risk is controlled and remediation progress is sufficient to begin recovery validation."
                                : "Additional containment and remediation actions are required before recovery can be validated."}
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                    <Mini label="Risk" value={`${riskScore}/100`} />
                    <Mini label="Remediation" value={`${remediationProgress}%`} />
                    <Mini label="Actions" value={`${completedActions}/${totalActions}`} />
                </div>
            </div>

            {readyForRecovery && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-green-500/15 bg-black/25 p-3 text-sm font-bold text-green-300">
                    <CheckCircle2 size={16} />
                    Recovery gate passed. Incident can move to reporting and lessons learned.
                </div>
            )}
        </section>
    );
}

function Mini({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/30 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                {label}
            </p>
            <p className="mt-1 text-lg font-black text-command-text">{value}</p>
        </div>
    );
}