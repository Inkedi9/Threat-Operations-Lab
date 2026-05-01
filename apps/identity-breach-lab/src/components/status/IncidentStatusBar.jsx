function toneClasses(tone) {
    switch (tone) {
        case "critical":
            return {
                wrapper:
                    "border-red-500/24 bg-red-500/10 shadow-[0_0_22px_rgba(239,68,68,0.10)]",
                badge:
                    "border-red-400/24 bg-red-500/14 text-red-200",
                dot: "bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.7)] animate-pulse",
                text: "text-red-100",
            };

        case "high":
            return {
                wrapper:
                    "border-danger/20 bg-danger/10 shadow-[0_0_18px_rgba(239,68,68,0.08)]",
                badge:
                    "border-danger/25 bg-danger/10 text-red-200",
                dot: "bg-danger shadow-[0_0_16px_rgba(239,68,68,0.55)] animate-pulse",
                text: "text-zinc-100",
            };

        case "medium":
            return {
                wrapper:
                    "border-amber-500/20 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.05)]",
                badge:
                    "border-amber-500/25 bg-amber-500/10 text-amber-200",
                dot: "bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)]",
                text: "text-zinc-100",
            };

        default:
            return {
                wrapper:
                    "border-emerald-500/18 bg-emerald-500/8 shadow-[0_0_16px_rgba(16,185,129,0.04)]",
                badge:
                    "border-emerald-500/24 bg-emerald-500/12 text-emerald-200",
                dot: "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.35)]",
                text: "text-zinc-100",
            };
    }
}

export default function IncidentStatusBar({ status }) {
    const styles = toneClasses(status.tone);

    return (
        <section
            className={`rounded-2xl border p-4 transition-all duration-500 ${styles.wrapper}`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                    <span className={`mt-1 h-3 w-3 rounded-full ${styles.dot}`} />
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                            Environment Status
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles.badge}`}
                            >
                                {status.label}
                            </span>
                            <span className={`text-sm ${styles.text}`}>{status.message}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-lineSoft bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Identity Attack Monitoring
                </div>
            </div>
        </section>
    );
}