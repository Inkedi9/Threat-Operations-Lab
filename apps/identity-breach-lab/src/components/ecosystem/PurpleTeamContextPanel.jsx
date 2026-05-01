import Panel from "../ui/Panel";
import MitreBadge from "../ui/MitreBadge";

export default function PurpleTeamContextPanel({ incidentProfile }) {
    if (!incidentProfile) return null;

    return (
        <Panel
            title="Purple Team Context"
            subtitle="External incident context imported from Purple Team Lab."
        >
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Linked Identity
                    </p>

                    <h4 className="mt-3 text-lg font-semibold text-ink">
                        {incidentProfile.user}
                    </h4>

                    <p className="mt-1 text-sm text-zinc-400">
                        {incidentProfile.email}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-lineSoft/60 bg-black/20 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Role
                            </p>
                            <p className="mt-2 text-sm text-zinc-200">
                                {incidentProfile.role}
                            </p>
                        </div>

                        <div className="rounded-xl border border-danger/10 bg-danger/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Status
                            </p>
                            <p className="mt-2 text-sm text-red-200">
                                {incidentProfile.status}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                        Suspicious source IP:{" "}
                        <span className="font-semibold text-red-200">
                            {incidentProfile.suspiciousIp}
                        </span>
                    </p>
                </div>

                <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        Identity Attack Path
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {incidentProfile.attackPath.map((step) => (
                            <span
                                key={step}
                                className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-xs text-red-100"
                            >
                                {step}
                            </span>
                        ))}
                    </div>

                    <div className="mt-5 space-y-3">
                        {incidentProfile.mitre.map((entry) => (
                            <MitreBadge
                                key={entry.techniqueId}
                                tactic={entry.tactic}
                                techniqueId={entry.techniqueId}
                                technique={entry.technique}
                            />
                        ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300">
                            Recommendation
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                            {incidentProfile.recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </Panel>
    );
}