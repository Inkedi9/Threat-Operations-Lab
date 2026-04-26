import { TrendingDown } from "lucide-react";

export default function RiskReductionPanel({
    initialRisk,
    riskScore,
    completedActions,
    remediationProgress,
}) {
    const reduction = initialRisk - riskScore;
    const reductionPercent = Math.round((reduction / initialRisk) * 100);

    return (
        <section className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        Risk Reduction
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-command-text">
                        Exposure Control
                    </h2>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-300">
                    <TrendingDown size={22} />
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Box label="Before" value={`${initialRisk}/100`} tone="red" />
                <Box label="After" value={`${riskScore}/100`} tone="orange" />
                <Box label="Reduced" value={`${reductionPercent}%`} tone="green" />
            </div>

            <div className="mt-7 space-y-5">
                <Bar label="Current Risk" value={riskScore} tone="orange" />
                <Bar label="Risk Reduced" value={reductionPercent} tone="green" />
                <Bar label="Remediation" value={remediationProgress} tone="green" />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
                <Mini label="Contained Actions" value={completedActions} />
                <Mini
                    label="Remaining Exposure"
                    value={riskScore > 40 ? "Elevated" : "Controlled"}
                />
                <Mini
                    label="Recovery Status"
                    value={remediationProgress >= 75 ? "Ready" : "In Progress"}
                />
            </div>
        </section>
    );
}

function Box({ label, value, tone }) {
    const tones = {
        red: "text-red-300",
        orange: "text-orange-300",
        green: "text-green-300",
    };

    return (
        <div className="rounded-3xl border border-white/5 bg-black/35 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-command-muted">
                Risk {label}
            </p>
            <p className={`mt-2 text-3xl font-black ${tones[tone]}`}>{value}</p>
        </div>
    );
}

function Bar({ label, value, tone }) {
    const bar =
        tone === "green"
            ? "from-green-700 via-green-500 to-emerald-300"
            : "from-red-600 via-orange-500 to-amber-300";

    return (
        <div>
            <div className="mb-2 flex justify-between text-sm">
                <span className="font-bold text-command-muted">{label}</span>
                <span className="font-black text-command-text">{value}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-stone-900 shadow-inner">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function Mini({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/30 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                {label}
            </p>
            <p className="mt-1 font-black text-command-text">{value}</p>
        </div>
    );
}