function getThreatLevel(score) {
    if (score >= 85) {
        return {
            label: "Critical",
            tone: "text-red-200",
            ring: "stroke-red-500",
            glow: "shadow-[0_0_30px_rgba(239,68,68,0.22)]",
            description:
                "Critical enterprise assets are exposed through active identity compromise.",
        };
    }

    if (score >= 60) {
        return {
            label: "High",
            tone: "text-red-300",
            ring: "stroke-red-400",
            glow: "shadow-[0_0_24px_rgba(239,68,68,0.16)]",
            description:
                "Compromised identities and access abuse are actively increasing exposure.",
        };
    }

    if (score >= 35) {
        return {
            label: "Elevated",
            tone: "text-amber-200",
            ring: "stroke-amber-400",
            glow: "shadow-[0_0_20px_rgba(251,191,36,0.12)]",
            description:
                "Suspicious activity is present and the environment risk is rising.",
        };
    }

    return {
        label: "Stable",
        tone: "text-emerald-200",
        ring: "stroke-emerald-400",
        glow: "shadow-[0_0_18px_rgba(52,211,153,0.10)]",
        description:
            "The identity environment is currently operating near its baseline state.",
    };
}

export default function ThreatGaugeCard({ data = [] }) {
    const latest = data[data.length - 1] || {
        risk: 0,
        compromised: 0,
        critical: 0,
    };

    const score = latest.risk ?? 0;

    const threat = getThreatLevel(score);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(score, 100));
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <section
            className={`rounded-2xl border border-danger/20 bg-panelAlt/95 p-5 ${threat.glow}`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-danger">
                        Threat Gauge
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">
                        Environment Pressure
                    </h3>
                </div>

                <div className="rounded-xl border border-lineSoft bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Live Signal
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center">
                <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52 xl:h-56 xl:w-56">
                    <svg className="h-44 w-44 -rotate-90 sm:h-52 sm:w-52 xl:h-56 xl:w-56" viewBox="0 0 180 180">
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="12"
                        />
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            strokeWidth="12"
                            strokeLinecap="round"
                            className={`${threat.ring} transition-all duration-700`}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: dashOffset,
                            }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Risk Score
                        </p>
                        <p className="mt-2 text-4xl font-bold text-white sm:text-5xl">{score}</p>
                        <p className={`mt-2 text-sm font-semibold uppercase tracking-[0.2em] ${threat.tone}`}>
                            {threat.label}
                        </p>
                    </div>
                </div>

                <p className="mt-2 max-w-sm text-center text-sm leading-6 text-zinc-400">
                    {threat.description}
                </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        Score
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">{score}</p>
                </div>

                <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        Identities
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                        {latest.compromised}
                    </p>
                </div>

                <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        Critical
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-200">
                        {latest.critical}
                    </p>
                </div>
            </div>
        </section>
    );
}