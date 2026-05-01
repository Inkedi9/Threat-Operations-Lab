import Panel from "../ui/Panel";
import { scenarioDefinitions } from "../../data/scenarios/index.js";

export default function MitreCoveragePanel({ launchedScenarios = [] }) {
    const executedScenarios = scenarioDefinitions.filter((scenario) =>
        launchedScenarios.includes(scenario.id)
    );

    const techniques = executedScenarios
        .map((scenario) => scenario.mitre)
        .filter(Boolean);

    const uniqueTechniques = Array.from(
        new Map(
            techniques.map((entry) => [entry.techniqueId, entry])
        ).values()
    );

    return (
        <Panel
            title="MITRE Coverage"
            subtitle="Executed offensive scenarios mapped to ATT&CK tactics and techniques."
        >
            {uniqueTechniques.length ? (
                <div className="grid gap-4 xl:grid-cols-2">
                    {uniqueTechniques.map((entry) => (
                        <div
                            key={entry.techniqueId}
                            className="rounded-2xl border border-line/80 bg-black/20 p-4"
                        >
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                {entry.tactic}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold text-ink">
                                {entry.techniqueId}
                            </h4>
                            <p className="mt-2 text-sm text-zinc-300">{entry.technique}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-400">
                    Launch scenarios to build ATT&CK technique coverage.
                </p>
            )}
        </Panel>
    );
}