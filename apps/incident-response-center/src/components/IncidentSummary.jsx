export default function IncidentSummary({ incident, context }) {
    return (
        <section className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                Incident Summary
            </p>

            <h2 className="mt-2 text-2xl font-black text-command-text">
                {incident.name}
            </h2>

            <p className="mt-4 text-command-muted">{incident.businessImpact}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Info label="Entry Point" value={incident.entryPoint} />
                <Info label="Current Phase" value={incident.currentPhase} />
                <Info label="Source Module" value={context.source || "Purple Team Lab"} />
                <Info label="Focused Entity" value={context.user || context.ip || context.asset || "Full incident"} />
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-bold text-command-text">Attack Path</p>
                <div className="flex flex-wrap gap-2">
                    {incident.attackPath.map((step) => (
                        <span
                            key={step}
                            className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm text-orange-200"
                        >
                            {step}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-bold text-command-text">
                    MITRE ATT&CK Techniques
                </p>
                <div className="flex flex-wrap gap-2">
                    {incident.mitre.map((technique) => (
                        <span
                            key={technique}
                            className="rounded-lg border border-amber-500/20 bg-black/30 px-3 py-1 font-mono text-sm text-amber-300"
                        >
                            {technique}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-wide text-command-muted">
                {label}
            </p>
            <p className="mt-2 font-bold text-command-text">{value}</p>
        </div>
    );
}