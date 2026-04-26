import {
    Shield,
    AlertTriangle,
    Activity,
    Flame,
    Swords,
    ShieldCheck,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import MetricBar from "../ui/MetricBar";

/* ================================
   🎯 Purple Scoreboard Component
================================ */

export default function Scoreboard({ metrics }) {
    if (!metrics) return null;

    const totalLogs = metrics?.totalLogs ?? 0;
    const totalAlerts = metrics?.totalAlerts ?? 0;
    const coverage = metrics?.coverage ?? 0;
    const momentum = metrics?.momentum ?? 0;

    const simulatedAttacks = totalLogs + totalAlerts;
    const detectionRate = computeDetectionRate(metrics);
    const pressureLabel = getPressureLabel(momentum, detectionRate);

    return (
        <PanelCard variant="signal">
            <PanelHeader
                icon={<Swords className="h-5 w-5 text-cyber-violet" />}
                title="Red vs Blue Scoreboard"
                subtitle="Live detection performance"
            />

            <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <FactionCard
                        variant="threat"
                        side="Red Team"
                        label="Offensive Pressure"
                        value={simulatedAttacks}
                        hint="Attack activity"
                        icon={<Activity className="h-4 w-4 text-cyber-red" />}
                    />

                    <FactionCard
                        variant="defense"
                        side="Blue Team"
                        label="Defensive Response"
                        value={totalAlerts}
                        hint="Triggered alerts"
                        icon={<ShieldCheck className="h-4 w-4 text-cyber-blue" />}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <KPI
                        variant="signal"
                        icon={<Shield className="h-4 w-4 text-cyber-violet" />}
                        label="Coverage"
                        value={`${coverage}%`}
                        tone="violet"
                    />

                    <KPI
                        variant="signal"
                        icon={<AlertTriangle className="h-4 w-4 text-cyber-green" />}
                        label="Detection"
                        value={`${detectionRate}%`}
                        tone="green"
                    />
                </div>
            </div>

            <div className="mt-5">
                <PanelCard variant="intel" dense>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                Engagement Pressure
                            </p>
                            <p className="mt-2 text-sm font-semibold text-cyber-text">
                                {pressureLabel}
                            </p>
                        </div>

                        <span className="flex items-center gap-2 text-cyber-muted">
                            <Flame className="h-4 w-4 text-orange-400" />
                            <span className="text-xs">Momentum</span>
                        </span>
                    </div>

                    <div className="mt-4">
                        <MetricBar
                            value={momentum}
                            showValue
                            size="md"
                            tone="violet"
                        />
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ================================
   🧩 UI Blocks
================================ */

function FactionCard({ variant, side, label, value, hint, icon }) {
    const railTone =
        variant === "threat"
            ? "bg-cyber-red shadow-[0_0_18px_rgba(239,68,68,0.40)]"
            : "bg-cyber-blue shadow-[0_0_18px_rgba(59,130,246,0.38)]";

    return (
        <PanelCard variant={variant} dense className="relative overflow-hidden">
            <div className={`absolute inset-y-0 left-0 w-[3px] ${railTone}`} />

            <div className="pl-2">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                            {side}
                        </p>
                        <p className="mt-1 text-sm font-medium text-cyber-text">
                            {label}
                        </p>
                    </div>

                    <div>{icon}</div>
                </div>

                <div className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-bold text-cyber-text">{value}</p>
                    <p className="text-right text-xs text-cyber-muted">{hint}</p>
                </div>
            </div>
        </PanelCard>
    );
}

function KPI({ variant = "signal", icon, label, value, tone = "default" }) {
    const valueTone =
        tone === "green"
            ? "text-cyber-green"
            : tone === "violet"
                ? "text-cyber-violet"
                : tone === "blue"
                    ? "text-cyber-blue"
                    : tone === "red"
                        ? "text-cyber-red"
                        : "text-cyber-text";

    return (
        <PanelCard variant={variant} dense>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-cyber-muted">
                    {label}
                </span>
                {icon}
            </div>

            <p className={`text-xl font-bold ${valueTone}`}>{value}</p>
        </PanelCard>
    );
}

/* ================================
   📊 Helpers
================================ */

function computeDetectionRate(metrics) {
    const totalLogs = metrics?.totalLogs ?? 0;
    const totalAlerts = metrics?.totalAlerts ?? 0;

    if (!totalLogs) return 0;
    return Math.round((totalAlerts / totalLogs) * 100);
}

function getPressureLabel(momentum, detectionRate) {
    if (momentum >= 75 && detectionRate >= 60) {
        return "High activity with strong blue response";
    }

    if (momentum >= 75 && detectionRate < 60) {
        return "High offensive pressure, defensive lag";
    }

    if (momentum >= 40) {
        return "Moderate engagement across both sides";
    }

    if (momentum > 0) {
        return "Low but active operator tempo";
    }

    return "No active engagement yet";
}