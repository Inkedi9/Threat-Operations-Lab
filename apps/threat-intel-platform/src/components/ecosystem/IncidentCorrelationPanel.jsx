import { linkedIncidentMocks } from '../../data/intelData';
import TagChip from '../ui/TagChip';

export default function IncidentCorrelationPanel({ context }) {
    const incident = context?.incident ? linkedIncidentMocks[context.incident] : null;

    if (!incident) return null;

    return (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
            <div className="panel rounded-[1.9rem] p-6">
                <div className="label-caps text-gold">Correlation Summary</div>
                <h2 className="mt-2 text-2xl font-black text-ivory">{incident.campaign}</h2>

                <div className="mt-4 grid gap-4">
                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Infrastructure overlap
                        </div>
                        <p className="mt-2 text-sm leading-7 text-muted">
                            {incident.summary.infrastructureOverlap}
                        </p>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Related indicators
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {incident.summary.relatedIndicators.map((ioc) => (
                                <TagChip key={ioc}>{ioc}</TagChip>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Recommended analyst action
                        </div>
                        <p className="mt-2 text-sm leading-7 text-muted">
                            {incident.summary.recommendedAction}
                        </p>
                    </div>
                </div>
            </div>

            <div className="panel rounded-[1.9rem] p-6">
                <div className="label-caps text-gold">Purple Team Context</div>
                <h2 className="mt-2 text-2xl font-black text-ivory">
                    {incident.purpleTeamContext.linkedIncident}
                </h2>

                <div className="mt-4 space-y-4">
                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Source module
                        </div>
                        <div className="mt-2 text-sm font-semibold text-ivory">
                            {incident.purpleTeamContext.sourceModule}
                        </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Investigation flow
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {incident.purpleTeamContext.investigationFlow.map((step) => (
                                <TagChip key={step}>{step}</TagChip>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                            Related MITRE
                        </div>
                        <div className="mt-3 grid gap-2">
                            {incident.mitre.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2"
                                >
                                    <div className="text-sm font-semibold text-ivory">
                                        {item.id} · {item.name}
                                    </div>
                                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                                        {item.tactic}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {incident.tags.map((tag) => (
                            <TagChip key={tag}>{tag}</TagChip>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}