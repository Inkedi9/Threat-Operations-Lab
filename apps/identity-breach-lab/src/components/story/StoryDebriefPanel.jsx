import Panel from "../ui/Panel";

function getCompromisedUsers(state) {
    return state.users.filter((user) =>
        ["compromised", "privileged-compromised"].includes(user.status)
    );
}

function getCriticalSystemsReached(state) {
    return state.systems.filter(
        (system) =>
            system.criticality === "critical" && system.status === "impacted"
    );
}

function getMitreTechniques(steps = []) {
    const techniques = steps
        .map((step) => step.techniqueId)
        .filter(Boolean);

    return [...new Set(techniques)];
}

function getLatestRisk(state) {
    return state.riskHistory?.[state.riskHistory.length - 1]?.risk ?? 0;
}

export default function StoryDebriefPanel({ state }) {
    const replay = state.replay;
    const steps = replay?.steps || [];
    const compromisedUsers = getCompromisedUsers(state);
    const criticalSystems = getCriticalSystemsReached(state);
    const mitreTechniques = getMitreTechniques(steps);
    const latestRisk = getLatestRisk(state);

    const hasStory = replay?.isActive && steps.length > 0;

    if (!hasStory) {
        return null;
    }

    return (
        <Panel
            title="Story Debrief"
            subtitle="Post-replay summary of the simulated identity attack chain."
        >
            <div className="grid gap-4 xl:grid-cols-4">
                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Scenario
                    </p>
                    <p className="mt-3 text-sm font-semibold text-red-200">
                        {replay.scenarioLabel}
                    </p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Steps
                    </p>
                    <p className="mt-3 text-xl font-bold text-zinc-100">
                        {steps.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        MITRE Techniques
                    </p>
                    <p className="mt-3 text-xl font-bold text-amber-200">
                        {mitreTechniques.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        Final Risk
                    </p>
                    <p className="mt-3 text-xl font-bold text-red-200">
                        {latestRisk}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-5 2xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-2xl border border-danger/10 bg-black/25 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Kill Chain Summary
                    </p>

                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                        The active story shows how identity access can be chained across
                        compromised accounts, privileged pivots and enterprise systems to
                        increase attack pressure.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Compromised Identities
                            </p>
                            <p className="mt-2 text-lg font-bold text-red-200">
                                {compromisedUsers.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Crown Jewels Impacted
                            </p>
                            <p className="mt-2 text-lg font-bold text-amber-200">
                                {criticalSystems.length}
                            </p>
                        </div>
                    </div>

                    {mitreTechniques.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {mitreTechniques.map((techniqueId) => (
                                <span
                                    key={techniqueId}
                                    className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-xs text-red-200"
                                >
                                    {techniqueId}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-danger/10 bg-danger/10 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Defensive Breakpoints
                    </p>

                    <div className="mt-4 space-y-3">
                        {[
                            "Revoke compromised sessions and force credential rotation.",
                            "Review privileged group memberships created or abused during the chain.",
                            "Isolate impacted crown jewel systems from compromised identities.",
                            "Reduce standing access and enforce conditional access for risky pivots.",
                        ].map((item, index) => (
                            <div
                                key={item}
                                className="rounded-xl border border-line/70 bg-black/25 p-3"
                            >
                                <p className="text-sm leading-6 text-zinc-300">
                                    <span className="mr-2 font-semibold text-red-200">
                                        {index + 1}.
                                    </span>
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Panel>
    );
}