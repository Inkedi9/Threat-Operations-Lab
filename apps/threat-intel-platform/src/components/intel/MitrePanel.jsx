import { ShieldAlert } from 'lucide-react';

function TechniqueCard({ technique }) {
    return (
        <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-sm font-semibold text-ivory">
                        {technique.id} · {technique.name}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                        {technique.tactic}
                    </div>
                </div>

                <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-1 text-[10px] text-gold-soft">
                    {technique.confidence}
                </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted">
                {technique.description}
            </p>
        </div>
    );
}

export default function MitrePanel({ techniques = [] }) {
    if (!techniques.length) return null;

    return (
        <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-5 flex items-center gap-3">
                <ShieldAlert className="text-gold-soft" size={18} />
                <div>
                    <div className="label-caps text-gold">MITRE ATT&CK Mapping</div>
                    <h3 className="mt-1 text-2xl font-black text-ivory">
                        Techniques inferred from intelligence
                    </h3>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {techniques.map((tech) => (
                    <TechniqueCard key={tech.id} technique={tech} />
                ))}
            </div>
        </section>
    );
}