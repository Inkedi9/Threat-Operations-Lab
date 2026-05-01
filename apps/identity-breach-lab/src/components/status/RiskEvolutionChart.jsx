import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
        <div className="rounded-2xl border border-danger/25 bg-black/90 p-4 shadow-[0_0_24px_rgba(239,68,68,0.14)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-red-300">{label}</p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <p>
                    Risk Score: <span className="font-semibold text-white">{point.risk}/100</span>
                </p>
                <p>
                    Compromised Identities: <span className="font-semibold text-white">{point.compromised}</span>
                </p>
                <p>
                    Critical Assets Reached: <span className="font-semibold text-white">{point.critical}</span>
                </p>
            </div>
        </div>
    );
}

export default function RiskEvolutionChart({ data = [] }) {
    const latest = data[data.length - 1] || {
        risk: 0,
        compromised: 0,
        critical: 0,
    };

    return (
        <section className="rounded-2xl border border-danger/20 bg-panelAlt/95 p-5 shadow-danger">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-danger">
                        Exposure Monitoring
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                        Live view of identity compromise pressure across the simulation.
                    </p>
                </div>

                <div className="rounded-xl border border-lineSoft bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    Analytics Layer
                </div>
            </div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Threat Analytics
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">
                        Risk Evolution
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-muted">
                        Visualize how scenario execution increases exposure across identities,
                        lateral movement paths and critical enterprise assets.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 xl:min-w-[320px]">
                    <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            Current Risk
                        </p>
                        <p className="mt-2 text-2xl font-bold text-red-200">
                            {latest.risk}
                        </p>
                    </div>
                    <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                            Compromised IDs
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white">
                            {latest.compromised}
                        </p>
                    </div>
                    <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                            Critical
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white">
                            {latest.critical}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                        <defs>
                            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(239,68,68,0.55)" />
                                <stop offset="60%" stopColor="rgba(239,68,68,0.18)" />
                                <stop offset="100%" stopColor="rgba(239,68,68,0.02)" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="risk"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fill="url(#riskFill)"
                            activeDot={{
                                r: 6,
                                fill: "#fca5a5",
                                stroke: "#ef4444",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}