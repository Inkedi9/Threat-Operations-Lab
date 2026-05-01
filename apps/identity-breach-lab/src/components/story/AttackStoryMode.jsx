import Panel from "../ui/Panel";

function getStepState(index, currentIndex) {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "active";
    return "pending";
}

function stepTone(state) {
    switch (state) {
        case "completed":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
        case "active":
            return "border-danger/30 bg-danger/10 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.10)]";
        default:
            return "border-line/70 bg-black/25 text-zinc-400";
    }
}

function buildNarrative(step, index) {
    const technique = step.technique || step.label || `Step ${index + 1}`;
    const source = step.sourceIdentity || "attacker-controlled identity";
    const target = step.targetSystem || "target asset";

    return {
        title: technique,
        body: `${source} is used to advance the attack path toward ${target}.`,
    };
}

export default function AttackStoryMode({
    replay,
    currentReplayStep,
    onPlayPause,
    onNext,
    onPrevious,
    onReset,
}) {
    const steps = replay?.steps || [];
    const currentIndex = replay?.currentStepIndex ?? -1;
    const hasStory = replay?.isActive && steps.length > 0;
    const progress = steps.length
        ? Math.round(((currentIndex + 1) / steps.length) * 100)
        : 0;

    if (!hasStory) {
        return (
            <Panel
                title="Attack Story Mode"
                subtitle="Run a scenario first to generate a narrated attack sequence."
            >
                <div className="rounded-2xl border border-line/70 bg-black/25 p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        No active story
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                        Launch a scenario from the Scenario Control page, then return here
                        to review the attacker journey step by step.
                    </p>
                </div>
            </Panel>
        );
    }

    return (
        <Panel
            title="Attack Story Mode"
            subtitle="Narrated replay of the active identity-centric attack chain."
        >
            <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-danger/20 bg-danger/10 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Current Chapter
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-ink">
                        {currentReplayStep?.technique || replay.scenarioLabel}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                        {currentReplayStep
                            ? `${currentReplayStep.sourceIdentity} is moving toward ${currentReplayStep.targetSystem}.`
                            : "Replay is armed and ready."}
                    </p>

                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            <span>Story Progress</span>
                            <span>
                                {currentIndex + 1}/{steps.length}
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-black/60">
                            <div
                                className="h-full rounded-full bg-danger shadow-[0_0_12px_rgba(239,68,68,0.65)] transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onPrevious}
                            className="rounded-xl border border-line/70 bg-black/30 px-4 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={onPlayPause}
                            className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-danger/20"
                        >
                            {replay.isPlaying ? "Pause Story" : "Play Story"}
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            className="rounded-xl border border-line/70 bg-black/30 px-4 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
                        >
                            Next
                        </button>

                        <button
                            type="button"
                            onClick={onReset}
                            className="rounded-xl border border-line/70 bg-black/30 px-4 py-2 text-sm text-zinc-400 transition hover:border-danger/20 hover:bg-danger/10"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const state = getStepState(index, currentIndex);
                        const narrative = buildNarrative(step, index);

                        return (
                            <div
                                key={`${step.techniqueId || step.technique}-${index}`}
                                className={`rounded-2xl border p-4 transition ${stepTone(state)}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">
                                            Chapter {index + 1}
                                        </p>

                                        <h4 className="mt-2 text-sm font-semibold text-zinc-100">
                                            {narrative.title}
                                        </h4>

                                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                                            {narrative.body}
                                        </p>
                                    </div>

                                    {state === "active" && (
                                        <span className="mt-1 h-2 w-2 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[pulse_1.8s_ease-in-out_infinite]" />
                                    )}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {step.techniqueId && (
                                        <span className="rounded-full border border-danger/20 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-red-200">
                                            {step.techniqueId}
                                        </span>
                                    )}

                                    {step.tactic && (
                                        <span className="rounded-full border border-line/70 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                                            {step.tactic}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Panel>
    );
}