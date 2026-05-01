import { ArrowUpRight, ShieldAlert } from "lucide-react";

export default function LinkedIncidentBanner({ params, incidentProfile }) {
    if (!params?.incident && !params?.user && !params?.ip) return null;

    const user = incidentProfile?.user || params.user;
    const ip = incidentProfile?.suspiciousIp || params.ip;

    return (
        <section className="rounded-2xl border border-danger/20 bg-danger/10 p-4 shadow-dangerSoft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-danger/20 bg-danger/10 p-3 text-red-200">
                        <ShieldAlert size={20} />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-danger">
                            Linked Identity Investigation
                        </p>

                        <h3 className="mt-2 text-lg font-semibold text-ink">
                            {params.incident || "External Identity Context"}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {user && (
                                <span className="rounded-full border border-danger/20 bg-black/20 px-3 py-1 text-xs text-red-200">
                                    Compromised user: {user}
                                </span>
                            )}

                            {ip && (
                                <span className="rounded-full border border-lineSoft bg-black/20 px-3 py-1 text-xs text-zinc-300">
                                    Source IP: {ip}
                                </span>
                            )}

                            {params.technique && (
                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                                    Technique: {params.technique}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {params.returnTo && (
                    <a
                        href={params.returnTo}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-danger/20"
                    >
                        Return to Purple Team Lab
                        <ArrowUpRight size={16} />
                    </a>
                )}
            </div>
        </section>
    );
}