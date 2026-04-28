import { Link, useOutletContext } from 'react-router-dom';
import { actors } from '../data/intelData';
import TagChip from '../components/ui/TagChip';

export default function ActorsPage() {
  const { handleLookup } = useOutletContext();

  return (
    <div className="space-y-5">
      <section className="panel rounded-[1.9rem] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="label-caps text-gold">Attribution Layer</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-ivory">Threat Actor Profiles</h2>
          </div>
          <div className="text-sm text-muted">Dedicated actor detail pages introduced in phase 3</div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {actors.map((actor) => (
            <article key={actor.id} className="premium-hover rounded-[1.5rem] border border-white/6 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl font-bold text-ivory">{actor.name}</div>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                  {actor.sophistication}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{actor.summary}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/6 bg-black/25 p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted">Aliases</div>
                  <div className="mt-2 text-sm text-ivory">{actor.aliases.join(' · ')}</div>
                </div>
                <div className="rounded-2xl border border-white/6 bg-black/25 p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted">Confidence</div>
                  <div className="mt-2 text-sm text-ivory">{actor.confidence}%</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {actor.ttps.map((ttp) => <TagChip key={ttp}>{ttp}</TagChip>)}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleLookup(actor.name.toLowerCase())}
                  className="rounded-2xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-soft transition hover:border-gold/28 hover:bg-gold/14"
                >
                  Open in lookup
                </button>
                <Link
                  to={`/actors/${actor.id}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-ivory transition hover:border-gold/20"
                >
                  Open detail page
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
