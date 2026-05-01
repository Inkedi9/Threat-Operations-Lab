import Panel from "../ui/Panel";
import MitreBadge from "../ui/MitreBadge";

function ProgressBar({ currentIndex, total }) {
    const safeTotal = Math.max(total, 1);
    const safeIndex = Math.max(currentIndex + 1, 0);
    const percent = Math.min(100, (safeIndex / safeTotal) * 100);

    return (
        <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span>Replay Progress</span>
                <span>
                    {safeIndex} / {total}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900/45">
                <div
                    className="h-full rounded-full bg-danger transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default function ReplayControlPanel({
    replay,
    onPlayPause,
    onNext,
    onPrevious,
    onReset,
    onSpeedChange,
}) {
    const steps = replay?.steps || [];
    const currentIndex = replay?.currentStepIndex ?? -1;
    const currentStep =
        currentIndex >= 0 && currentIndex < steps.length ? steps[currentIndex] : null;

    const speed = replay?.speed || 1;

    return (
        <Panel
            title="Replay Control"
            subtitle="Incident playback mode for scenario walkthrough and attack-chain review."
        >
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Scenario
                    </p>
                    <h4 className="mt-3 text-lg font-semibold text-ink">
                        {replay?.scenarioLabel || "No active scenario"}
                    </h4>
                    <p className="mt-2 text-sm text-zinc-400">
                        {steps.length
                            ? `${currentIndex + 1} / ${steps.length} replay steps loaded`
                            : "Launch a scenario to initialize replay mode."}
                    </p>

                    <ProgressBar currentIndex={currentIndex} total={steps.length} />

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onPlayPause}
                            disabled={!steps.length}
                            className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-red-200 transition hover:bg-danger/20 disabled:opacity-40"
                        >
                            {replay?.isPlaying ? "Pause" : "Play"}
                        </button>

                        <button
                            type="button"
                            onClick={onPrevious}
                            disabled={!steps.length}
                            className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            disabled={!steps.length}
                            className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10 disabled:opacity-40"
                        >
                            Next
                        </button>

                        <button
                            type="button"
                            onClick={onReset}
                            disabled={!steps.length}
                            className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10 disabled:opacity-40"
                        >
                            Reset Replay
                        </button>
                    </div>

                    <div className="mt-4">
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Playback Speed
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 4].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => onSpeedChange(value)}
                                    className={`rounded-xl border px-3 py-2 text-xs transition ${speed === value
                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                                        : "border-lineSoft bg-black/20 text-zinc-300 hover:border-amber-500/20 hover:bg-amber-500/10"
                                        }`}
                                >
                                    {value}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Current Step
                    </p>

                    {currentStep ? (
                        <>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-danger/20 bg-danger/10 px-2.5 py-1 text-xs text-red-200">
                                    {currentStep.timestamp}
                                </span>
                                <span className="rounded-full border border-lineSoft bg-zinc-900/45 px-2.5 py-1 text-xs text-zinc-300">
                                    {currentStep.technique}
                                </span>
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200">
                                    {currentStep.severity}
                                </span>

                                {replay?.isPlaying && (
                                    <span className="rounded-full border border-red-400/30 bg-red-500/12 px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-red-100">
                                        live replay
                                    </span>
                                )}
                            </div>
                            {currentStep?.techniqueId && currentStep?.tactic && (
                                <div className="mt-3">
                                    <MitreBadge
                                        tactic={currentStep.tactic}
                                        techniqueId={currentStep.techniqueId}
                                        technique={currentStep.technique}
                                    />
                                </div>
                            )}

                            <p className="mt-4 text-sm leading-6 text-zinc-300">
                                {currentStep.message}
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                        Source Identity
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-zinc-100">
                                        {currentStep.sourceIdentity}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                        Target System
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-zinc-100">
                                        {currentStep.targetSystem}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-zinc-400">
                            No replay step selected yet.
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    );
}