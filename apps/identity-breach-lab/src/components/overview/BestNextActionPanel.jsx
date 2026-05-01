import Panel from "../ui/Panel";
import { scenarioDefinitions } from "../../data/scenarios/index";
import { isScenarioRunnable } from "../../lib/scenarioChaining";

function getNextScenario(state) {
    const launched = state?.launchedScenarios || [];

    return scenarioDefinitions.find((scenario) =>
        isScenarioRunnable(scenario, launched)
    );
}

function buildRecommendation(scenario) {
    if (!scenario) {
        return {
            title: "No further actions",
            message: "All scenarios executed. Attack chain complete.",
        };
    }

    switch (scenario.id) {
        case "credential-theft":
            return {
                title: "Harvest credentials",
                message:
                    "Leverage compromised identities to extract reusable credentials.",
            };

        case "privilege-escalation":
            return {
                title: "Escalate privileges",
                message:
                    "Exploit current foothold to gain elevated access on target systems.",
            };

        case "lateral-movement":
            return {
                title: "Pivot laterally",
                message:
                    "Move across systems using active sessions and compromised access.",
            };

        case "admin-account-compromise":
            return {
                title: "Target privileged accounts",
                message:
                    "Abuse administrative identities to access critical infrastructure.",
            };

        case "persistence":
            return {
                title: "Establish persistence",
                message:
                    "Create rogue identities or backdoors to maintain long-term access.",
            };

        default:
            return {
                title: scenario.label,
                message: scenario.description || "Execute next attack phase.",
            };
    }
}

export default function BestNextActionPanel({ state }) {
    const nextScenario = getNextScenario(state);
    const recommendation = buildRecommendation(nextScenario);

    return (
        <Panel
            title="Best Next Action"
            subtitle="Recommended offensive move based on current campaign state."
        >
            <div className="rounded-2xl border border-danger/20 bg-danger/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                    Recommendation
                </p>

                <p className="mt-3 text-lg font-semibold text-red-200">
                    {recommendation.title}
                </p>

                <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {recommendation.message}
                </p>

                {nextScenario && (
                    <div className="mt-4 text-xs text-zinc-500">
                        Next scenario:{" "}
                        <span className="text-zinc-200 font-semibold">
                            {nextScenario.label}
                        </span>
                    </div>
                )}
            </div>
        </Panel>
    );
}