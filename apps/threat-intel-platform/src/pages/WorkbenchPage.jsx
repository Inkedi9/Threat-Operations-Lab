import { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Pin, PinOff, Play, Trash2, NotebookPen } from 'lucide-react';
import { buildHuntingProfile } from '../lib/hunting';
import TagChip from '../components/ui/TagChip';

export default function WorkbenchPage() {
  const {
    result,
    savedLookups,
    watchlist,
    analystNotes,
    setAnalystNotes,
    handleLookup,
  } = useOutletContext();

  const pinned = savedLookups.filter((item) => item.pinned);
  const recent = savedLookups.filter((item) => !item.pinned);

  const hunting = useMemo(() => buildHuntingProfile(result), [result]);

  const updateNote = (value) => {
    if (!result?.id) return;
    setAnalystNotes((current) => ({
      ...current,
      [result.id]: value,
    }));
  };

  const currentNote = result?.id ? analystNotes?.[result.id] || '' : '';

  const togglePin = (id) => {
    setAnalystNotes((current) => current);
    const raw = window.localStorage.getItem('tip.saved-lookups');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const next = parsed.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item,
    );
    window.localStorage.setItem('tip.saved-lookups', JSON.stringify(next));
    window.location.reload();
  };

  const removeSaved = (id) => {
    const raw = window.localStorage.getItem('tip.saved-lookups');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const next = parsed.filter((item) => item.id !== id);
    window.localStorage.setItem('tip.saved-lookups', JSON.stringify(next));
    window.location.reload();
  };

  return (
    <div className="space-y-5">
      <section className="panel-strong rounded-[2rem] p-6">
        <div className="label-caps text-gold">Analyst workbench</div>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-ivory">
          Analyst memory <span className="text-gradient-gold">and pivot workspace</span>
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-muted">
          Persist lookup history, triage notes, pinned investigations and watchlist entries. This page gives the CTI platform a realistic analyst memory layer without requiring a backend.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Saved lookups', savedLookups.length, 'Persisted local investigations'],
          ['Pinned', pinned.length, 'High-priority analyst items'],
          ['Watchlist', watchlist.length, 'Tracked IoCs'],
          ['Notes', Object.keys(analystNotes || {}).length, 'Local analyst annotations'],
        ].map(([label, value, hint]) => (
          <article key={label} className="panel premium-hover rounded-[1.4rem] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
            <div className="mt-2 text-2xl font-black text-gold-soft">{value}</div>
            <div className="mt-2 text-xs leading-6 text-muted">{hint}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-5">
          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="label-caps text-gold">Pinned saved queries</div>
                <h3 className="mt-2 text-2xl font-black text-ivory">Priority investigations</h3>
              </div>
            </div>

            <div className="grid gap-3">
              {pinned.length ? (
                pinned.map((item) => (
                  <article
                    key={item.id}
                    className="premium-hover rounded-[1.25rem] border border-white/6 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-ivory">{item.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                          {item.type} · saved {new Date(item.savedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm font-black text-gold-soft">{item.threatScore}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLookup(item.query)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gold/18 bg-gold/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold-soft"
                      >
                        <Play size={14} />
                        Re-run
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePin(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted"
                      >
                        <PinOff size={14} />
                        Unpin
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSaved(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-danger"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
                  No pinned investigations yet.
                </div>
              )}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Recent saved queries</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Analyst history</h3>
            </div>

            <div className="grid gap-3">
              {recent.length ? (
                recent.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-ivory">{item.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                          {item.type} · saved {new Date(item.savedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm font-black text-gold-soft">{item.threatScore}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLookup(item.query)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gold/18 bg-gold/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold-soft"
                      >
                        <Play size={14} />
                        Re-run
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePin(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted"
                      >
                        <Pin size={14} />
                        Pin
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSaved(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-danger"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
                  No saved queries yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Current analyst note</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Working annotation</h3>
            </div>

            {result ? (
              <>
                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-ivory">{result.title || result.query}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {result.type} · threat score {result.threatScore}
                  </div>
                </div>

                <div className="mt-4">
                  <textarea
                    value={currentNote}
                    onChange={(event) => updateNote(event.target.value)}
                    rows={10}
                    placeholder="Write a hunting hypothesis, attribution note or triage comment…"
                    className="w-full rounded-[1.2rem] border border-white/8 bg-black/40 p-4 text-sm text-ivory outline-none placeholder:text-muted"
                  />
                </div>
              </>
            ) : (
              <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-sm leading-7 text-muted">
                Launch a lookup to start writing contextual analyst notes.
              </div>
            )}
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Watchlist snapshot</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Tracked indicators</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {watchlist.length ? (
                watchlist.map((item) => <TagChip key={item.id}>{item.title}</TagChip>)
              ) : (
                <span className="text-sm text-muted">No watchlist items yet.</span>
              )}
            </div>

            <Link
              to="/hunting"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
            >
              <NotebookPen size={16} />
              Open hunting mode
            </Link>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Hunting preview</div>
            <div className="mt-4 grid gap-3">
              {hunting.hypotheses.slice(0, 2).map((item) => (
                <article key={item.id} className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-ivory">{item.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gold-soft">
                    {item.priority} priority
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}