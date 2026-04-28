export default function LoadingIntel({ label = 'Running multi-source enrichment…' }) {
    return (
        <section className="panel relative overflow-hidden rounded-[1.4rem] p-5">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(221,183,106,0.12),transparent)] animate-[pulse_1.6s_ease-in-out_infinite]" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="label-caps text-gold">Enrichment pipeline</div>
                    <div className="mt-2 text-sm text-muted">{label}</div>
                </div>

                <div className="h-2 w-full max-w-sm overflow-hidden rounded-full border border-white/6 bg-black/50">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-gold/30 via-gold-soft to-amber" />
                </div>
            </div>
        </section>
    );
}