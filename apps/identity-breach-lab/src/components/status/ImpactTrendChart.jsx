import {
    Line,
    LineChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0]?.payload;

    return (
        <div className="rounded-2xl border border-danger/25 bg-black/90 p-4 shadow-[0_0_24px_rgba(239,68,68,0.14)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-red-300">{label}</p>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <p>
                    Compromised Identities:{" "}
                    <span className="font-semibold text-white">{point?.compromised ?? 0}</span>
                </p>
                <p>
                    Critical Assets Reached:{" "}
                    <span className="font-semibold text-white">{point?.critical ?? 0}</span>
                </p>
            </div>
        </div>
    );
}

export default function ImpactTrendChart({ data = [] }) {
    const latest = data[data.length - 1] || {
        compromised: 0,
        critical: 0,
    };

    return (
        <section className="rounded-2xl border border-line/80 bg-panel/90 p-5 shadow-soft">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-danger">
                        Impact Tracking
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">
                        Compromise vs Critical Reach
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                        Track how identity compromise evolves alongside access to sensitive assets.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:max-w-[220px]">
                    <div className="rounded-xl border border-lineSoft/60 bg-black/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                            Compromised IDs
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">{latest.compromised}</p>
                    </div>

                    <div className="rounded-xl border border-lineSoft/60 bg-black/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Critical
                        </p>
                        <p className="mt-2 text-xl font-bold text-red-200">{latest.critical}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 h-64 w-full sm:h-72 xl:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, "dataMax + 1"]}
                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="compromised"
                            stroke="#fca5a5"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#fca5a5" }}
                            activeDot={{ r: 6, fill: "#ffffff", stroke: "#fca5a5", strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="critical"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#ef4444" }}
                            activeDot={{ r: 6, fill: "#ffffff", stroke: "#ef4444", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
