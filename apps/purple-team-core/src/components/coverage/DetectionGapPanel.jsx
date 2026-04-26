import { ShieldCheck, AlertTriangle, XCircle, Radar } from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import EmptyState from "../ui/EmptyState";

/* ========================================
   🧠 Detection Gap Analysis Panel
======================================== */

export default function DetectionGapPanel({
    selectedScenarios = [],
    visibleStatus,
    coverage,
}) {
    const techniques = buildTechniqueCoverage(
        selectedScenarios.filter(Boolean),
        visibleStatus,
        coverage
    );

    return (
        <PanelCard variant="intel">
            <PanelHeader
                icon={<Radar className="h-5 w-5 text-cyber-violet" />}
                title="Detection Gap Analysis"
                subtitle="Identify uncovered techniques and detection weaknesses"
            />

            <div className="mt-4">
                {!techniques.length ? (
                    <PanelCard variant="glass" className="border-dashed">
                        <EmptyState
                            compact
                            title="No scenario coverage yet"
                            description="Select a scenario or build a campaign to inspect uncovered techniques and validation gaps."
                        />
                    </PanelCard>
                ) : (
                    <div className="space-y-3">
                        {techniques.map((tech, index) => {
                            const variant =
                                tech.status === "covered"
                                    ? "defense"
                                    : tech.status === "partial"
                                        ? "signal"
                                        : "threat";

                            return (
                                <PanelCard
                                    key={`${tech.technique}-${index}`}
                                    variant={variant}
                                    dense
                                    className="transition hover:scale-[1.01]"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-cyber-text">
                                                {tech.name}
                                            </p>
                                            <p className="text-xs text-cyber-muted">
                                                {tech.technique}
                                            </p>
                                        </div>

                                        <StatusIcon status={tech.status} />
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span className="text-cyber-muted">Risk</span>
                                        <span className={riskColor(tech.risk)}>
                                            {tech.risk}
                                        </span>
                                    </div>
                                </PanelCard>
                            );
                        })}
                    </div>
                )}
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧠 Build Technique Coverage
======================================== */

function buildTechniqueCoverage(scenarios, visibleStatus, coverage) {
    if (!scenarios.length) return [];

    return scenarios.map((scenario) => {
        let status = "gap";
        let risk = "High";

        if (visibleStatus === "Detected") {
            status = "covered";
            risk = "Low";
        } else if (visibleStatus === "Partially Detected") {
            status = "partial";
            risk = "Medium";
        } else if (coverage > 60) {
            status = "partial";
            risk = "Medium";
        }

        return {
            name: scenario.name,
            technique: scenario.technique,
            status,
            risk,
        };
    });
}

/* ========================================
   🎯 Status Icon
======================================== */

function StatusIcon({ status }) {
    if (status === "covered") {
        return <ShieldCheck className="h-5 w-5 text-cyber-green" />;
    }

    if (status === "partial") {
        return <AlertTriangle className="h-5 w-5 text-cyber-amber" />;
    }

    return <XCircle className="h-5 w-5 text-cyber-red" />;
}

/* ========================================
   🎨 Risk Color
======================================== */

function riskColor(risk) {
    if (risk === "Low") return "font-semibold text-cyber-green";
    if (risk === "Medium") return "font-semibold text-cyber-amber";
    return "font-semibold text-cyber-red";
}