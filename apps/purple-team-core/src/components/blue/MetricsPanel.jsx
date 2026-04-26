import { Clock3, Activity, ShieldCheck, TimerReset } from "lucide-react";

/* ========================================
   📊 MTTD / MTTR Metrics Panel
======================================== */

export default function MetricsPanel({ metrics, visibleStatus }) {
    const mttd = metrics?.mttd;
    const mttr = metrics?.mttr;
    const baselineMttd = 95;
    const baselineMttr = 260;

    return (
        <div className="rounded-3xl border border-cyber-border bg-cyber-panel/90 p-4 shadow-cyber">
            {/* ========================================
         🏷️ Header
      ======================================== */}
            <div className="mb-4">
                <p className="text-lg font-semibold">MTTD / MTTR Metrics</p>
                <p className="mt-1 text-sm text-cyber-muted">
                    Detection and response timing for the active simulation
                </p>
            </div>

            {/* ========================================
         🧩 Main Metrics
      ======================================== */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetricCard
                    icon={<Clock3 className="h-4 w-4 text-cyber-blue" />}
                    label="MTTD"
                    value={mttd !== null ? `${mttd}s` : "n/a"}
                    helper="Mean Time To Detect"
                    tone={mttd !== null ? compareTone(mttd, baselineMttd, true) : "text-cyber-muted"}
                />

                <MetricCard
                    icon={<TimerReset className="h-4 w-4 text-cyber-amber" />}
                    label="MTTR"
                    value={mttr !== null ? `${mttr}s` : "n/a"}
                    helper="Mean Time To Respond"
                    tone={mttr !== null ? compareTone(mttr, baselineMttr, true) : "text-cyber-muted"}
                />
            </div>

            {/* ========================================
         📉 Comparison
      ======================================== */}
            <div className="mt-4 grid grid-cols-1 gap-3">
                <ComparisonRow
                    label="Detection Baseline"
                    current={mttd}
                    baseline={baselineMttd}
                    suffix="s"
                />
                <ComparisonRow
                    label="Response Baseline"
                    current={mttr}
                    baseline={baselineMttr}
                    suffix="s"
                />
            </div>

            {/* ========================================
         🧠 Analyst Interpretation
      ======================================== */}
            <div className="mt-4 rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
                <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyber-violet" />
                    <p className="text-xs uppercase tracking-wide text-cyber-muted">
                        Interpretation
                    </p>
                </div>

                <p className="text-sm leading-6 text-cyber-text">
                    {buildInterpretation({ mttd, mttr, visibleStatus })}
                </p>
            </div>

            {/* ========================================
         📈 Session Context
      ======================================== */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniStat
                    icon={<Activity className="h-4 w-4 text-cyber-green" />}
                    label="Detection State"
                    value={visibleStatus}
                />
                <MiniStat
                    icon={<Clock3 className="h-4 w-4 text-cyan-400" />}
                    label="Telemetry Pace"
                    value={mttd !== null && mttd < 60 ? "Fast" : "Moderate"}
                />
            </div>
        </div>
    );
}

/* ========================================
   🧩 Cards
======================================== */

function MetricCard({ icon, label, value, helper, tone }) {
    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-cyber-muted">{label}</span>
                {icon}
            </div>
            <p className={`text-2xl font-bold ${tone}`}>{value}</p>
            <p className="mt-1 text-xs text-cyber-muted">{helper}</p>
        </div>
    );
}

function MiniStat({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-cyber-muted">{label}</span>
                {icon}
            </div>
            <p className="text-sm font-semibold text-cyber-text break-words">{value}</p>
        </div>
    );
}

function ComparisonRow({ label, current, baseline, suffix = "" }) {
    const delta =
        current !== null && current !== undefined ? current - baseline : null;

    return (
        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-cyber-text">{label}</p>
                    <p className="mt-1 text-xs text-cyber-muted">
                        Baseline: {baseline}
                        {suffix}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm font-semibold text-cyber-text">
                        {current !== null && current !== undefined ? `${current}${suffix}` : "n/a"}
                    </p>
                    <p className={`mt-1 text-xs ${deltaTone(delta)}`}>
                        {delta === null
                            ? "No data"
                            : delta <= 0
                                ? `${Math.abs(delta)}${suffix} faster`
                                : `${delta}${suffix} slower`}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ========================================
   🧠 Helpers
======================================== */

function compareTone(value, baseline, lowerIsBetter = true) {
    if (lowerIsBetter) {
        if (value <= baseline * 0.7) return "text-cyber-green";
        if (value <= baseline) return "text-cyber-amber";
        return "text-cyber-red";
    }

    if (value >= baseline * 1.2) return "text-cyber-green";
    if (value >= baseline) return "text-cyber-amber";
    return "text-cyber-red";
}

function deltaTone(delta) {
    if (delta === null) return "text-cyber-muted";
    if (delta <= 0) return "text-cyber-green";
    return "text-cyber-red";
}

function buildInterpretation({ mttd, mttr, visibleStatus }) {
    if (visibleStatus === "Missed") {
        return "The current simulation indicates that detection quality is insufficient. MTTD and MTTR are either unavailable or not meaningful until the defensive stack successfully identifies the attack path.";
    }

    if (visibleStatus === "Partially Detected") {
        return `The defensive stack has partial visibility. ${mttd !== null
                ? `Detection occurred after approximately ${mttd} seconds,`
                : "Detection timing remains uncertain,"
            } but response quality still suggests room for stronger correlation and operational efficiency.`;
    }

    return `The current session reflects a successful defensive outcome. ${mttd !== null ? `Detection was achieved in approximately ${mttd} seconds` : "Detection timing is available"
        }${mttr !== null ? ` and response in about ${mttr} seconds` : ""}, indicating stronger analyst and control alignment than the baseline.`;
}