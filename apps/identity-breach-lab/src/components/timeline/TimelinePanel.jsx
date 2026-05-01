import Panel from "../ui/Panel";
import MitreBadge from "../ui/MitreBadge";

function severityTone(severity) {
    switch (severity) {
        case "critical":
            return "border-red-500/20 bg-red-500/10 text-red-200";
        case "high":
            return "border-danger/20 bg-danger/10 text-red-200";
        case "medium":
            return "border-amber-500/20 bg-amber-500/10 text-amber-200";
        default:
            return "border-lineSoft bg-zinc-900/45 text-zinc-300";
    }
}

export default function TimelinePanel({ items = [], currentReplayStep = null }) {
    return (
        <Panel
            title="Attack Timeline"
            subtitle="Chronological progression of compromise, escalation and access abuse."
        >
            <div className="space-y-4">
                {items.map((item) => {
                    const isReplayStep =
                        currentReplayStep &&
                        item.timestamp === currentReplayStep.timestamp &&
                        item.message === currentReplayStep.message;

                    return (
                        <div
                            key={item.id}
                            className={`rounded-2xl border p-4 transition ${isReplayStep
                                ? "border-danger/30 bg-danger/10 shadow-[0_0_22px_rgba(239,68,68,0.10)]"
                                : "border-line/80 bg-black/20"
                                }`}
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`h-3 w-3 rounded-full ${isReplayStep
                                        ? "bg-danger shadow-[0_0_14px_rgba(239,68,68,0.75)] animate-pulse"
                                        : "bg-danger/70"
                                        }`}
                                />
                                <span className="font-semibold text-zinc-200">{item.timestamp}</span>

                                <span
                                    className={`rounded-full border px-2.5 py-1 text-xs ${severityTone(
                                        item.severity
                                    )}`}
                                >
                                    {item.severity}
                                </span>

                                {isReplayStep && (
                                    <span className="rounded-full border border-red-400/30 bg-red-500/12 px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-red-100">
                                        replay step
                                    </span>
                                )}

                                <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                                    {item.technique}
                                </span>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-zinc-200">{item.message}</p>

                            {item.techniqueId && item.tactic && (
                                <div className="mt-3">
                                    <MitreBadge
                                        tactic={item.tactic}
                                        techniqueId={item.techniqueId}
                                        technique={item.technique}
                                    />
                                </div>
                            )}

                            <p className="mt-2 text-xs text-zinc-500">
                                Source: {item.sourceIdentity} · Target: {item.targetSystem}
                            </p>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}