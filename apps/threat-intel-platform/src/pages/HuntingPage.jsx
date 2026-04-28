import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Crosshair, Search, Radar, ShieldAlert } from 'lucide-react';
import { buildHuntingProfile } from '../lib/hunting';
import TagChip from '../components/ui/TagChip';
import MitrePanel from '../components/intel/MitrePanel';

function PriorityBadge({ value }) {
    const cls =
        value === 'high'
            ? 'border-danger/20 bg-danger/10 text-danger'
            : value === 'medium'
                ? 'border-amber/20 bg-amber/10 text-amber'
                : 'border-success/20 bg-success/10 text-success';

    return (
        <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${cls}`}>
            {value}
        </span>
    );
}

export default function HuntingPage() {
    const { result, handleLookup } = useOutletContext();
    const hunting = useMemo(() => buildHuntingProfile(result), [result]);

    if (!result) {
        return (
            <section className="panel rounded-[1.9rem] p-6">
                <div className="label-caps text-gold">Threat hunting mode</div>
                <h2 className="mt-3 text-2xl font-black text-ivory">No active lookup loaded</h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                    Start from an indicator lookup to generate hypotheses, observables, hunting prompts and ATT&CK seeds.
                </p>
            </section>
        );
    }

    return (
        <div className="space-y-5">
            <section className="panel-strong rounded-[2rem] p-6">
                <div className="label-caps text-gold">Threat hunting mode</div>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-ivory">
                    Investigative <span className="text-gradient-gold">hunt surface</span>
                </h2>
                <p className="mt-4 max-w-4xl text-sm leading-8 text-muted">
                    This mode reframes the current lookup as a hunting package: hypotheses, observables, ATT&CK-aligned
                    clues and analyst prompts ready for pivoting.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    <TagChip>{result.type}</TagChip>
                    <TagChip>Threat score {result.threatScore}</TagChip>
                    {(result.tags || []).slice(0, 5).map((tag) => (
                        <TagChip key={tag}>{tag}</TagChip>
                    ))}
                </div>
            </section>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Hypotheses</div>
                    <div className="mt-2 text-2xl font-black text-gold-soft">{hunting.hypotheses.length}</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Observables</div>
                    <div className="mt-2 text-2xl font-black text-gold-soft">{hunting.observables.length}</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted">ATT&CK seeds</div>
                    <div className="mt-2 text-2xl font-black text-gold-soft">{hunting.mitre.length}</div>
                </div>
            </div>

            <section className="grid gap-5 xl:grid-cols-2">
                <section className="panel rounded-[1.9rem] p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Crosshair className="text-gold-soft" size={18} />
                        <div>
                            <div className="label-caps text-gold">Hunting hypotheses</div>
                            <h3 className="mt-2 text-2xl font-black text-ivory">Priority assumptions</h3>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {hunting.hypotheses.map((item) => (
                            <article key={item.id} className="premium-hover rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="text-sm font-semibold text-ivory">{item.title}</div>
                                    <PriorityBadge value={item.priority} />
                                </div>
                                <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="panel rounded-[1.9rem] p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Radar className="text-gold-soft" size={18} />
                        <div>
                            <div className="label-caps text-gold">Priority observables</div>
                            <h3 className="mt-2 text-2xl font-black text-ivory">Pivot package</h3>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {hunting.observables.map((item) => (
                            <button
                                key={`${item.type}-${item.value}`}
                                type="button"
                                onClick={() => handleLookup(item.value)}
                                className="premium-hover rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-left transition hover:border-gold/18"
                            >
                                <div className="text-sm font-semibold text-ivory break-all">{item.value}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                                    {item.label} · {item.type}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
                <section className="panel rounded-[1.9rem] p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Search className="text-gold-soft" size={18} />
                        <div>
                            <div className="label-caps text-gold">Suggested hunts</div>
                            <h3 className="mt-2 text-2xl font-black text-ivory">Analyst prompts</h3>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {hunting.hunts.map((item) => (
                            <article key={item.id} className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                                <div className="text-sm font-semibold text-ivory">{item.title}</div>
                                <p className="mt-3 text-sm leading-7 text-muted">{item.query}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="panel rounded-[1.9rem] p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <ShieldAlert className="text-gold-soft" size={18} />
                    </div>

                    <MitrePanel techniques={hunting.mitre} />

                    <div className="grid gap-3">
                        {hunting.mitre.length ? (
                            hunting.mitre.map((item) => (
                                <article key={`${item.id}-${item.tactic}`} className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-ivory">
                                                {item.id} · {item.technique}
                                            </div>
                                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                                                {item.tactic}
                                            </div>
                                        </div>
                                        <PriorityBadge value={item.confidence === 'high' ? 'high' : 'medium'} />
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
                                No ATT&CK seeds inferred from the current result.
                            </div>
                        )}
                    </div>
                </section>
            </section>
        </div>
    );
}