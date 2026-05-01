import Panel from "../ui/Panel";

function RecommendationCard({ eyebrow, title, description, tone = "default" }) {
    const tones = {
        default: "border-line/80 bg-black/20",
        red: "border-danger/10 bg-danger/[0.07] shadow-[0_0_18px_rgba(239,68,68,0.04)]",
        amber: "border-amber-500/10 bg-amber-500/[0.07]",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                {eyebrow}
            </p>
            <h4 className="mt-2 text-base font-semibold text-ink">{title}</h4>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{description}</p>
        </div>
    );
}

function buildOffensiveRecommendations(state) {
    const users = state.users || [];
    const systems = state.systems || [];
    const launchedScenarios = state.launchedScenarios || [];

    const compromisedUsers = users.filter((user) =>
        ["compromised", "privileged-compromised"].includes(user.status)
    );

    const privilegedUsers = users.filter((user) =>
        ["elevated", "privileged"].includes(user.privilege)
    );

    const impactedCriticalSystems = systems.filter(
        (system) =>
            system.criticality === "critical" && system.status === "impacted"
    );

    const highestRiskIdentity =
        [...users].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0] || null;

    const bestNextPivot =
        privilegedUsers
            .filter((user) => !compromisedUsers.some((entry) => entry.id === user.id))
            .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0] || null;

    const crownJewelOpportunity =
        systems.find(
            (system) =>
                system.criticality === "critical" && system.status !== "impacted"
        ) || null;

    let suggestedNextMove = "Expand credential access to unlock privilege escalation opportunities.";

    if (
        launchedScenarios.includes("password-spray") &&
        launchedScenarios.includes("credential-theft") &&
        !launchedScenarios.includes("privilege-escalation")
    ) {
        suggestedNextMove =
            "Leverage the current foothold to escalate privileges and gain admin-equivalent reach.";
    } else if (
        launchedScenarios.includes("privilege-escalation") &&
        !launchedScenarios.includes("lateral-movement")
    ) {
        suggestedNextMove =
            "Pivot from the elevated workstation into shared infrastructure to widen the attack surface.";
    } else if (
        launchedScenarios.includes("lateral-movement") &&
        !launchedScenarios.includes("admin-account-compromise")
    ) {
        suggestedNextMove =
            "Target privileged identities or admin paths that lead directly to crown jewels.";
    } else if (
        launchedScenarios.includes("admin-account-compromise") &&
        !launchedScenarios.includes("persistence")
    ) {
        suggestedNextMove =
            "Establish durable unauthorized presence before the identity path is disrupted.";
    } else if (launchedScenarios.includes("persistence")) {
        suggestedNextMove =
            "Consolidate access and preserve multi-hop identity control across the compromised estate.";
    }

    return {
        bestNextPivot,
        highestRiskIdentity,
        crownJewelOpportunity,
        impactedCriticalSystems,
        suggestedNextMove,
    };
}

export default function OffensiveRecommendationsPanel({ state }) {
    const recommendations = buildOffensiveRecommendations(state);

    return (
        <Panel
            title="Offensive Recommendations"
            subtitle="Operator-oriented guidance for identity abuse, privilege pathing and crown jewel pursuit."
        >
            <div className="grid gap-4 2xl:grid-cols-2">
                <RecommendationCard
                    eyebrow="Best Next Pivot"
                    title={
                        recommendations.bestNextPivot
                            ? recommendations.bestNextPivot.username
                            : "No pivot identified yet"
                    }
                    description={
                        recommendations.bestNextPivot
                            ? `${recommendations.bestNextPivot.name} holds ${recommendations.bestNextPivot.privilege} access and may provide a stronger identity pivot into privileged routes.`
                            : "No additional privileged pivot is currently more valuable than the active compromised footholds."
                    }
                    tone="red"
                />

                <RecommendationCard
                    eyebrow="Highest Value Identity"
                    title={
                        recommendations.highestRiskIdentity
                            ? recommendations.highestRiskIdentity.username
                            : "No identity available"
                    }
                    description={
                        recommendations.highestRiskIdentity
                            ? `${recommendations.highestRiskIdentity.name} currently represents the highest offensive value with a risk score of ${recommendations.highestRiskIdentity.riskScore}/100.`
                            : "No identity data available."
                    }
                    tone="amber"
                />

                <RecommendationCard
                    eyebrow="Best Crown Jewel Opportunity"
                    title={
                        recommendations.crownJewelOpportunity
                            ? recommendations.crownJewelOpportunity.name
                            : "No remaining crown jewel target"
                    }
                    description={
                        recommendations.crownJewelOpportunity
                            ? `${recommendations.crownJewelOpportunity.name} remains a critical target and has not yet been directly impacted by the campaign.`
                            : recommendations.impactedCriticalSystems.length
                                ? "Critical systems have already been reached during the current simulated campaign."
                                : "No critical opportunity is currently exposed."
                    }
                    tone="red"
                />

                <RecommendationCard
                    eyebrow="Suggested Next Move"
                    title="Campaign Guidance"
                    description={recommendations.suggestedNextMove}
                    tone="default"
                />
            </div>
        </Panel>
    );
}
