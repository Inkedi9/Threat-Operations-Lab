import Panel from "../ui/Panel";

function getCompromisedUsers(state) {
    return state.users.filter((user) =>
        ["compromised", "privileged-compromised"].includes(user.status)
    );
}

function getCriticalSystems(state) {
    return state.systems.filter(
        (system) =>
            system.criticality === "critical" && system.status === "impacted"
    );
}

export default function AttackExplanationLayer({ state }) {
    const compromisedUsers = getCompromisedUsers(state);
    const criticalSystems = getCriticalSystems(state);
    const latestRisk = state.riskHistory?.[state.riskHistory.length - 1]?.risk ?? 0;
    const latestScenario = state.replay?.scenarioLabel || "Baseline";

    return (
        <Panel
            title="Attack Explanation Layer"
            subtitle="Why the current identity attack path matters from an operator perspective."
        >
            <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Primary Reasoning
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                        The current campaign is driven by identity exposure. Compromised
                        accounts create reusable access paths that can be chained into
                        privileged systems and crown-jewel assets.
                    </p>
                </div>

                <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Current Pressure
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-zinc-300">
                        <p>
                            Scenario:{" "}
                            <span className="font-semibold text-red-200">
                                {latestScenario}
                            </span>
                        </p>
                        <p>
                            Compromised identities:{" "}
                            <span className="font-semibold text-red-200">
                                {compromisedUsers.length}
                            </span>
                        </p>
                        <p>
                            Critical assets impacted:{" "}
                            <span className="font-semibold text-amber-200">
                                {criticalSystems.length}
                            </span>
                        </p>
                        <p>
                            Risk score:{" "}
                            <span className="font-semibold text-zinc-100">
                                {latestRisk}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-danger/10 bg-danger/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Operator Interpretation
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                        Priority should be placed on breaking the chain at identity
                        pivots: revoke compromised sessions, isolate privileged accounts,
                        and reduce standing access to critical systems.
                    </p>
                </div>
            </div>
        </Panel>
    );
}