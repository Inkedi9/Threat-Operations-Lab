import { SearchX } from 'lucide-react';

export default function EmptyState({
    eyebrow = 'No data',
    title = 'Nothing mapped here yet',
    description = 'Run a lookup to populate this intelligence surface.',
}) {
    return (
        <section className="panel rounded-[1.9rem] p-6">
            <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">
                    <SearchX size={20} />
                </div>
                <div>
                    <div className="label-caps text-gold">{eyebrow}</div>
                    <h2 className="mt-2 text-2xl font-black text-ivory">{title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
                </div>
            </div>
        </section>
    );
}