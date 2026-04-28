import { Link } from 'react-router-dom';
import { Activity, Bookmark, Radar, ShieldAlert } from 'lucide-react';

function RailCard({ icon: Icon, label, value, tone = 'default' }) {
  const toneClass =
    tone === 'danger'
      ? 'text-danger'
      : tone === 'gold'
        ? 'text-gold-soft'
        : 'text-ivory';

  return (
    <article className="rounded-[1.35rem] border border-white/6 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/8 bg-black/30 text-gold-soft">
          <Icon size={16} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
          <div className={`mt-1 text-lg font-black ${toneClass}`}>{value}</div>
        </div>
      </div>
    </article>
  );
}

export default function RightRail({ result, onQuickSelect, watchlist = [], savedLookups = [] }) {
  const threatScore = result?.threatScore ?? '—';
  const severity = result?.severity ?? 'Waiting';
  const sourceCount = result?.sources?.length ?? 0;
  const actorCount = result?.actors?.length ?? 0;
  const campaignCount = result?.campaigns?.length ?? 0;

  return (
    <aside className="space-y-5">
      <section className="panel rounded-[1.9rem] p-5">
        <div className="label-caps text-gold">Executive snapshot</div>

        {result ? (
          <>
            <div className="mt-4 grid gap-3">
              <RailCard icon={ShieldAlert} label="Threat score" value={threatScore} tone="danger" />
              <RailCard icon={Radar} label="Severity" value={severity} tone="gold" />
              <RailCard icon={Activity} label="Sources" value={sourceCount} />
              <RailCard icon={Bookmark} label="Campaigns / Actors" value={`${campaignCount} / ${actorCount}`} />
            </div>

            <div className="mt-5 rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Current lookup</div>
              <div className="mt-2 text-sm font-semibold text-ivory break-all">
                {result.title || result.query}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                {result.type || 'indicator'}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full border border-white/6 bg-black/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold/40 via-gold to-amber"
                  style={{ width: `${Math.min(100, Number(result.threatScore) || 0)}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
            <div className="text-sm font-semibold text-ivory">No active lookup yet</div>
            <p className="mt-2 text-sm leading-7 text-muted">
              Run a query from the top search bar to populate executive metrics, threat score and quick pivots.
            </p>
          </div>
        )}
      </section>

      <section className="panel premium-hover rounded-[1.9rem] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="label-caps text-gold">Watchlist</div>
            <div className="mt-1 text-sm text-muted">Tracked indicators</div>
          </div>
          <Link to="/workbench" className="text-xs uppercase tracking-[0.18em] text-gold-soft">
            Workbench
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {watchlist.length ? (
            watchlist.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onQuickSelect?.(item.query)}
                className="premium-hover rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4 text-left transition hover:border-gold/18"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-ivory">{item.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{item.type}</div>
                  </div>
                  <div className="text-sm font-black text-gold-soft">{item.threatScore}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[1.1rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
              No watchlist entries yet.
            </div>
          )}
        </div>
      </section>

      <section className="panel premium-hover rounded-[1.9rem] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="label-caps text-gold">Saved lookups</div>
            <div className="mt-1 text-sm text-muted">Recent analyst state</div>
          </div>
          <Link to="/workbench" className="text-xs uppercase tracking-[0.18em] text-gold-soft">
            Open
          </Link>
        </div>

        <div className="mt-4 grid gap-3">
          {savedLookups.length ? (
            savedLookups.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onQuickSelect?.(item.query)}
                className="premium-hover rounded-[1.1rem] border border-white/6 bg-white/[0.03] p-4 text-left transition hover:border-gold/18"
              >
                <div className="text-sm font-semibold text-ivory">{item.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                  {item.type} · {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'saved'}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[1.1rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
              No saved lookups yet.
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}