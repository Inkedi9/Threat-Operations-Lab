import { Activity } from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import MetricBar from "../ui/MetricBar";

/* ========================================
   ⛓️ Mini Kill Chain Progress
======================================== */

const steps = ["Recon", "Access", "Execute", "Escalate", "Exfil"];

export default function MiniKillChainProgress({
    displayedEvents = [],
    isRunning = false,
}) {
    const progress = getProgress(displayedEvents.length, steps.length);
    const activeStepIndex = getActiveStepIndex(displayedEvents.length, steps.length);

    return (
        <PanelCard
            variant="threat"
            live={isRunning}
            stress={isRunning}
            hotLevel={isRunning ? "medium" : "low"}
        >
            <PanelHeader
                icon={<Activity className="h-5 w-5 text-cyber-red" />}
                title="Attack Progress"
                subtitle="Offensive execution flow across the simulated chain"
            />

            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-cyber-muted">
                    <span>Attack Completion</span>
                    <span>{isRunning ? "active flow" : "staged"}</span>
                </div>

                <MetricBar
                    value={progress}
                    showValue
                    size="sm"
                    tone="red"
                />
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
                {steps.map((step, index) => {
                    const state =
                        index < activeStepIndex
                            ? "done"
                            : index === activeStepIndex
                                ? "active"
                                : "idle";

                    return (
                        <StepCard
                            key={step}
                            label={step}
                            index={index}
                            state={state}
                            isRunning={isRunning}
                        />
                    );
                })}
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 Step Card
======================================== */

function StepCard({ label, index, state, isRunning }) {
    const className =
        state === "done"
            ? "border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(28,16,54,0.30),rgba(10,8,18,0.92))]"
            : state === "active"
                ? "border-red-500/35 bg-[linear-gradient(180deg,rgba(56,10,14,0.34),rgba(12,8,10,0.92))] shadow-[0_0_20px_rgba(239,68,68,0.18)]"
                : "border-cyber-border bg-cyber-panel2";

    return (
        <div
            className={[
                "rounded-xl border px-3 py-3 text-center transition-all duration-200",
                className,
                isRunning && state === "active" ? "animate-pulse" : "",
            ].join(" ")}
        >
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyber-muted">
                Step {index + 1}
            </p>
            <p className="mt-1 text-sm font-semibold text-cyber-text">
                {label}
            </p>
            <p className="mt-1 text-[11px] text-cyber-muted">
                {state === "done" ? "done" : state === "active" ? "active" : "idle"}
            </p>
        </div>
    );
}

/* ========================================
   🧠 Helpers
======================================== */

function getProgress(eventCount, totalSteps) {
    if (!eventCount) return 0;
    return Math.min(100, Math.round((eventCount / (totalSteps * 2)) * 100));
}

function getActiveStepIndex(eventCount, totalSteps) {
    if (!eventCount) return 0;
    return Math.min(totalSteps - 1, Math.floor(eventCount / 2));
}