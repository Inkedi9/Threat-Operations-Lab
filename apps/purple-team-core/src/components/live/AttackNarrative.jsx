import { Sparkles, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import EmptyState from "../ui/EmptyState";

/* ========================================
   🧠 Attack Narrative (Storytelling)
======================================== */

export default function AttackNarrative({ events = [] }) {
    const latestEvent = events[events.length - 1] ?? null;

    if (!latestEvent) {
        return (
            <PanelCard variant="intel">
                <EmptyState
                    icon={<Sparkles className="h-5 w-5 text-cyber-violet" />}
                    title="Waiting for attack simulation"
                    description="Launch a run to generate a live narrative of offensive actions, detections and validation outcomes."
                    compact
                />
            </PanelCard>
        );
    }

    const narrative = generateNarrative(latestEvent);

    return (
        <PanelCard variant="intel">
            <PanelHeader
                icon={<Sparkles className="h-5 w-5 text-cyber-violet" />}
                title="Attack Narrative"
                subtitle="Latest operator storyline"
                compact
            />

            <div className="mt-4">
                <PanelCard variant="signal" dense className="relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-cyber-violet shadow-[0_0_18px_rgba(139,92,246,0.42)]" />

                    <div className="pl-2">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                    Last Narrative Update
                                </p>
                                <p className="mt-2 text-sm font-semibold text-cyber-text">
                                    {latestEvent.title}
                                </p>
                            </div>

                            <NarrativeIcon type={latestEvent.type} />
                        </div>

                        <p className="mt-4 text-sm leading-7 text-cyber-text">
                            {narrative}
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-cyber-muted">
                            <NarrativeMeta label="Time" value={latestEvent.time ?? "n/a"} />
                            <NarrativeMeta label="Type" value={latestEvent.type ?? "unknown"} />
                            <NarrativeMeta label="Message" value={latestEvent.message ?? "n/a"} />
                        </div>
                    </div>
                </PanelCard>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function NarrativeIcon({ type }) {
    if (type === "attack") {
        return (
            <div className="rounded-md border border-cyber-red/30 bg-cyber-red/10 p-2 text-cyber-red shadow-[0_0_14px_rgba(239,68,68,0.16)]">
                <Activity className="h-4 w-4" />
            </div>
        );
    }

    if (type === "alert") {
        return (
            <div className="rounded-md border border-cyber-blue/30 bg-cyber-blue/10 p-2 text-cyber-blue shadow-[0_0_14px_rgba(59,130,246,0.16)]">
                <AlertTriangle className="h-4 w-4" />
            </div>
        );
    }

    return (
        <div className="rounded-md border border-cyber-violet/30 bg-cyber-violet/10 p-2 text-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.16)]">
            <ShieldCheck className="h-4 w-4" />
        </div>
    );
}

function NarrativeMeta({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <span className="uppercase tracking-wide text-[11px] text-cyber-muted">
                {label}
            </span>
            <span className="text-right text-cyber-text">
                {value}
            </span>
        </div>
    );
}

/* ========================================
   🧠 Narrative Generator
======================================== */

function generateNarrative(event) {
    if (event.type === "attack") {
        return "The adversary is actively progressing through the environment. This stage reflects offensive pressure being applied to the selected infrastructure path and should be correlated with telemetry, topology changes and downstream detections.";
    }

    if (event.type === "alert") {
        return "Defensive systems have identified suspicious activity and generated an alert. This indicates that blue-side visibility is present, but the quality of correlation and response still depends on scenario context and alert confidence.";
    }

    if (event.type === "log") {
        return "Operational telemetry is being collected and recorded. This phase suggests the activity is visible at the logging layer, even if it has not yet produced a high-confidence defensive alert.";
    }

    if (event.type === "purple") {
        return "The purple validation layer is interpreting the scenario outcome and comparing expected detection behavior against actual visibility. This is the point where gaps, strengths and tuning opportunities become explicit.";
    }

    if (event.type === "campaign") {
        return "The campaign engine is coordinating multiple attack stages across the lab. This narrative update reflects the broader sequencing of offensive actions and defensive pressure across the simulated chain.";
    }

    return "Ongoing activity is being observed within the simulated environment. Continue the run to build more operational context.";
}