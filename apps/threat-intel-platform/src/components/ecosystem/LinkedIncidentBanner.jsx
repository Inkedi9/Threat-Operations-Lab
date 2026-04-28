import { ArrowLeft, Link2, ShieldAlert } from 'lucide-react';

export default function LinkedIncidentBanner({ context }) {
    if (!context?.incident && !context?.ioc && !context?.ip) return null;

    const primaryIoc = context.ioc || context.domain || context.ip || 'Unknown IoC';

    return (
        <section className="panel-strong relative overflow-hidden rounded-[1.7rem] border border-gold/20 p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(221,183,106,0.16),transparent_28%)]" />

            <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-gold/10 text-gold-soft">
                        <ShieldAlert size={20} />
                    </div>

                    <div>
                        <div className="label-caps text-gold">Linked Threat Intelligence Correlation</div>
                        <h2 className="mt-2 text-xl font-black text-ivory">
                            {context.incident || 'External incident'} · {primaryIoc}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                            {context.incident && (
                                <span className="rounded-full border border-white/8 bg-black/30 px-3 py-1">
                                    Incident: {context.incident}
                                </span>
                            )}

                            {primaryIoc && (
                                <span className="rounded-full border border-white/8 bg-black/30 px-3 py-1">
                                    IoC: {primaryIoc}
                                </span>
                            )}

                            {context.ip && (
                                <span className="rounded-full border border-white/8 bg-black/30 px-3 py-1">
                                    IP: {context.ip}
                                </span>
                            )}

                            {context.technique && (
                                <span className="rounded-full border border-white/8 bg-black/30 px-3 py-1">
                                    Technique: {context.technique}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {context.returnTo && (
                    <a
                        href={context.returnTo}
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-soft transition hover:border-gold/35 hover:bg-gold/15"
                    >
                        <ArrowLeft size={16} />
                        Return to Purple Team Lab
                    </a>
                )}
            </div>
        </section>
    );
}