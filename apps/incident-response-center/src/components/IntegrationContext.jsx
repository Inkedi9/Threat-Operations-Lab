import { Boxes, ExternalLink, RadioTower } from "lucide-react";

export default function IntegrationContext({ context }) {
    const sourceLabel = context.source || "purple-team-lab";

    const sourceMap = {
        soc: "SOC Simulator",
        tip: "Threat Intelligence Platform",
        osint: "OSINT Investigator",
        identity: "Identity & Access Attack Simulator",
        "purple-team-lab": "Purple Team Lab",
    };

    const focus = context.user || context.ip || context.asset || "Full incident response";

    return (
        <section className="glass-panel rounded-[2rem] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                        <Boxes size={22} />
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                            Ecosystem Link
                        </p>

                        <h2 className="mt-1 text-xl font-black text-command-text">
                            Connected incident response module
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-command-muted">
                            Opened from{" "}
                            <span className="font-bold text-amber-300">
                                {sourceMap[sourceLabel] || sourceLabel}
                            </span>{" "}
                            with focus on{" "}
                            <span className="font-mono font-bold text-command-text">
                                {focus}
                            </span>
                            .
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[460px]">
                    <Mini icon={RadioTower} label="Source" value={sourceMap[sourceLabel] || sourceLabel} />
                    <Mini label="Mode" value="Frontend V1" />
                    <Mini icon={ExternalLink} label="Query Ready" value="Enabled" />
                </div>
            </div>
        </section>
    );
}

function Mini({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/35 p-3">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={14} className="text-amber-300" />}
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                    {label}
                </p>
            </div>

            <p className="mt-1 truncate text-sm font-black text-command-text">
                {value}
            </p>
        </div>
    );
}